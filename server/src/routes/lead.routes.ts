import { Router } from 'express';
import { LeadController } from '../controllers/lead.controller';
import { authenticate } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';
import {
  createLeadSchema,
  updateLeadSchema,
  leadQuerySchema,
  bulkStatusSchema,
  bulkDeleteSchema,
  createNoteSchema,
} from '../schemas/lead.schema';

const router = Router();

// All lead routes require authentication
router.use(authenticate);

// List & Stats
router.get('/', validateQuery(leadQuerySchema), LeadController.getLeads);
router.get('/stats', LeadController.getStats);

// Bulk Operations
router.patch('/bulk-status', validateBody(bulkStatusSchema), LeadController.bulkUpdateStatus);
router.post('/bulk-delete', validateBody(bulkDeleteSchema), LeadController.bulkDelete);

// Single Lead CRUD
router.get('/:id', LeadController.getLeadById);
router.post('/', validateBody(createLeadSchema), LeadController.createLead);
router.put('/:id', validateBody(updateLeadSchema), LeadController.updateLead);
router.delete('/:id', LeadController.deleteLead);

// Lead Notes / Activity
router.post('/:id/notes', validateBody(createNoteSchema), LeadController.addNote);
router.get('/:id/notes', LeadController.getNotes);

export default router;
