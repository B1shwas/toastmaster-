"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ChevronRight, ListOrdered } from "lucide-react";
import {
  ModalWrapper,
  ModalHeader,
  ModalContent,
  ModalFooter,
} from "@/components/ui/modal-components";
import type { AgendaTemplate } from "@/lib/types/agenda";
import { ROLE_LABELS } from "@/lib/types/agenda";

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: AgendaTemplate;
  onProceed: () => void;
}

export function TemplatePreviewModal({
  isOpen,
  onClose,
  template,
  onProceed,
}: TemplatePreviewModalProps) {
  const totalDuration = template.items.reduce(
    (sum, item) => sum + item.duration,
    0
  );

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <ModalHeader
        title="Template Preview"
        description={`Review the structure of "${template.name}" template`}
        onClose={onClose}
      />

      <ModalContent>
        {/* Template Info */}
        <div className="mb-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {template.name}
              </h3>
              <p className="text-slate-400 text-sm">
                {template.description || "No description"}
              </p>
            </div>
            {template.isDefault && (
              <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-md">
                Default
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <ListOrdered className="w-4 h-4" />
              <span>{template.items.length} items</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{totalDuration} minutes</span>
            </div>
          </div>
        </div>

        {/* Agenda Items List */}
        <div className="space-y-2">
          {template.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-lg transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Sequence Number */}
                <div className="shrink-0 w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <span className="text-cyan-400 text-sm font-semibold">
                    {item.sequence}
                  </span>
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium mb-1">{item.title}</h4>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      <span>
                        {item.customRole || ROLE_LABELS[item.systemRole]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.duration} min</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
          <p className="text-sm text-slate-300">
            <span className="font-semibold text-cyan-400">Next step:</span> You
            will assign members to each unique role. If a role appears multiple
            times, you'll only need to assign it once.
          </p>
        </div>
      </ModalContent>

      <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-sm border-t border-cyan-500/20 px-6 py-4">
        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onProceed}
            className="px-6 py-2 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg font-medium transition-all flex items-center gap-2"
          >
            <p className="hidden sm:block">Proceed to Assign Roles</p>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </ModalWrapper>
  );
}
