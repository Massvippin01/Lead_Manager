import { prisma } from '../lib/prisma';
import { CreateLeadInput, UpdateLeadInput, LeadQueryParams } from '../schemas/lead.schema';
import { AppError } from '../middleware/errorHandler';
import { Prisma } from '@prisma/client';

export class LeadService {
  static async getLeads(userId: string, params: LeadQueryParams) {
    const { search, status, priority, source, preset, sortBy, sortOrder, page, limit } = params;

    let presetFilter: Prisma.LeadWhereInput = {};
    if (preset === 'P1') {
      presetFilter = { priority: 'HIGH' };
    } else if (preset === 'HIGH_VALUE') {
      presetFilter = { value: { gte: 25000 } };
    } else if (preset === 'NEEDS_TOUCH') {
      presetFilter = { status: 'NEW' };
    } else if (preset === 'CLOSING') {
      presetFilter = { status: 'QUALIFIED' };
    }

    const where: Prisma.LeadWhereInput = {
      userId,
      ...presetFilter,
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
      ...(source ? { source } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { company: { contains: search } },
              { email: { contains: search } },
            ],
          }
        : {}),
    };

    const skip = (page - 1) * limit;

    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        include: {
          notes: {
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      leads,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasPrev: page > 1,
        hasNext: page < totalPages,
      },
    };
  }

  static async getStats(userId: string) {
    const [total, newCount, contactedCount, qualifiedCount, lostCount, allLeads, highPriorityCount] =
      await Promise.all([
        prisma.lead.count({ where: { userId } }),
        prisma.lead.count({ where: { userId, status: 'NEW' } }),
        prisma.lead.count({ where: { userId, status: 'CONTACTED' } }),
        prisma.lead.count({ where: { userId, status: 'QUALIFIED' } }),
        prisma.lead.count({ where: { userId, status: 'LOST' } }),
        prisma.lead.findMany({
          where: { userId },
          select: { value: true, status: true, priority: true },
        }),
        prisma.lead.count({ where: { userId, priority: 'HIGH' } }),
      ]);

    const totalPipelineValue = allLeads.reduce((acc, lead) => acc + (lead.value || 0), 0);
    const qualifiedValue = allLeads
      .filter((l) => l.status === 'QUALIFIED')
      .reduce((acc, lead) => acc + (lead.value || 0), 0);

    const conversionRate = total > 0 ? ((qualifiedCount / total) * 100).toFixed(1) : '0';

    return {
      total,
      new: newCount,
      contacted: contactedCount,
      qualified: qualifiedCount,
      lost: lostCount,
      highPriority: highPriorityCount,
      conversionRate: `${conversionRate}%`,
      pipelineValue: totalPipelineValue,
      qualifiedValue,
    };
  }

  static async getLeadById(userId: string, leadId: string) {
    const lead = await prisma.lead.findFirst({
      where: { id: leadId, userId },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!lead) {
      throw new AppError('Lead not found or access denied', 404);
    }

    return lead;
  }

  static async createLead(userId: string, data: CreateLeadInput) {
    const lead = await prisma.lead.create({
      data: {
        ...data,
        userId,
      },
      include: {
        notes: true,
      },
    });

    // Auto-create initial activity event
    await prisma.note.create({
      data: {
        leadId: lead.id,
        content: `Lead created and logged into pipeline under ${lead.source} channel.`,
        type: 'STAGE_CHANGE',
      },
    });

    return lead;
  }

  static async updateLead(userId: string, leadId: string, data: UpdateLeadInput) {
    const currentLead = await this.getLeadById(userId, leadId);

    const updated = await prisma.lead.update({
      where: { id: leadId },
      data,
      include: {
        notes: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    // If status changed, auto-log stage progression audit event
    if (data.status && data.status !== currentLead.status) {
      await prisma.note.create({
        data: {
          leadId,
          content: `Pipeline stage changed from ${currentLead.status} to ${data.status}.`,
          type: 'STAGE_CHANGE',
        },
      });
    }

    return updated;
  }

  static async deleteLead(userId: string, leadId: string) {
    await this.getLeadById(userId, leadId);

    await prisma.lead.delete({
      where: { id: leadId },
    });

    return { message: 'Lead successfully deleted' };
  }

  static async bulkUpdateStatus(userId: string, ids: string[], status: string) {
    const result = await prisma.lead.updateMany({
      where: {
        id: { in: ids },
        userId,
      },
      data: { status },
    });

    // Create audit events for updated leads
    for (const id of ids) {
      try {
        await prisma.note.create({
          data: {
            leadId: id,
            content: `Batch moved to ${status}.`,
            type: 'STAGE_CHANGE',
          },
        });
      } catch {
        // Continue if single note creation fails
      }
    }

    return { updatedCount: result.count };
  }

  static async bulkDelete(userId: string, ids: string[]) {
    const result = await prisma.lead.deleteMany({
      where: {
        id: { in: ids },
        userId,
      },
    });

    return { deletedCount: result.count };
  }

  static async addNote(userId: string, leadId: string, content: string, type: string = 'NOTE') {
    await this.getLeadById(userId, leadId);

    const note = await prisma.note.create({
      data: {
        leadId,
        content,
        type,
      },
    });

    return note;
  }

  static async getNotes(userId: string, leadId: string) {
    await this.getLeadById(userId, leadId);

    const notes = await prisma.note.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
    });

    return notes;
  }

  static async importLeads(userId: string, leads: CreateLeadInput[]) {
    let imported = 0;
    for (const leadData of leads) {
      await prisma.lead.create({
        data: {
          ...leadData,
          userId,
        },
      });
      imported++;
    }

    return { importedCount: imported };
  }
}
