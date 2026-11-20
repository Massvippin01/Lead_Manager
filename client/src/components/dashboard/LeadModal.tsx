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
import { Lead, LeadSource, LeadStatus } from '@/types';
import { User, Mail, Phone, Building2, Globe, CheckCircle2, DollarSign } from 'lucide-react';

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
      // Handled via toast in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">
            {leadToEdit ? 'Edit Lead Profile' : 'Capture New Prospect'}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {leadToEdit
              ? 'Update contact credentials, deal value, acquisition channel, and stage.'
              : 'Add a verified prospect to your sales pipeline.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 py-2">
          {/* Row 1: Name & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="e.g. Eleanor Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`pl-8 text-xs h-9 ${errors.name ? 'border-rose-400' : ''}`}
                />
              </div>
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="e.g. Hill House Capital"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className={`pl-8 text-xs h-9 ${errors.company ? 'border-rose-400' : ''}`}
                />
              </div>
              {errors.company && <p className="text-[11px] text-rose-500 mt-1">{errors.company}</p>}
            </div>
          </div>

          {/* Row 2: Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Work Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="eleanor@hillhouse.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`pl-8 text-xs h-9 ${errors.email ? 'border-rose-400' : ''}`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`pl-8 text-xs h-9 ${errors.phone ? 'border-rose-400' : ''}`}
                />
              </div>
              {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Row 3: Deal Value ($) & Channel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Deal Value ($ USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  type="number"
                  min="0"
                  step="500"
                  placeholder="25000"
                  value={formData.value || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })
                  }
                  className="pl-8 text-xs h-9 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Acquisition Channel
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <select
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value as LeadSource })
                  }
                  className="h-9 w-full pl-8 pr-3 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="WEBSITE">Website</option>
                  <option value="REFERRAL">Referral</option>
                  <option value="COLD_OUTREACH">Cold Outreach</option>
                  <option value="LINKEDIN">LinkedIn</option>
                  <option value="ADVERTISEMENT">Advertisement</option>
                  <option value="EVENT">Event</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pipeline Stage */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pipeline Stage
            </label>
            <div className="relative">
              <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as LeadStatus })
                }
                className="h-9 w-full pl-8 pr-3 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="LOST">Lost</option>
              </select>
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="text-xs h-8 bg-slate-900 hover:bg-slate-800 text-white"
            >
              {isSubmitting
                ? 'Saving...'
                : leadToEdit
                ? 'Update Lead'
                : 'Create Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
