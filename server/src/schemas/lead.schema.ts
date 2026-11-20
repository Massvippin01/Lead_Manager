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

// Phone regex allowing international formats, dashes, spaces, parentheses
const phoneRegex = /^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,5}\)?[-.\s]?)?[\d-.\s]{5,15}$/;

export const createLeadSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().trim().email('Please provide a valid email address').toLowerCase(),
  phone: z.string().trim().min(7, 'Phone number must be at least 7 digits').regex(phoneRegex, 'Please provide a valid phone number'),
  company: z.string().trim().min(1, 'Company name is required').max(120, 'Company cannot exceed 120 characters'),
  source: LeadSourceEnum.default('WEBSITE'),
  status: LeadStatusEnum.default('NEW'),
});

export const updateLeadSchema = createLeadSchema.partial();

export const leadQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: LeadStatusEnum.optional(),
  source: LeadSourceEnum.optional(),
  sortBy: z.enum(['name', 'company', 'status', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type LeadQueryParams = z.infer<typeof leadQuerySchema>;
