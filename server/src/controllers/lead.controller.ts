import { Response, NextFunction } from 'express';
import { LeadService } from '../services/lead.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { LeadQueryParams } from '../schemas/lead.schema';

export class LeadController {
  static async getLeads(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const queryParams = req.query as unknown as LeadQueryParams;
      const result = await LeadService.getLeads(userId, queryParams);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const stats = await LeadService.getStats(userId);

      res.status(200).json({
        success: true,
        data: { stats },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getLeadById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const leadId = req.params.id as string;
      const lead = await LeadService.getLeadById(userId, leadId);

      res.status(200).json({
        success: true,
        data: { lead },
      });
    } catch (error) {
      next(error);
    }
  }

  static async createLead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const lead = await LeadService.createLead(userId, req.body);

      res.status(201).json({
        success: true,
        message: 'Lead created successfully',
        data: { lead },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateLead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const leadId = req.params.id as string;
      const lead = await LeadService.updateLead(userId, leadId, req.body);

      res.status(200).json({
        success: true,
        message: 'Lead updated successfully',
        data: { lead },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteLead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const leadId = req.params.id as string;
      const result = await LeadService.deleteLead(userId, leadId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  static async bulkUpdateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { ids, status } = req.body;
      const result = await LeadService.bulkUpdateStatus(userId, ids, status);

      res.status(200).json({
        success: true,
        message: `Successfully updated ${result.updatedCount} leads`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async bulkDelete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { ids } = req.body;
      const result = await LeadService.bulkDelete(userId, ids);

      res.status(200).json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} leads`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addNote(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const leadId = req.params.id as string;
      const { content, type } = req.body;
      const note = await LeadService.addNote(userId, leadId, content, type);

      res.status(201).json({
        success: true,
        message: 'Activity recorded',
        data: { note },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getNotes(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const leadId = req.params.id as string;
      const notes = await LeadService.getNotes(userId, leadId);

      res.status(200).json({
        success: true,
        data: { notes },
      });
    } catch (error) {
      next(error);
    }
  }

  static async importLeads(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const result = await LeadService.importLeads(userId, req.body.leads);

      res.status(200).json({
        success: true,
        message: `Imported ${result.importedCount} leads successfully`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
