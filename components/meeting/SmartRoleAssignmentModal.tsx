"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Clock, User, Loader2, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCreateAgendasBulk, useAgendaRoles } from "@/lib/api/hooks/use-agenda";
import {
  type AgendaTemplate,
  type CreateAgendaPayload,
} from "@/lib/types/agenda";
import type { ClubMember } from "@/lib/types/club";
import {
  ModalFooter,
  ModalHeader,
  ModalWrapper,
  ModalContent,
} from "../ui/modal-components";

interface SmartRoleAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: AgendaTemplate;
  clubId: string;
  meetingId: string;
  meetingDate: string;
  members: ClubMember[];
  onSuccess: () => void;
}

interface UniqueRole {
  roleName: string;
  count: number;
  itemIds: string[];
  durations: number[];
}

interface RoleAssignment {
  roleName: string;
  assignmentType: "member" | "guest" | "unassigned";
  memberId?: string;
  memberName?: string;
}

export function SmartRoleAssignmentModal({
  isOpen,
  onClose,
  template,
  clubId,
  meetingId,
  meetingDate,
  members,
  onSuccess,
}: SmartRoleAssignmentModalProps) {
  const createMutation = useCreateAgendasBulk();
  const { data: agendaRoles = [] } = useAgendaRoles();

  const roleLabelByKey = useMemo(() => {
    const map: Record<string, string> = {};
    for (const role of agendaRoles) {
      map[role.key] = role.type;
    }
    return map;
  }, [agendaRoles]);

  const uniqueRoles = (() => {
    const roleMap = new Map<string, UniqueRole>();

    const getRoleLabel = (item: AgendaTemplate["items"][0]): string =>
      item.customRole || roleLabelByKey[item.systemRole] || item.systemRole;

    template.items.forEach((item) => {
      const roleName = getRoleLabel(item);

      if (!roleMap.has(roleName)) {
        roleMap.set(roleName, {
          roleName,
          count: 0,
          itemIds: [],
          durations: [],
        });
      }

      const role = roleMap.get(roleName)!;
      role.count++;
      role.itemIds.push(item.id);
      role.durations.push(item.duration);
    });

    return Array.from(roleMap.values()).sort((a, b) => {
      const aIndex = template.items.findIndex(
        (item) => getRoleLabel(item) === a.roleName,
      );
      const bIndex = template.items.findIndex(
        (item) => getRoleLabel(item) === b.roleName,
      );
      return aIndex - bIndex;
    });
  })();

  const [roleAssignments, setRoleAssignments] = useState<RoleAssignment[]>(
    uniqueRoles.map((role) => ({
      roleName: role.roleName,
      assignmentType: "unassigned" as const,
      memberId: undefined,
      memberName: undefined,
    }))
  );

  const handleRoleAssignment = (
    index: number,
    field: keyof RoleAssignment,
    value: any
  ) => {
    setRoleAssignments((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };

      // Reset member/guest fields based on assignment type
      if (field === "assignmentType") {
        if (value === "member") {
          updated[index].memberName = undefined;
        } else if (value === "guest") {
          updated[index].memberId = undefined;
        } else {
          updated[index].memberId = undefined;
          updated[index].memberName = undefined;
        }
      }

      return updated;
    });
  };

  const handleSubmit = async () => {
    try {
      // Build agendas by mapping role assignments to template items
      const agendas: CreateAgendaPayload[] = template.items.map((item) => {
        const roleName =
          item.customRole || roleLabelByKey[item.systemRole] || item.systemRole;
        const assignment = roleAssignments.find((a) => a.roleName === roleName);

        return {
          title: item.title,
          roleName,
          duration: item.duration,
          sequence: item.sequence,
          meetingId,
          memberId:
            assignment?.assignmentType === "member"
              ? assignment.memberId
              : undefined,
          memberName:
            assignment?.assignmentType === "guest"
              ? assignment.memberName
              : undefined,
          clubId,
        };
      });

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

  const assignedCount = roleAssignments.filter(
    (a) => a.assignmentType !== "unassigned"
  ).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalWrapper onClose={onClose} isOpen={isOpen} maxWidth="2xl">
          <ModalHeader
            onClose={onClose}
            title="Assign Members to Roles"
            description="Assign members once per unique role. Repeated roles will use the same assignment."
          />

          <ModalContent>
            {/* Summary Banner */}
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 mb-6">
              <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Template: {template.name}
              </h3>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span>
                  {uniqueRoles.length} unique roles • {template.items.length}{" "}
                  total items
                </span>
                <span className="text-cyan-400">
                  {assignedCount}/{uniqueRoles.length} assigned
                </span>
              </div>
            </div>

            {/* Role Assignment List */}
            <div className="space-y-3 max-h-[calc(90vh-280px)] overflow-y-auto pr-2">
              {uniqueRoles.map((role, index) => (
                <RoleAssignmentCard
                  key={role.roleName}
                  role={role}
                  assignment={roleAssignments[index]}
                  members={members}
                  onUpdate={(field, value) =>
                    handleRoleAssignment(index, field, value)
                  }
                  index={index}
                />
              ))}
            </div>
          </ModalContent>

          <ModalFooter
            onCancel={onClose}
            onSubmit={handleSubmit}
            isSubmitting={createMutation.isPending}
            submitLabel={
              createMutation.isPending
                ? "Creating..."
                : `Create ${template.items.length} Items`
            }
          />
        </ModalWrapper>
      )}
    </AnimatePresence>
  );
}

