"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Eye, Edit, Lock } from "lucide-react";
import { isMeetingUpcoming } from "@/lib/utils/meeting";
import { toast } from "@/hooks/use-toast";
import {
  AddAgendaModal,
  TemplateSelectionModal,
  AddSingleAgendaModal,
} from "@/components/meeting";
import { TemplatePreviewModal } from "./TemplatePreviewModal";
import { SmartRoleAssignmentModal } from "./SmartRoleAssignmentModal";
import { EditAgendaModal } from "./EditAgendaModal";
import { useMeetingAgendas } from "@/lib/api/hooks/use-agenda";
import { useClubMembers } from "@/lib/api/hooks/use-clubs";
import { type AgendaTemplate, type Agenda } from "@/lib/types/agenda";
import type { Meeting } from "@/lib/types/meeting";
import AgendaList from "./AgendaList";

interface MeetingAgendaManagerProps {
  meeting: Meeting;
  clubId: string;
  isMember: boolean;
}

type ModalStep =
  | "closed"
  | "select-mode"
  | "select-template"
  | "preview-template"
  | "assign-roles"
  | "add-single"
  | "edit-agenda";

export function MeetingAgendaManager({
  meeting,
  clubId,
  isMember,
}: MeetingAgendaManagerProps) {
  const [modalStep, setModalStep] = useState<ModalStep>("closed");
  const [selectedTemplate, setSelectedTemplate] =
    useState<AgendaTemplate | null>(null);
  const [selectedAgenda, setSelectedAgenda] = useState<Agenda | null>(null);
  const isPastMeeting = !isMeetingUpcoming(meeting.date);
  const [isEditMode, setIsEditMode] = useState(!isPastMeeting);

  const { data: agendasData, isLoading: isLoadingAgendas } = useMeetingAgendas(
    meeting.id
  );
  const { data: membersData } = useClubMembers(clubId);

  const agendas = agendasData?.data || [];
  const members = membersData || [];
  const hasAgendas = agendas.length > 0;
  const canEdit = !isPastMeeting && isMember;

  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "Agendas updated successfully!",
      variant: "success",
    });
    setModalStep("closed");
    setSelectedTemplate(null);
    setSelectedAgenda(null);
  };

  const totalDuration = agendas.reduce(
    (sum, agenda) => sum + agenda.duration,
    0
  );
  const assignedCount = agendas.filter(
    (a) => a.memberId || a.memberName
  ).length;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Meeting Agenda</h2>
            <p className="text-slate-400 text-sm mt-1">
              {hasAgendas
                ? `${assignedCount} of ${agendas.length} roles assigned • ${totalDuration} minutes total`
                : "No agenda items yet"}
            </p>
          </div>
          <div className="flex gap-2">
            {isPastMeeting && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/40 border border-slate-600/50 text-slate-400 text-sm">
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Past Meeting</span>
              </div>
            )}
            {canEdit && hasAgendas && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditMode(!isEditMode)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 border ${
                  isEditMode
                    ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400"
                    : "bg-slate-700/20 border-slate-600 text-slate-400"
                }`}
              >
                {isEditMode ? (
                  <>
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit Mode</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">View Mode</span>
                  </>
                )}
              </motion.button>
            )}

            {canEdit && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setModalStep(hasAgendas ? "add-single" : "select-mode")
                }
                className="px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {hasAgendas ? "Add More" : "Add Agenda"}
                </span>
              </motion.button>
            )}
          </div>
        </div>

        {isLoadingAgendas ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500" />
          </div>
        ) : !hasAgendas ? (
          <div className="text-center py-16 bg-slate-800/30 rounded-xl border border-slate-700">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Agenda Yet
              </h3>
              <p className="text-slate-400 mb-6">
                {canEdit
                  ? "Create an agenda from a template or add items individually to get started."
                  : "No agenda items have been added yet."}
              </p>
              {canEdit && (
                <button
                  onClick={() => setModalStep("select-mode")}
                  className="px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg font-medium transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Agenda
                </button>
              )}
            </div>
          </div>
        ) : (
          <AgendaList
            agendas={agendas}
            meeting={meeting}
            meetingId={meeting.id}
            clubId={clubId}
            isEditMode={isEditMode}
            members={members}
            onEditAgenda={(agenda: Agenda) => {
              setSelectedAgenda(agenda);
              setModalStep("edit-agenda");
            }}
          />
        )}
      </div>

      {canEdit && (
        <>
          <AddAgendaModal
            isOpen={modalStep === "select-mode"}
            onClose={() => setModalStep("closed")}
            onSelectMode={(mode) =>
              setModalStep(
                mode === "template" ? "select-template" : "add-single"
              )
            }
          />

          <TemplateSelectionModal
            isOpen={modalStep === "select-template"}
            onClose={() => setModalStep("closed")}
            onSelectTemplate={(template) => {
              setSelectedTemplate(template);
              setModalStep("preview-template");
            }}
            clubId={clubId}
          />

          {selectedTemplate && (
            <>
              <TemplatePreviewModal
                isOpen={modalStep === "preview-template"}
                onClose={() => setModalStep("closed")}
                template={selectedTemplate}
                onProceed={() => setModalStep("assign-roles")}
              />

              <SmartRoleAssignmentModal
                isOpen={modalStep === "assign-roles"}
                onClose={() => setModalStep("closed")}
                template={selectedTemplate}
                clubId={clubId}
                meetingId={meeting.id}
                meetingDate={meeting.date.toString()}
                members={members}
                onSuccess={handleSuccess}
              />
            </>
          )}

          <AddSingleAgendaModal
            isOpen={modalStep === "add-single"}
            onClose={() => setModalStep("closed")}
            clubId={clubId}
            meetingId={meeting.id}
            meetingDate={meeting.date.toString()}
            members={members}
            nextSequence={agendas.length + 1}
            onSuccess={handleSuccess}
          />

          <EditAgendaModal
            isOpen={modalStep === "edit-agenda"}
            onClose={() => setModalStep("closed")}
            agenda={selectedAgenda}
            members={members}
            meetingId={meeting.id}
            clubId={clubId}
            onSuccess={handleSuccess}
          />
        </>
      )}
    </>
  );
}
