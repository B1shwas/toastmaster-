import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface FormCheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  error?: string;
}

export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ label, error, className = "", onChange, ...props }, ref) => {
    return (
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            onCheckedChange={(checked) => {
              const event = {
                target: {
                  name: props.name,
                  value: checked,
                  checked: checked === true,
                },
              } as any;
              onChange?.(event);
            }}
          />
          <span className="text-slate-400 text-sm">{label}</span>
        </label>
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

FormCheckbox.displayName = "FormCheckbox";
