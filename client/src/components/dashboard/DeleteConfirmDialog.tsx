'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lead } from '@/types';
import { AlertCircle } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  lead,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="flex flex-col items-center sm:items-start">
          <div className="h-10 w-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-1">
            <AlertCircle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-base font-bold text-slate-900">
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 mt-1">
            Are you sure you want to remove{' '}
            <span className="font-semibold text-slate-800">{lead.name}</span> (
            {lead.company}) from your pipeline? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={isDeleting}
            className="text-xs"
          >
            {isDeleting ? 'Deleting...' : 'Delete Lead'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
