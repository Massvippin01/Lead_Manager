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
import { Command, Keyboard } from 'lucide-react';

interface KeyboardShortcutsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsDialog: React.FC<KeyboardShortcutsDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const shortcuts = [
    { key: '/', description: 'Focus global lead search' },
    { key: 'Ctrl + K', description: 'Jump to search input' },
    { key: 'N', description: 'Capture new lead modal' },
    { key: 'V', description: 'Toggle Table vs Kanban view' },
    { key: '?', description: 'Show keyboard shortcuts guide' },
    { key: 'Esc', description: 'Dismiss drawer or dialog' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2 text-zinc-900 mb-1">
            <Keyboard className="h-5 w-5 text-zinc-700" />
            <DialogTitle className="text-base font-bold">
              Keyboard Shortcuts
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-zinc-500">
            Speed up your sales pipeline operations with these hotkeys.
          </DialogDescription>
        </DialogHeader>

        <div className="divide-y divide-zinc-100 py-2">
          {shortcuts.map((sc) => (
            <div
              key={sc.key}
              className="py-2.5 flex items-center justify-between text-xs"
            >
              <span className="text-zinc-600">{sc.description}</span>
              <kbd className="px-2 py-1 rounded bg-zinc-100 border border-zinc-200 text-zinc-800 font-mono text-[11px] font-semibold shadow-2xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" size="sm" onClick={onClose} className="w-full">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
