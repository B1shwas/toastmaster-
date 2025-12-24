"use client";

import React from "react";
import { motion } from "framer-motion";
import { LayoutTemplate, PlusCircle, LucideIcon } from "lucide-react";
import {
  ModalWrapper,
  ModalHeader,
  ModalContent,
} from "@/components/ui/modal-components";

interface AddAgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: "template" | "single") => void;
}

interface OptionCard {
  mode: "template" | "single";
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  hoverIconBg: string;
  titleColor: string;
  title: string;
  description: string;
}

const OPTIONS: OptionCard[] = [
  {
    mode: "template",
    icon: LayoutTemplate,
    iconColor: "text-cyan-400",
    iconBgColor: "bg-cyan-500/10",
    hoverIconBg: "group-hover:bg-cyan-500/20",
    titleColor: "group-hover:text-cyan-400",
    title: "Create from Template",
    description:
      "Use a pre-built template to quickly set up your meeting agenda with all standard roles",
  },
  {
    mode: "single",
    icon: PlusCircle,
    iconColor: "text-blue-400",
    iconBgColor: "bg-blue-500/10",
    hoverIconBg: "group-hover:bg-blue-500/20",
    titleColor: "group-hover:text-blue-400",
    title: "Add Single Agenda",
    description:
      "Manually add individual agenda items one at a time with custom details",
  },
];

export function AddAgendaModal({
  isOpen,
  onClose,
  onSelectMode,
}: AddAgendaModalProps) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <ModalHeader
        title="Add Agenda"
        description="Choose how you want to create your meeting agenda"
        onClose={onClose}
      />

      <ModalContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <motion.button
                key={option.mode}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectMode(option.mode)}
                className="p-6 bg-slate-800/50 hover:bg-slate-700/50 border-2 border-slate-700 hover:border-cyan-500/50 rounded-xl text-left transition-all group"
              >
                <div
                  className={`w-12 h-12 ${option.iconBgColor} rounded-lg flex items-center justify-center mb-4 ${option.hoverIconBg} transition-colors`}
                >
                  <Icon className={`w-6 h-6 ${option.iconColor}`} />
                </div>
                <h3
                  className={`text-lg font-semibold text-white mb-2 ${option.titleColor} transition-colors`}
                >
                  {option.title}
                </h3>
                <p className="text-slate-400 text-sm">{option.description}</p>
              </motion.button>
            );
          })}
        </div>
      </ModalContent>
    </ModalWrapper>
  );
}
