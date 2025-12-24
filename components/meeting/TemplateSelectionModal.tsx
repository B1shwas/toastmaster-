"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import {
  ModalWrapper,
  ModalHeader,
  ModalContent,
} from "@/components/ui/modal-components";
import {
  useSystemTemplates,
  useClubTemplates,
} from "@/lib/api/hooks/use-agenda";
import type { AgendaTemplate } from "@/lib/types/agenda";

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: AgendaTemplate) => void;
  clubId?: string;
}

export function TemplateSelectionModal({
  isOpen,
  onClose,
  onSelectTemplate,
  clubId,
}: TemplateSelectionModalProps) {
  const { data: systemTemplates, isLoading: isLoadingSystem } =
    useSystemTemplates();
  const { data: clubTemplates, isLoading: isLoadingClub } = useClubTemplates(
    clubId || ""
  );

  const allTemplates = [
    ...(systemTemplates?.data || []),
    ...(clubTemplates?.data || []),
  ];

  const isLoading = isLoadingSystem || (clubId && isLoadingClub);

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <ModalHeader
        title="Select Template"
        description="Choose a template to preview its structure and create your meeting agenda"
        onClose={onClose}
      />

      <ModalContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500"></div>
          </div>
        ) : allTemplates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No templates available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allTemplates.map((template) => (
              <motion.button
                key={template.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectTemplate(template)}
                className="p-6 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-cyan-500/50 rounded-xl text-left transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    {template.name}
                  </h3>
                  {template.isDefault && (
                    <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-md">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm mb-4">
                  {template.description || "No description"}
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{template.items?.length || 0} items</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {template.items?.reduce(
                        (sum, item) => sum + item.duration,
                        0
                      ) || 0}{" "}
                      min
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-cyan-400 text-sm font-medium">
                  Use Template
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </ModalContent>
    </ModalWrapper>
  );
}
