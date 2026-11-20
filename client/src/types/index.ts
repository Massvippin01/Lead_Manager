export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST';

export type LeadPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export type LeadSource =
  | 'WEBSITE'
  | 'REFERRAL'
  | 'COLD_OUTREACH'
  | 'LINKEDIN'
  | 'ADVERTISEMENT'
  | 'EVENT'
  | 'OTHER';

export interface Note {
  id: string;
  content: string;
  type: 'NOTE' | 'CALL' | 'STAGE_CHANGE';
  leadId: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  value: number;
  priority: LeadPriority;
  source: LeadSource;
  status: LeadStatus;
  userId: string;
  notes?: Note[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  lost: number;
  highPriority: number;
  conversionRate: string;
  pipelineValue: number;
  qualifiedValue: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export interface LeadQueryParams {
  search?: string;
  status?: LeadStatus;
  priority?: LeadPriority;
  source?: LeadSource;
  preset?: 'ALL' | 'P1' | 'HIGH_VALUE' | 'NEEDS_TOUCH' | 'CLOSING';
  sortBy?: 'name' | 'company' | 'status' | 'value' | 'priority' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
