"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Clock, User, UserPlus, Loader2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import {
  createFromTemplateSchema,
  type CreateFromTemplateForm,
} from "@/lib/schemas/agenda.schema";
import { useCreateAgendasBulk } from "@/lib/api/hooks/use-agenda";
import {
  ROLE_LABELS,
  type AgendaTemplate,
  type CreateAgendaPayload,
} from "@/lib/types/agenda";
import type { ClubMember } from "@/lib/types/club";
import { ModalHeader, ModalWrapper } from "../ui/modal-components";

interface RoleAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: AgendaTemplate;
  clubId: string;
  meetingId: string;
  meetingDate: string;
  members: ClubMember[];
  onSuccess: () => void;
}

export function RoleAssignmentModal({
  isOpen,
  onClose,
  template,
  clubId,
  meetingId,
  meetingDate,
  members,
  onSuccess,
}: RoleAssignmentModalProps) {
  const createMutation = useCreateAgendasBulk();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateFromTemplateForm>({
    resolver: zodResolver(createFromTemplateSchema),
    defaultValues: {
      templateId: template.id,
      roleAssignments: template.items.map((item) => ({
        templateItemId: item.id,
        assignmentType: "unassigned",
        memberId: undefined,
        memberName: undefined,
      })),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "roleAssignments",
  });

  const handleSaveAllUnassigned = async () => {
    try {
      const agendas: CreateAgendaPayload[] = template.items.map((item) => ({
        title: item.title,
        roleName: item.customRole || ROLE_LABELS[item.systemRole],
        duration: item.duration,
        sequence: item.sequence,
        meetingId,
        clubId,
      }));
      await createMutation.mutateAsync({ clubId, meetingId, agendas });
      toast({
        title: "Success",
        description: `Created ${agendas.length} agenda items successfully`,
        variant: "success",
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create agendas",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const onSubmit = async (data: CreateFromTemplateForm) => {
    try {
      // Transform the data to match the API payload
      const agendas: CreateAgendaPayload[] = template.items.map(
        (item, index) => {
          const assignment = data.roleAssignments[index];
          return {
            title: item.title,
            roleName: item.customRole || ROLE_LABELS[item.systemRole],
            duration: item.duration,
            sequence: item.sequence,
            meetingId,
            memberId:
              assignment.assignmentType === "member"
                ? assignment.memberId
                : undefined,
            memberName:
              assignment.assignmentType === "guest"
                ? assignment.memberName
                : undefined,
            clubId,
          };
        }
      );

      // Create all agendas using bulk create endpoint
      await createMutation.mutateAsync({ clubId, meetingId, agendas });

      toast({
        title: "Success",
        description: `Created ${agendas.length} agenda items successfully`,
        variant: "success",
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create agendas",
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
            <ModalHeader
              onClose={onClose}
              title="Assign Roles"
              description="Assign members or guests to each role (optional)"
            />

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Template: {template.name}
                </h3>
                <p className="text-slate-400 text-sm">
                  {template.items.length} items • Total duration:{" "}
                  {template.items.reduce((sum, item) => sum + item.duration, 0)}{" "}
                  minutes
                </p>
              </div>

              <div className="space-y-4">
                {template.items.map((item, index) => (
                  <RoleAssignmentRow
                    key={item.id}
                    item={item}
                    index={index}
                    members={members}
                    register={register}
                    watch={watch}
                  />
                ))}
              </div>
            </div>

            {/* Footer */}
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
                    onClick={handleSaveAllUnassigned}
                    disabled={createMutation.isPending}
                    className="px-4 py-2 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    unassigned
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                    disabled={createMutation.isPending}
                    className="px-6 py-2 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {createMutation.isPending && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    Create Agendas
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

interface RoleAssignmentRowProps {
  item: AgendaTemplate["items"][0];
  index: number;
  members: ClubMember[];
  register: any;
  watch: any;
}

function RoleAssignmentRow({
  item,
  index,
  members,
  register,
  watch,
}: RoleAssignmentRowProps) {
  const assignmentType = watch(`roleAssignments.${index}.assignmentType`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-4 bg-slate-800/30 border border-slate-700 rounded-lg"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-white font-medium">{item.title}</h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-cyan-400 text-xs px-2 py-1 bg-cyan-500/10 rounded">
              {ROLE_LABELS[item.systemRole]}
            </span>
            {item.customRole && (
              <span className="text-slate-400 text-xs">{item.customRole}</span>
            )}
            <span className="text-slate-500 text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.duration} min
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        <div className="space-y-2">
          {/* Radio: Member */}
          <label className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer group hover:bg-slate-700/30 transition-all duration-200 border border-transparent hover:border-cyan-500/30">
            <div className="relative flex items-center justify-center">
              <input
                type="radio"
                value="member"
                {...register(`roleAssignments.${index}.assignmentType`)}
                className="w-5 h-5 appearance-none border-2 border-slate-600 rounded-full cursor-pointer transition-all duration-200 checked:border-cyan-500 checked:border-[6px] hover:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:ring-offset-2 focus:ring-offset-slate-800"
              />
            </div>
            <span className="text-slate-200 text-sm font-medium group-hover:text-cyan-400 transition-colors">
              Club Member
            </span>
          </label>

          {assignmentType === "member" && (
            <div className="ml-8">
              <select
                {...register(`roleAssignments.${index}.memberId`)}
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-200 hover:border-slate-600"
              >
                <option value="">Select member</option>
                {members.map((member) => (
                  <option key={member.member_id} value={member.member_id}>
                    {member.memberName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Radio: Guest */}
          <label className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer group hover:bg-slate-700/30 transition-all duration-200 border border-transparent hover:border-cyan-500/30">
            <div className="relative flex items-center justify-center">
              <input
                type="radio"
                value="guest"
                {...register(`roleAssignments.${index}.assignmentType`)}
                className="w-5 h-5 appearance-none border-2 border-slate-600 rounded-full cursor-pointer transition-all duration-200 checked:border-cyan-500 checked:border-[6px] hover:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:ring-offset-2 focus:ring-offset-slate-800"
              />
            </div>
            <span className="text-slate-200 text-sm font-medium group-hover:text-cyan-400 transition-colors">
              Guest
            </span>
          </label>

          {assignmentType === "guest" && (
            <div className="ml-8">
              <input
                type="text"
                {...register(`roleAssignments.${index}.memberName`)}
                placeholder="Enter guest name"
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-200 hover:border-slate-600"
              />
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
