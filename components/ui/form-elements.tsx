"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

// ============================================
// Base Input Styles
// ============================================
const baseInputStyles =
  "w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const getInputStyles = (
  error?: boolean,
  focusColor: "blue" | "emerald" = "blue"
) => {
  const focusRing =
    focusColor === "emerald" ? "focus:ring-emerald-500" : "focus:ring-blue-500";
  const borderColor = error ? "border-red-500" : "border-slate-700";
  return cn(baseInputStyles, borderColor, focusRing);
};

// ============================================
// Form Field Wrapper
// ============================================
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  error,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}

// ============================================
// Text Input
// ============================================
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  focusColor?: "blue" | "emerald";
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ error, focusColor = "blue", className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(getInputStyles(error, focusColor), className)}
        {...props}
      />
    );
  }
);
TextInput.displayName = "TextInput";

// ============================================
// Textarea
// ============================================
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  focusColor?: "blue" | "emerald";
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, focusColor = "blue", className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          getInputStyles(error, focusColor),
          "resize-none",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

// ============================================
// Select
// ============================================
interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  error?: boolean;
  focusColor?: "blue" | "emerald";
}

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ options, error, focusColor = "blue", className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(getInputStyles(error, focusColor), className)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);
SelectInput.displayName = "SelectInput";
