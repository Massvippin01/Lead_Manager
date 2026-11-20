import { prisma } from '../lib/prisma';
import { CreateLeadInput, UpdateLeadInput, LeadQueryParams } from '../schemas/lead.schema';
import { AppError } from '../middleware/errorHandler';
import { Prisma } from '@prisma/client';

export class LeadService {
  static async getLeads(userId: string, params: LeadQueryParams) {
    const { search, status, source, sortBy, sortOrder, page, limit } = params;

    const where: Prisma.LeadWhereInput = {
      userId,
      ...(status ? { status } : {}),
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
    const [total, newCount, contactedCount, qualifiedCount, lostCount, allLeads] =
      await Promise.all([
        prisma.lead.count({ where: { userId } }),
        prisma.lead.count({ where: { userId, status: 'NEW' } }),
        prisma.lead.count({ where: { userId, status: 'CONTACTED' } }),
        prisma.lead.count({ where: { userId, status: 'QUALIFIED' } }),
        prisma.lead.count({ where: { userId, status: 'LOST' } }),
        prisma.lead.findMany({
          where: { userId },
          select: { value: true, status: true },
        }),
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

    return lead;
  }

  static async updateLead(userId: string, leadId: string, data: UpdateLeadInput) {
    await this.getLeadById(userId, leadId);

    const updated = await prisma.lead.update({
      where: { id: leadId },
      data,
      include: {
        notes: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

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

  static async addNote(userId: string, leadId: string, content: string) {
    await this.getLeadById(userId, leadId);

    const note = await prisma.note.create({
      data: {
        leadId,
        content,
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
}
