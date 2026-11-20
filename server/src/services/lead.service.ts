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
    const [total, newCount, contactedCount, qualifiedCount, lostCount] = await Promise.all([
      prisma.lead.count({ where: { userId } }),
      prisma.lead.count({ where: { userId, status: 'NEW' } }),
      prisma.lead.count({ where: { userId, status: 'CONTACTED' } }),
      prisma.lead.count({ where: { userId, status: 'QUALIFIED' } }),
      prisma.lead.count({ where: { userId, status: 'LOST' } }),
    ]);

    const conversionRate = total > 0 ? ((qualifiedCount / total) * 100).toFixed(1) : '0';

    return {
      total,
      new: newCount,
      contacted: contactedCount,
      qualified: qualifiedCount,
      lost: lostCount,
      conversionRate: `${conversionRate}%`,
    };
  }

  static async getLeadById(userId: string, leadId: string) {
    const lead = await prisma.lead.findFirst({
      where: { id: leadId, userId },
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
    });

    return lead;
  }

  static async updateLead(userId: string, leadId: string, data: UpdateLeadInput) {
    // Verify ownership
    await this.getLeadById(userId, leadId);

    const updated = await prisma.lead.update({
      where: { id: leadId },
      data,
    });

    return updated;
  }

  static async deleteLead(userId: string, leadId: string) {
    // Verify ownership
    await this.getLeadById(userId, leadId);

    await prisma.lead.delete({
      where: { id: leadId },
    });

    return { message: 'Lead successfully deleted' };
  }
}
