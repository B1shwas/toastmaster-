"use client";

import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: LucideIcon;
  iconColorClass?: string;
  iconBgClass?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg";
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export function Modal({
  isOpen,
  onClose,
  title,
  icon: Icon,
  iconColorClass = "text-blue-400",
  iconBgClass = "bg-blue-500/20",
  children,
  maxWidth = "md",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full ${maxWidthClasses[maxWidth]} mx-4 shadow-xl max-h-[90vh] overflow-y-auto`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 ${iconBgClass} rounded-lg`}>
            <Icon className={`h-5 w-5 ${iconColorClass}`} />
          </div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
