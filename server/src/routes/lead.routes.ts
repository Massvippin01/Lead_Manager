import { Router } from 'express';
import { LeadController } from '../controllers/lead.controller';
import { authenticate } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';
import { createLeadSchema, updateLeadSchema, leadQuerySchema } from '../schemas/lead.schema';

const router = Router();

// All lead routes require authentication
router.use(authenticate);

router.get('/', validateQuery(leadQuerySchema), LeadController.getLeads);
router.get('/stats', LeadController.getStats);
router.get('/:id', LeadController.getLeadById);
router.post('/', validateBody(createLeadSchema), LeadController.createLead);
router.put('/:id', validateBody(updateLeadSchema), LeadController.updateLead);
router.delete('/:id', LeadController.deleteLead);

export default router;
