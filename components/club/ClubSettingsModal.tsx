"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settings, Plus, Trash2, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  FormField,
  TextInput,
  Textarea,
  SelectInput,
} from "@/components/ui/form-elements";
import { clubSettingsSchema, type ClubSettingsInput } from "@/lib/schemas/club.schema";
import { ClubMeetingFrequency, ClubMeetingMode, type Club } from "@/lib/types/club";

interface ClubSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ClubSettingsInput) => Promise<void>;
  club: Club;
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

export function ClubSettingsModal({
  isOpen,
  onClose,
  onSave,
  club,
  isLoading = false,
}: ClubSettingsModalProps) {
  const [socialLinks, setSocialLinks] = useState<string[]>(
    club.socialLinks && club.socialLinks.length > 0 ? club.socialLinks : [""]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ClubSettingsInput>({
    resolver: zodResolver(clubSettingsSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: club.name,
        description: club.description ?? "",
        district: club.district ?? "",
        area: club.area ?? "",
        division: club.division ?? "",
        meetingFrequency: club.meetingFrequency,
        meetingMode: club.meetingMode,
        charterDate: club.charterDate
          ? new Date(club.charterDate).toISOString().split("T")[0]
          : "",
      });
      setSocialLinks(
        club.socialLinks && club.socialLinks.length > 0 ? club.socialLinks : [""]
      );
    }
  }, [isOpen, club, reset]);

  const onSubmit = async (data: ClubSettingsInput) => {
    const filteredLinks = socialLinks.filter((l) => l.trim() !== "");
    await onSave({ ...data, socialLinks: filteredLinks.length > 0 ? filteredLinks : [] });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Club Settings"
      icon={Settings}
      iconColorClass="text-cyan-400"
      iconBgClass="bg-cyan-500/20"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Club Name" error={errors.name?.message} required>
          <TextInput
            {...register("name")}
            placeholder="Enter club name"
            error={!!errors.name}
            focusColor="blue"
            disabled={isLoading}
          />
        </FormField>

        <FormField label="Description" error={errors.description?.message}>
          <Textarea
            {...register("description")}
            placeholder="Describe your club"
            rows={3}
            error={!!errors.description}
            focusColor="blue"
            disabled={isLoading}
          />
        </FormField>

        <div className="grid grid-cols-3 gap-3">
          {[
            { name: "district" as const, label: "District", placeholder: "e.g., 41" },
            { name: "division" as const, label: "Division", placeholder: "e.g., B" },
            { name: "area" as const, label: "Area", placeholder: "e.g., 03" },
          ].map(({ name, label, placeholder }) => (
            <FormField key={name} label={label} error={errors[name]?.message}>
              <TextInput
                {...register(name)}
                placeholder={placeholder}
                error={!!errors[name]}
                focusColor="blue"
                disabled={isLoading}
                className="text-sm px-3"
              />
            </FormField>
          ))}
        </div>

        <FormField label="Meeting Frequency" error={errors.meetingFrequency?.message}>
          <SelectInput
            {...register("meetingFrequency")}
            options={MEETING_FREQUENCY_OPTIONS}
            error={!!errors.meetingFrequency}
            focusColor="blue"
            disabled={isLoading}
          />
        </FormField>

        <FormField label="Meeting Mode" error={errors.meetingMode?.message}>
          <SelectInput
            {...register("meetingMode")}
            options={MEETING_MODE_OPTIONS}
            error={!!errors.meetingMode}
            focusColor="blue"
            disabled={isLoading}
          />
        </FormField>

        <FormField label="Charter Date" error={errors.charterDate?.message}>
          <input
            type="date"
            {...register("charterDate")}
            disabled={isLoading}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </FormField>

        {/* Social Media Links */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-slate-300 text-sm font-medium">
              Social Media Links
              <span className="ml-2 text-slate-500 text-xs font-normal">(up to 3)</span>
            </label>
            {socialLinks.length < 3 && (
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setSocialLinks((prev) => [...prev, ""])}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                Add link
              </button>
            )}
          </div>
          <div className="space-y-2">
            {socialLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => {
                      const updated = [...socialLinks];
                      updated[index] = e.target.value;
                      setSocialLinks(updated);
                    }}
                    disabled={isLoading}
                    placeholder="https://www.facebook.com/..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  />
                </div>
                {socialLinks.length > 1 && (
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() =>
                      setSocialLinks((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="text-slate-500 hover:text-red-400 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
            disabled={isLoading || !isValid}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
