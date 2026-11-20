import { z } from 'zod';

export const LeadSourceEnum = z.enum([
  'WEBSITE',
  'REFERRAL',
  'COLD_OUTREACH',
  'LINKEDIN',
  'ADVERTISEMENT',
  'EVENT',
  'OTHER',
]);

export const LeadStatusEnum = z.enum([
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'LOST',
]);

export const LeadPriorityEnum = z.enum([
  'HIGH',
  'MEDIUM',
  'LOW',
]);

export const NoteTypeEnum = z.enum([
  'NOTE',
  'CALL',
  'STAGE_CHANGE',
]);

const phoneRegex = /^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,5}\)?[-.\s]?)?[\d-.\s]{5,15}$/;

export const createLeadSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().trim().email('Please provide a valid email address').toLowerCase(),
  phone: z.string().trim().min(7, 'Phone number must be at least 7 digits').regex(phoneRegex, 'Please provide a valid phone number'),
  company: z.string().trim().min(1, 'Company name is required').max(120, 'Company cannot exceed 120 characters'),
  value: z.coerce.number().nonnegative('Deal value must be 0 or positive').default(0),
  priority: LeadPriorityEnum.default('MEDIUM'),
  source: LeadSourceEnum.default('WEBSITE'),
  status: LeadStatusEnum.default('NEW'),
});

export const updateLeadSchema = createLeadSchema.partial();

export const leadQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: LeadStatusEnum.optional(),
  priority: LeadPriorityEnum.optional(),
  source: LeadSourceEnum.optional(),
  preset: z.enum(['ALL', 'P1', 'HIGH_VALUE', 'NEEDS_TOUCH', 'CLOSING']).optional(),
  sortBy: z.enum(['name', 'company', 'status', 'value', 'priority', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const bulkStatusSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, 'At least one lead ID is required'),
  status: LeadStatusEnum,
});

export const bulkDeleteSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, 'At least one lead ID is required'),
});

export const createNoteSchema = z.object({
  content: z.string().trim().min(1, 'Note content cannot be empty').max(1000, 'Note cannot exceed 1000 characters'),
  type: NoteTypeEnum.default('NOTE'),
});

export const importLeadsSchema = z.object({
  leads: z.array(createLeadSchema).min(1, 'At least one lead required for import').max(500, 'Batch size limit is 500 leads'),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type LeadQueryParams = z.infer<typeof leadQuerySchema>;
export type BulkStatusInput = z.infer<typeof bulkStatusSchema>;
export type BulkDeleteInput = z.infer<typeof bulkDeleteSchema>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type ImportLeadsInput = z.infer<typeof importLeadsSchema>;
