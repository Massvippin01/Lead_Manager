'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Lead, LeadPriority, LeadSource, LeadStatus } from '@/types';
import { User, Mail, Phone, Building2, Globe, CheckCircle2, DollarSign, Flame } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  leadToEdit: Lead | null;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => Promise<void>;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  value: number;
  priority: LeadPriority;
  source: LeadSource;
  status: LeadStatus;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  leadToEdit,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    value: 0,
    priority: 'MEDIUM',
    source: 'WEBSITE',
    status: 'NEW',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (leadToEdit) {
      setFormData({
        name: leadToEdit.name,
        email: leadToEdit.email,
        phone: leadToEdit.phone,
        company: leadToEdit.company,
        value: leadToEdit.value || 0,
        priority: leadToEdit.priority || 'MEDIUM',
        source: leadToEdit.source,
        status: leadToEdit.status,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        value: 0,
        priority: 'MEDIUM',
        source: 'WEBSITE',
        status: 'NEW',
      });
    }
    setErrors({});
  }, [leadToEdit, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    const phoneRegex = /^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,5}\)?[-.\s]?)?[\d-.\s]{5,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Enter a valid telephone number';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (formData.value < 0) {
      newErrors.value = 'Value cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch {
      // Toast handles in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-zinc-900">
            {leadToEdit ? 'Edit Prospect Details' : 'Capture New Prospect'}
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500">
            {leadToEdit
              ? 'Update contact credentials, priority score, deal value, and pipeline stage.'
              : 'Add an account to your organization sales pipeline.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 py-1">
          {/* Row 1: Name & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="e.g. Eleanor Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`pl-8 text-xs h-8 ${errors.name ? 'border-rose-400' : ''}`}
                />
              </div>
              {errors.name && <p className="text-[10px] text-rose-500 mt-0.5">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="e.g. Hill House Capital"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className={`pl-8 text-xs h-8 ${errors.company ? 'border-rose-400' : ''}`}
                />
              </div>
              {errors.company && <p className="text-[10px] text-rose-500 mt-0.5">{errors.company}</p>}
            </div>
          </div>

          {/* Row 2: Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Work Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <Input
                  type="email"
                  placeholder="eleanor@hillhouse.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`pl-8 text-xs h-8 ${errors.email ? 'border-rose-400' : ''}`}
                />
              </div>
              {errors.email && <p className="text-[10px] text-rose-500 mt-0.5">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`pl-8 text-xs h-8 font-mono ${errors.phone ? 'border-rose-400' : ''}`}
                />
              </div>
              {errors.phone && <p className="text-[10px] text-rose-500 mt-0.5">{errors.phone}</p>}
            </div>
          </div>

          {/* Row 3: Deal Value ($) & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Deal Value ($ USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <Input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="25000"
                  value={formData.value || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })
                  }
                  className="pl-8 text-xs h-8 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Priority Ranking
              </label>
              <Select
                value={formData.priority}
                onValueChange={(val) =>
                  setFormData({ ...formData, priority: val as LeadPriority })
                }
              >
                <SelectTrigger className="h-8 text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <Flame
                      className={`h-3.5 w-3.5 ${
                        formData.priority === 'HIGH'
                          ? 'text-rose-500'
                          : formData.priority === 'MEDIUM'
                          ? 'text-amber-500'
                          : 'text-zinc-400'
                      }`}
                    />
                    <SelectValue placeholder="Select Priority" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HIGH">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      <span className="font-medium text-rose-700">P1 - High (Urgent)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="MEDIUM">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      <span className="font-medium text-amber-700">P2 - Medium (Standard)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="LOW">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-zinc-400" />
                      <span className="font-medium text-zinc-600">P3 - Low (Nurture)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 4: Channel & Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Acquisition Channel
              </label>
              <Select
                value={formData.source}
                onValueChange={(val) =>
                  setFormData({ ...formData, source: val as LeadSource })
                }
              >
                <SelectTrigger className="h-8 text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-zinc-400" />
                    <SelectValue placeholder="Select Source" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEBSITE">Website</SelectItem>
                  <SelectItem value="REFERRAL">Referral</SelectItem>
                  <SelectItem value="COLD_OUTREACH">Cold Outreach</SelectItem>
                  <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                  <SelectItem value="ADVERTISEMENT">Advertisement</SelectItem>
                  <SelectItem value="EVENT">Event</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Pipeline Stage
              </label>
              <Select
                value={formData.status}
                onValueChange={(val) =>
                  setFormData({ ...formData, status: val as LeadStatus })
                }
              >
                <SelectTrigger className="h-8 text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        formData.status === 'NEW'
                          ? 'bg-sky-500'
                          : formData.status === 'CONTACTED'
                          ? 'bg-amber-500'
                          : formData.status === 'QUALIFIED'
                          ? 'bg-emerald-600'
                          : 'bg-zinc-400'
                      }`}
                    />
                    <SelectValue placeholder="Select Stage" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-sky-500" />
                      <span>New</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="CONTACTED">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      <span>Contacted</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="QUALIFIED">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-600" />
                      <span>Qualified</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="LOST">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-zinc-400" />
                      <span>Lost</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-2.5 border-t border-zinc-100 flex items-center justify-end space-x-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs h-7"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="text-xs h-7 bg-zinc-900 hover:bg-zinc-800 text-white"
            >
              {isSubmitting ? 'Saving...' : leadToEdit ? 'Update Lead' : 'Create Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
