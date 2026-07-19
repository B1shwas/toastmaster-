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
import { ClubMeetingFrequency, ClubMeetingMode } from "@/lib/types/club";

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
  meetingMode: z.enum(["ONLINE", "OFFLINE", "HYBRID"]),
  charterDate: z.string().optional(),
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

const MEETING_MODE_OPTIONS = [
  { value: ClubMeetingMode.OFFLINE, label: "Offline" },
  { value: ClubMeetingMode.ONLINE, label: "Online" },
  { value: ClubMeetingMode.HYBRID, label: "Hybrid" },
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
      meetingMode: ClubMeetingMode.OFFLINE,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: CreateClubInput) => {
    await onCreate(data);
    // Only reset and close if the mutation was successful
    // The parent component will handle errors
    reset();
    onClose();
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

        {/* Meeting Mode */}
        <FormField
          label="Meeting Mode"
          error={errors.meetingMode?.message}
        >
          <SelectInput
            {...register("meetingMode")}
            options={MEETING_MODE_OPTIONS}
            error={!!errors.meetingMode}
            focusColor="emerald"
            disabled={isLoading}
          />
        </FormField>

        {/* Charter Date */}
        <FormField label="Charter Date" error={errors.charterDate?.message}>
          <input
            type="date"
            {...register("charterDate")}
            disabled={isLoading}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
