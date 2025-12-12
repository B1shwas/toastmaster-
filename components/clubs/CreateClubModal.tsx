"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  FormField,
  TextInput,
  Textarea,
  SelectInput,
} from "@/components/ui/form-elements";
import { ClubMeetingFrequency } from "@/lib/types/club";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Club name must be at least 3 characters")
    .max(100, "Club name must be less than 100 characters"),
  description: z
    .string()
    .max(255, "Description must be less than 255 characters"),
  district: z.string().max(100, "District must be less than 100 characters"),
  area: z.string().max(100, "Area must be less than 100 characters"),
  division: z.string().max(100, "Division must be less than 100 characters"),
  meetingFrequency: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY"]),
});

type FormData = z.infer<typeof formSchema>;

export type CreateClubInput = FormData;

interface CreateClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateClubInput) => Promise<void>;
  isLoading?: boolean;
}

const MEETING_FREQUENCY_OPTIONS = [
  { value: ClubMeetingFrequency.WEEKLY, label: "Weekly" },
  { value: ClubMeetingFrequency.BIWEEKLY, label: "Bi-weekly" },
  { value: ClubMeetingFrequency.MONTHLY, label: "Monthly" },
];

export function CreateClubModal({
  isOpen,
  onClose,
  onCreate,
  isLoading = false,
}: CreateClubModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      district: "",
      area: "",
      division: "",
      meetingFrequency: ClubMeetingFrequency.WEEKLY,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: CreateClubInput) => {
    try {
      await onCreate(data);
      reset();
      onClose();
    } catch {
      // Error handling is done in the parent component
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create a New Club"
      icon={Plus}
      iconColorClass="text-emerald-400"
      iconBgClass="bg-emerald-500/20"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Club Name */}
        <FormField label="Club Name" error={errors.name?.message} required>
          <TextInput
            {...register("name")}
            placeholder="Enter club name"
            error={!!errors.name}
            focusColor="emerald"
            disabled={isLoading}
          />
        </FormField>

        {/* Description */}
        <FormField label="Description" error={errors.description?.message}>
          <Textarea
            {...register("description")}
            placeholder="Describe your club"
            rows={3}
            error={!!errors.description}
            focusColor="emerald"
            disabled={isLoading}
          />
        </FormField>

        {/* District, Division, Area */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              name: "district" as const,
              label: "District",
              placeholder: "e.g., District 41",
            },
            {
              name: "division" as const,
              label: "Division",
              placeholder: "e.g., Division A",
            },
            {
              name: "area" as const,
              label: "Area",
              placeholder: "e.g., Area 12",
            },
          ].map(({ name, label, placeholder }) => (
            <FormField key={name} label={label} error={errors[name]?.message}>
              <TextInput
                {...register(name)}
                placeholder={placeholder}
                error={!!errors[name]}
                focusColor="emerald"
                disabled={isLoading}
                className="text-sm px-3"
              />
            </FormField>
          ))}
        </div>

        {/* Meeting Frequency */}
        <FormField
          label="Meeting Frequency"
          error={errors.meetingFrequency?.message}
        >
          <SelectInput
            {...register("meetingFrequency")}
            options={MEETING_FREQUENCY_OPTIONS}
            error={!!errors.meetingFrequency}
            focusColor="emerald"
            disabled={isLoading}
          />
        </FormField>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            onClick={handleClose}
            className="flex-1 bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={isLoading || !isValid}
          >
            {isLoading ? "Creating..." : "Create Club"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
