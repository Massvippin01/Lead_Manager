'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { LeadPriority, LeadSource, LeadStatus } from '@/types';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (leads: any[]) => Promise<void>;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [csvText, setCsvText] = useState('');
  const [parsedLeads, setParsedLeads] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const sampleCsv = `Name,Email,Phone,Company,Deal Value,Priority,Source,Status
Alexander Pierce,pierce@worldsecurity.org,+1 (555) 345-0987,World Security,75000,HIGH,LINKEDIN,QUALIFIED
Jessica Jones,jessica@aliasinv.com,+1 (555) 789-3210,Alias Investigations,18000,MEDIUM,REFERRAL,CONTACTED
Matt Murdock,matt@nelsonmurdock.law,+1 (555) 432-8765,Nelson & Murdock,32000,HIGH,WEBSITE,NEW`;

  const parseCsv = (text: string) => {
    setErrorMsg(null);
    try {
      const lines = text.trim().split('\n');
      if (lines.length < 2) {
        throw new Error('CSV must contain a header row and at least one data row.');
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const nameIdx = headers.findIndex((h) => h.includes('name'));
      const emailIdx = headers.findIndex((h) => h.includes('email'));
      const phoneIdx = headers.findIndex((h) => h.includes('phone'));
      const compIdx = headers.findIndex((h) => h.includes('comp'));
      const valIdx = headers.findIndex((h) => h.includes('val') || h.includes('deal'));
      const prioIdx = headers.findIndex((h) => h.includes('prio'));
      const srcIdx = headers.findIndex((h) => h.includes('source') || h.includes('chan'));
      const statIdx = headers.findIndex((h) => h.includes('stat'));

      if (nameIdx === -1 || emailIdx === -1 || compIdx === -1) {
        throw new Error('CSV must contain "Name", "Email", and "Company" headers.');
      }

      const leads: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Simple CSV splitter
        const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
        const name = cols[nameIdx];
        const email = cols[emailIdx];
        const company = cols[compIdx];
        const phone = phoneIdx !== -1 && cols[phoneIdx] ? cols[phoneIdx] : '+1 (555) 000-0000';
        const value = valIdx !== -1 && parseFloat(cols[valIdx]) ? parseFloat(cols[valIdx]) : 0;
        const priority: LeadPriority = prioIdx !== -1 && ['HIGH', 'MEDIUM', 'LOW'].includes(cols[prioIdx].toUpperCase()) ? cols[prioIdx].toUpperCase() as any : 'MEDIUM';
        const source: LeadSource = srcIdx !== -1 && ['WEBSITE', 'REFERRAL', 'COLD_OUTREACH', 'LINKEDIN', 'ADVERTISEMENT', 'EVENT', 'OTHER'].includes(cols[srcIdx].toUpperCase()) ? cols[srcIdx].toUpperCase() as any : 'WEBSITE';
        const status: LeadStatus = statIdx !== -1 && ['NEW', 'CONTACTED', 'QUALIFIED', 'LOST'].includes(cols[statIdx].toUpperCase()) ? cols[statIdx].toUpperCase() as any : 'NEW';

        if (name && email && company) {
          leads.push({ name, email, phone, company, value, priority, source, status });
        }
      }

      if (leads.length === 0) {
        throw new Error('No valid leads parsed from CSV.');
      }

      setParsedLeads(leads);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse CSV');
      setParsedLeads([]);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCsvText(val);
    if (val.trim()) {
      parseCsv(val);
    } else {
      setParsedLeads([]);
      setErrorMsg(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
      parseCsv(content);
    };
    reader.readAsText(file);
  };

  const loadSample = () => {
    setCsvText(sampleCsv);
    parseCsv(sampleCsv);
  };

  const handleImportSubmit = async () => {
    if (parsedLeads.length === 0) return;
    setIsImporting(true);
    try {
      await onImport(parsedLeads);
      onClose();
      setCsvText('');
      setParsedLeads([]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Import failed');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center space-x-2 text-zinc-900">
            <Upload className="h-5 w-5 text-zinc-700" />
            <DialogTitle className="text-base font-bold">Import Leads from CSV</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-zinc-500">
            Batch-upload multiple prospects using CSV format with header mapping.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* File Picker or Paste Area */}
          <div className="flex items-center justify-between text-xs text-zinc-600">
            <div className="flex items-center space-x-2">
              <label className="cursor-pointer font-semibold text-zinc-900 hover:underline inline-flex items-center">
                <FileText className="h-3.5 w-3.5 mr-1" />
                Upload .csv file
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span>or paste CSV below</span>
            </div>

            <button
              type="button"
              onClick={loadSample}
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 underline"
            >
              Insert sample CSV
            </button>
          </div>

          <textarea
            rows={6}
            value={csvText}
            onChange={handleTextChange}
            placeholder={`Name,Email,Phone,Company,Deal Value,Priority,Source,Status\nJohn Doe,john@acme.com,+1 555-1234,Acme,50000,HIGH,WEBSITE,NEW`}
            className="w-full text-xs font-mono p-2.5 rounded-lg border border-zinc-200 bg-zinc-50/70 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />

          {/* Validation Feedback */}
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {parsedLeads.length > 0 && (
            <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-zinc-900">
                  {parsedLeads.length} valid prospect{parsedLeads.length > 1 ? 's' : ''} ready to import
                </span>
              </div>
              <span className="text-[11px] text-zinc-500">
                Headers verified
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2 flex items-center justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isImporting}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleImportSubmit}
            disabled={parsedLeads.length === 0 || isImporting}
          >
            {isImporting ? 'Importing...' : `Import ${parsedLeads.length} Leads`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
