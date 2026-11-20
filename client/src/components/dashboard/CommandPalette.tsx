'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Table as TableIcon,
  LayoutGrid,
  Upload,
  Download,
  Flame,
  DollarSign,
  Keyboard,
  LogOut,
  Building2,
  ChevronRight,
  Sparkles,
  Command,
  AlignJustify,
  Rows,
} from 'lucide-react';
import { Lead } from '@/types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onOpenCreateModal: () => void;
  onToggleViewMode: () => void;
  onToggleDensity: () => void;
  onOpenImportModal: () => void;
  onExportCsv: () => void;
  onOpenShortcuts: () => void;
  onFilterPreset: (preset: 'P1' | 'HIGH_VALUE' | 'NEEDS_TOUCH' | 'CLOSING') => void;
  onLogout: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  leads,
  onSelectLead,
  onOpenCreateModal,
  onToggleViewMode,
  onToggleDensity,
  onOpenImportModal,
  onExportCsv,
  onOpenShortcuts,
  onFilterPreset,
  onLogout,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter leads based on query
  const filteredLeads = query.trim()
    ? leads
        .filter(
          (l) =>
            l.name.toLowerCase().includes(query.toLowerCase()) ||
            l.company.toLowerCase().includes(query.toLowerCase()) ||
            l.email.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
    : [];

  // Static action commands
  const actions = [
    {
      id: 'create-lead',
      label: 'Create New Prospect',
      shortcut: 'N',
      icon: Plus,
      run: () => {
        onClose();
        onOpenCreateModal();
      },
    },
    {
      id: 'toggle-view',
      label: 'Switch View (Table / Kanban)',
      shortcut: 'V',
      icon: LayoutGrid,
      run: () => {
        onClose();
        onToggleViewMode();
      },
    },
    {
      id: 'toggle-density',
      label: 'Toggle Table Density (Compact / Comfortable)',
      shortcut: 'Shift+D',
      icon: AlignJustify,
      run: () => {
        onClose();
        onToggleDensity();
      },
    },
    {
      id: 'import-csv',
      label: 'Batch Import Prospects from CSV',
      shortcut: 'Ctrl+I',
      icon: Upload,
      run: () => {
        onClose();
        onOpenImportModal();
      },
    },
    {
      id: 'export-csv',
      label: 'Export Pipeline to CSV',
      shortcut: 'Ctrl+E',
      icon: Download,
      run: () => {
        onClose();
        onExportCsv();
      },
    },
    {
      id: 'filter-p1',
      label: 'Filter: P1 Urgent Accounts',
      shortcut: 'P1',
      icon: Flame,
      run: () => {
        onClose();
        onFilterPreset('P1');
      },
    },
    {
      id: 'filter-high-value',
      label: 'Filter: Enterprise Deals (Value > $25k)',
      shortcut: '>$25k',
      icon: DollarSign,
      run: () => {
        onClose();
        onFilterPreset('HIGH_VALUE');
      },
    },
    {
      id: 'shortcuts-modal',
      label: 'Keyboard Shortcuts Reference',
      shortcut: '?',
      icon: Keyboard,
      run: () => {
        onClose();
        onOpenShortcuts();
      },
    },
    {
      id: 'logout',
      label: 'Sign Out of Account',
      shortcut: 'Esc',
      icon: LogOut,
      run: () => {
        onClose();
        onLogout();
      },
    },
  ];

  const filteredActions = query.trim()
    ? actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()))
    : actions;

  const totalItems = filteredLeads.length + filteredActions.length;

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Arrow navigation & Enter execution
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < totalItems ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : Math.max(0, totalItems - 1)));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex < filteredLeads.length) {
          const lead = filteredLeads[selectedIndex];
          onClose();
          onSelectLead(lead);
        } else {
          const actionIndex = selectedIndex - filteredLeads.length;
          const action = filteredActions[actionIndex];
          if (action) action.run();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, totalItems, selectedIndex, filteredLeads, filteredActions, onClose, onSelectLead]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-start justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity"
        />

        {/* Command Dialog Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-zinc-200 overflow-hidden z-10 divide-y divide-zinc-100"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 py-3 bg-zinc-50/50">
            <Search className="h-4 w-4 text-zinc-400 mr-2.5 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a command or search prospects..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
            />
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 bg-zinc-200/60 rounded border border-zinc-200">
              ESC
            </kbd>
          </div>

          {/* Results Container */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-3">
            {/* Prospects Section */}
            {filteredLeads.length > 0 && (
              <div>
                <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                  Prospects ({filteredLeads.length})
                </div>
                <div className="space-y-0.5 mt-0.5">
                  {filteredLeads.map((lead, idx) => {
                    const isSelected = selectedIndex === idx;
                    return (
                      <button
                        key={lead.id}
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectLead(lead);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
                          isSelected ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div
                            className={`h-6 w-6 rounded flex items-center justify-center font-bold text-[10px] shrink-0 ${
                              isSelected ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'
                            }`}
                          >
                            {lead.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="truncate">
                            <span className="font-semibold">{lead.name}</span>
                            <span className={`ml-2 text-[11px] ${isSelected ? 'text-zinc-300' : 'text-zinc-400'}`}>
                              {lead.company}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0 font-mono text-[11px]">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              isSelected ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'
                            }`}
                          >
                            {lead.status}
                          </span>
                          {lead.value > 0 && (
                            <span className={isSelected ? 'text-emerald-300' : 'text-zinc-700'}>
                              ${lead.value.toLocaleString()}
                            </span>
                          )}
                          <ChevronRight className={`h-3 w-3 ${isSelected ? 'text-white' : 'text-zinc-400'}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions Section */}
            {filteredActions.length > 0 && (
              <div>
                <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                  Quick Actions
                </div>
                <div className="space-y-0.5 mt-0.5">
                  {filteredActions.map((action, idx) => {
                    const isSelected = selectedIndex === filteredLeads.length + idx;
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        type="button"
                        onClick={action.run}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
                          isSelected ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-zinc-500'}`} />
                          <span className="font-medium">{action.label}</span>
                        </div>
                        <kbd
                          className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                            isSelected ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-500'
                          }`}
                        >
                          {action.shortcut}
                        </kbd>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {totalItems === 0 && (
              <div className="py-8 text-center text-xs text-zinc-400 font-mono">
                No commands or prospects matching &ldquo;{query}&rdquo;
              </div>
            )}
          </div>

          {/* Footer Guide */}
          <div className="px-4 py-2 bg-zinc-50 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <div className="flex items-center space-x-3">
              <span>↑↓ Navigate</span>
              <span>↵ Execute</span>
              <span>ESC Dismiss</span>
            </div>
            <div className="flex items-center space-x-1">
              <Command className="h-3 w-3" />
              <span>Raycast-style Command Palette</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