interface RoleAssignmentCardProps {
  role: UniqueRole;
  assignment: RoleAssignment;
  members: ClubMember[];
  onUpdate: (field: keyof RoleAssignment, value: any) => void;
  index: number;
}

function RoleAssignmentCard({
  role,
  assignment,
  members,
  onUpdate,
  index,
}: RoleAssignmentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-4 bg-slate-800/30 border border-slate-700 rounded-lg hover:border-slate-600 transition-all"
    >
      {/* Role Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-white font-semibold text-base">
            {role.roleName}
          </h4>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
            {role.count > 1 && (
              <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded">
                {role.count}× in template
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {role.durations.join(" + ")} min
            </span>
          </div>
        </div>
      </div>

      {/* Assignment Options */}
      <div className="space-y-2">
        {/* Option 1: Club Member */}
        <label className="flex items-start gap-3 p-2.5 rounded-lg cursor-pointer group hover:bg-slate-700/30 transition-all duration-200 border border-transparent hover:border-cyan-500/30">
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              type="radio"
              checked={assignment.assignmentType === "member"}
              onChange={() => onUpdate("assignmentType", "member")}
              className="w-4 h-4 appearance-none border-2 border-slate-600 rounded-full cursor-pointer transition-all duration-200 checked:border-cyan-500 checked:border-[5px] hover:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            />
          </div>
          <div className="flex-1">
            <span className="text-slate-200 text-sm font-medium group-hover:text-cyan-400 transition-colors">
              Club Member
            </span>
            {assignment.assignmentType === "member" && (
              <select
                value={assignment.memberId || ""}
                onChange={(e) => onUpdate("memberId", e.target.value)}
                className="w-full mt-2 px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
              >
                <option value="">Select member...</option>
                {members.map((member) => (
                  <option key={member.member_id} value={member.userId ?? ""}>
                    {member.memberName}
                  </option>
                ))}
              </select>
            )}
          </div>
        </label>

        {/* Option 2: Guest */}
        <label className="flex items-start gap-3 p-2.5 rounded-lg cursor-pointer group hover:bg-slate-700/30 transition-all duration-200 border border-transparent hover:border-cyan-500/30">
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              type="radio"
              checked={assignment.assignmentType === "guest"}
              onChange={() => onUpdate("assignmentType", "guest")}
              className="w-4 h-4 appearance-none border-2 border-slate-600 rounded-full cursor-pointer transition-all duration-200 checked:border-cyan-500 checked:border-[5px] hover:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            />
          </div>
          <div className="flex-1">
            <span className="text-slate-200 text-sm font-medium group-hover:text-cyan-400 transition-colors">
              Guest
            </span>
            {assignment.assignmentType === "guest" && (
              <input
                type="text"
                value={assignment.memberName || ""}
                onChange={(e) => onUpdate("memberName", e.target.value)}
                placeholder="Enter guest name..."
                className="w-full mt-2 px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
              />
            )}
          </div>
        </label>

        {/* Option 3: Leave Unassigned */}
        <label className="flex items-start gap-3 p-2.5 rounded-lg cursor-pointer group hover:bg-slate-700/30 transition-all duration-200 border border-transparent hover:border-slate-500/30">
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              type="radio"
              checked={assignment.assignmentType === "unassigned"}
              onChange={() => onUpdate("assignmentType", "unassigned")}
              className="w-4 h-4 appearance-none border-2 border-slate-600 rounded-full cursor-pointer transition-all duration-200 checked:border-slate-500 checked:border-[5px] hover:border-slate-400/50 focus:outline-none focus:ring-2 focus:ring-slate-500/30"
            />
          </div>
          <span className="text-slate-300 text-sm font-medium group-hover:text-slate-200 transition-colors">
            Leave Unassigned
          </span>
        </label>
      </div>
    </motion.div>
  );
}
