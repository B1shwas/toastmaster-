"use client";

import React, { useEffect, useEffectEvent } from "react";
import { AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import {
  createSingleAgendaSchema,
  type CreateSingleAgendaForm,
} from "@/lib/schemas/agenda.schema";
import { useCreateAgenda, useAgendaRoles } from "@/lib/api/hooks/use-agenda";
import type { ClubMember } from "@/lib/types/club";
import { ModalHeader, ModalWrapper } from "../ui/modal-components";
import {
  FormField,
  TextInput,
  SelectInput,
  Textarea,
} from "../ui/form-elements";
import { ToastmasterAutocomplete } from "../ui/toastmaster-autocomplete";

interface AddSingleAgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubId: string;
  meetingId: string;
  meetingDate: string;
  members: ClubMember[];
  nextSequence: number;
  onSuccess: () => void;
}

export function AddSingleAgendaModal({
  isOpen,
  onClose,
  clubId,
  meetingId,
  members,
  nextSequence,
  onSuccess,
}: AddSingleAgendaModalProps) {
  const createMutation = useCreateAgenda();
  const { data: agendaRolesResponse } = useAgendaRoles();
  const agendaRoles = agendaRolesResponse?.data ?? [];

  const roleOptions = [
    { value: "", label: "Select a role" },
    ...agendaRoles.map((role) => ({
      value: role.id,
      label: role.type,
    })),
  ];

  const memberOptions = [
    { value: "", label: "Select member" },
    ...members.map((member) => ({
      value: member.userId ?? "",
      label: member.memberName,
    })),
  ];

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<CreateSingleAgendaForm>({
    resolver: zodResolver(createSingleAgendaSchema),
    mode: "onSubmit",
    shouldFocusError: true,
    defaultValues: {
      title: "",
      roleName: "",
      roleId: "",
      duration: 0,
      sequence: nextSequence,
      assignmentType: "unassigned",
      memberId: "",
      memberName: "",
      toastmasterId: "",
      notes: "",
    },
  });

  useEffect(() => {
    reset({
      title: "",
      roleName: "",
      roleId: "",
      duration: 0,
      sequence: nextSequence,
      assignmentType: "unassigned",
      memberId: "",
      memberName: "",
      toastmasterId: "",
      notes: "",
    });
  }, [isOpen, nextSequence, reset]);

  const assignmentType = watch("assignmentType");

  const onValidationError = () => {
    toast({
      title: "Missing required fields",
      description: "Please fill in all required fields before submitting",
      variant: "destructive",
    });
  };

  const handleSaveUnassigned = async () => {
    const isValid = await trigger(["title", "duration", "sequence"]);
    if (!isValid) {
      onValidationError();
      return;
    }
    const data = getValues();
    try {
      await createMutation.mutateAsync({
        title: data.title,
        roleName: data.roleName,
        roleId: data.roleId,
        duration: data.duration,
        sequence: data.sequence,
        meetingId,
        notes: data.notes,
        clubId,
      });
      toast({
        title: "Success",
        description: "Agenda item created successfully",
        variant: "success",
      });
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create agenda item",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const onSubmit = async (data: CreateSingleAgendaForm) => {
    try {
      await createMutation.mutateAsync({
        title: data.title,
        // date: meetingDate,
        roleName: data.roleName,
        roleId: data.roleId,
        duration: data.duration,
        sequence: data.sequence,
        meetingId,
        memberId:
          data.assignmentType === "member" || data.assignmentType === "toastmaster"
            ? data.memberId
            : undefined,
        memberName:
          data.assignmentType === "guest" ? data.memberName : undefined,
        toastmasterId:
          data.assignmentType === "toastmaster"
            ? data.toastmasterId
            : undefined,
        notes: data.notes,
        clubId: clubId,
      });

      toast({
        title: "Success",
        description: "Agenda item created successfully",
        variant: "success",
      });
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create agenda item",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalWrapper onClose={onClose} isOpen={isOpen}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Header */}
            <ModalHeader
              title="Add Single Agenda"
              description="Create a custom agenda item for your meeting"
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
                  {...register("roleId")}
                  options={roleOptions}
                  error={!!errors.roleId}
                  focusColor="emerald"
                />
              </FormField>

              {/* Duration */}
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

              <input type="hidden" {...register("sequence", { valueAsNumber: true })} />

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

                  <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer group hover:bg-slate-700/30 transition-all duration-200 border border-transparent hover:border-emerald-500/30">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        value="toastmaster"
                        {...register("assignmentType")}
                        className="w-5 h-5 appearance-none border-2 border-slate-600 rounded-full cursor-pointer transition-all duration-200 checked:border-emerald-500 checked:border-[6px] hover:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-2 focus:ring-offset-slate-800"
                      />
                    </div>
                    <span className="text-slate-200 text-sm font-medium group-hover:text-emerald-400 transition-colors">
                      Toastmaster
                    </span>
                  </label>

                  {assignmentType === "toastmaster" && (
                    <div className="ml-8 mt-2">
                      <ToastmasterAutocomplete
                        clubId={clubId}
                        value={watch("toastmasterId") ?? ""}
                        onChange={(toastmasterId, _memberId, userId) => {
                          setValue("toastmasterId", toastmasterId);
                          setValue("memberId", userId);
                        }}
                        focusColor="emerald"
                      />
                      {errors.assignmentType?.message &&
                        (errors.assignmentType.message.includes("Toastmasters") ||
                          errors.assignmentType.message.includes("toastmaster")) && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.assignmentType.message}
                          </p>
                        )}
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

            <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-sm border-t border-cyan-500/20 px-6 py-4">
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSaveUnassigned}
                    disabled={createMutation.isPending}
                    className="px-4 py-2 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save without assignment
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit(onSubmit, onValidationError)}
                    disabled={createMutation.isPending}
                    className="px-6 py-2 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {createMutation.isPending && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </form>
        </ModalWrapper>
      )}
    </AnimatePresence>
  );
}
