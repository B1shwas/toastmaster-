"use client";

import React, { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import {
  createSingleAgendaSchema,
  type CreateSingleAgendaForm,
} from "@/lib/schemas/agenda.schema";
import { useUpdateAgenda } from "@/lib/api/hooks/use-agenda";
import type { ClubMember } from "@/lib/types/club";
import type { Agenda } from "@/lib/types/agenda";
import { SystemRole, ROLE_LABELS } from "@/lib/types/agenda";
import { ModalFooter, ModalHeader, ModalWrapper } from "../ui/modal-components";
import {
  FormField,
  TextInput,
  SelectInput,
  Textarea,
} from "../ui/form-elements";

interface EditAgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  agenda: Agenda | null;
  members: ClubMember[];
  meetingId: string;
  clubId: string;
  onSuccess: () => void;
}

export function EditAgendaModal({
  isOpen,
  onClose,
  agenda,
  members,
  meetingId,
  clubId,
  onSuccess,
}: EditAgendaModalProps) {
  const updateMutation = useUpdateAgenda(meetingId);

  const roleOptions = [
    { value: "", label: "Select a role" },
    ...Object.values(SystemRole).map((role) => ({
      value: ROLE_LABELS[role],
      label: ROLE_LABELS[role],
    })),
  ];

  const memberOptions = [
    { value: "", label: "Select member" },
    ...members.map((member) => ({
      value: member.member_id,
      label: member.member_member_name,
    })),
  ];

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateSingleAgendaForm>({
    resolver: zodResolver(createSingleAgendaSchema),
    mode: "onSubmit",
  });

  const assignmentType = watch("assignmentType");

  // Pre-fill form when agenda changes
  useEffect(() => {
    if (agenda) {
      reset({
        title: agenda.title,
        roleName: agenda.roleName ?? undefined,
        duration: agenda.duration,
        sequence: agenda.sequence,
        assignmentType: agenda.memberId
          ? "member"
          : agenda.memberName
          ? "guest"
          : "unassigned",
        memberId: agenda.memberId || "",
        memberName: agenda.memberName || "",
        notes: agenda.notes || "",
      });
    }
  }, [agenda, reset]);

  const onSubmit = async (data: CreateSingleAgendaForm) => {
    if (!agenda) return;

    try {
      await updateMutation.mutateAsync({
        id: agenda.id,
        data: {
          title: data.title,
          roleName: data.roleName,
          duration: data.duration,
          sequence: data.sequence,
          meetingId,
          memberId:
            data.assignmentType === "member" ? data.memberId || undefined : undefined,
          memberName:
            data.assignmentType === "guest" ? data.memberName : undefined,
          notes: data.notes,
          clubId: clubId,
        },
      });

      toast({
        title: "Success",
        description: "Agenda item updated successfully",
        variant: "success",
      });
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update agenda item",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && agenda && (
        <ModalWrapper onClose={onClose} isOpen={isOpen}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Header */}
            <ModalHeader
              title="Edit Agenda"
              description="Update the agenda item details"
              onClose={onClose}
            />
            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 space-y-4">
              {/* Title */}
              <FormField label="Title" error={errors.title?.message} required>
                <TextInput
                  {...register("title")}
                  placeholder="e.g., Welcome & Opening Remarks"
                  error={!!errors.title}
                  focusColor="emerald"
                />
              </FormField>

              {/* Role Name */}
              <FormField
                label="Role Name"
                error={errors.roleName?.message}
              >
                <SelectInput
                  {...register("roleName")}
                  options={roleOptions}
                  error={!!errors.roleName}
                  focusColor="emerald"
                />
              </FormField>

              {/* Duration & Sequence */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Duration (minutes)"
                  error={errors.duration?.message}
                  required
                >
                  <TextInput
                    type="number"
                    {...register("duration", { valueAsNumber: true })}
                    min={1}
                    max={300}
                    error={!!errors.duration}
                    focusColor="emerald"
                  />
                </FormField>

                <FormField
                  label="Sequence"
                  error={errors.sequence?.message}
                  required
                >
                  <TextInput
                    type="number"
                    {...register("sequence", { valueAsNumber: true })}
                    min={1}
                    error={!!errors.sequence}
                    focusColor="emerald"
                  />
                </FormField>
              </div>

              {/* Assignment Type */}
              <div className="p-5 bg-linear-to-br from-slate-800/40 to-slate-800/20 border border-slate-700/60 rounded-xl space-y-4">
                <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-linear-to-b from-emerald-400 to-cyan-400 rounded-full"></div>
                  Assignment
                </h3>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer group hover:bg-slate-700/30 transition-all duration-200 border border-transparent hover:border-emerald-500/30">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        value="member"
                        {...register("assignmentType")}
                        className="w-5 h-5 appearance-none border-2 border-slate-600 rounded-full cursor-pointer transition-all duration-200 checked:border-emerald-500 checked:border-[6px] hover:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-2 focus:ring-offset-slate-800"
                      />
                    </div>
                    <span className="text-slate-200 text-sm font-medium group-hover:text-emerald-400 transition-colors">
                      Club Member
                    </span>
                  </label>

                  {assignmentType === "member" && (
                    <div className="ml-8 mt-2">
                      <SelectInput
                        {...register("memberId")}
                        options={memberOptions}
                        focusColor="emerald"
                      />
                    </div>
                  )}

                  <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer group hover:bg-slate-700/30 transition-all duration-200 border border-transparent hover:border-emerald-500/30">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        value="guest"
                        {...register("assignmentType")}
                        className="w-5 h-5 appearance-none border-2 border-slate-600 rounded-full cursor-pointer transition-all duration-200 checked:border-emerald-500 checked:border-[6px] hover:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-2 focus:ring-offset-slate-800"
                      />
                    </div>
                    <span className="text-slate-200 text-sm font-medium group-hover:text-emerald-400 transition-colors">
                      Guest
                    </span>
                  </label>

                  {assignmentType === "guest" && (
                    <div className="ml-8 mt-2">
                      <TextInput
                        {...register("memberName")}
                        placeholder="Enter guest name"
                        focusColor="emerald"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <FormField label="Notes">
                <Textarea
                  {...register("notes")}
                  placeholder="Additional notes or instructions"
                  rows={3}
                  focusColor="emerald"
                />
              </FormField>
            </div>

            <ModalFooter
              onCancel={onClose}
              onSubmit={handleSubmit(onSubmit)}
              isSubmitting={updateMutation.isPending}
              submitLabel="Update"
            />
          </form>
        </ModalWrapper>
      )}
    </AnimatePresence>
  );
}
