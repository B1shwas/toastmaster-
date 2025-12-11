import { InputHTMLAttributes, forwardRef } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          {label}
        </label>
        <input
          ref={ref}
          className={`w-full px-4 py-3 bg-slate-800/50 border ${
            error ? "border-red-500" : "border-slate-700"
          } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
            error ? "focus:ring-red-500" : "focus:ring-blue-500"
          } focus:border-transparent transition ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
