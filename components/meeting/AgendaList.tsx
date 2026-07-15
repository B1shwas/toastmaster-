"use client";

import { useState, useEffect } from "react";
import { Reorder, useDragControls, motion } from "framer-motion";
import { GripVertical, Clock, User, Trash2, Edit2, Save, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useDeleteAgenda, useReorderAgendas, useCreateAgenda } from "@/lib/api/hooks/use-agenda";
import type { Agenda } from "@/lib/types/agenda";
import type { Meeting } from "@/lib/types/meeting";
import type { ClubMember } from "@/lib/types/club";
import { calculateAgendaTimes } from "@/lib/hooks/useAgendaTiming";
import { IntroductionPopup } from "./IntroductionPopup";

interface AgendaListProps {
  agendas: Agenda[];
  meeting: Meeting;
  meetingId: string;
  clubId: string;
  isEditMode: boolean;
  onEditAgenda: (agenda: Agenda) => void;
  members?: ClubMember[];
}

interface AgendaWithTiming extends Agenda {
  startTime: string;
  endTime: string;
}

type AgendaItemProps = {
  item: AgendaWithTiming;
  index: number;
  isEditMode: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (agenda: AgendaWithTiming) => void;
  onCopy?: (agenda: AgendaWithTiming) => void;
  isDeletingId?: string | null;
  onMemberClick?: (memberId: string, memberName: string) => void;
  members?: ClubMember[];
};

function AgendaItem({
  item,
  index,
  isEditMode,
  onDelete,
  onEdit,
  onCopy,
  isDeletingId,
  onMemberClick,
  members,
}: AgendaItemProps) {
  const displayName = item.memberId
    ? (members?.find((m) => m.member_id === item.memberId)?.memberName ?? item.memberName)
    : item.memberName;
  const controls = useDragControls();
  const isDeleting = isDeletingId === item.id;

  if (!isEditMode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-4 hover:bg-slate-800/70 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium mb-1">{item.title}</h4>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-cyan-400 text-xs px-2 py-1 bg-cyan-500/10 rounded inline-flex items-center gap-1">
                <User size={12} />
                {item.roleName}
              </span>
              <span className="text-slate-400 text-xs inline-flex items-center gap-1">
                <Clock size={12} />
                {item.startTime} - {item.endTime}
              </span>
              <span className="text-slate-500 text-xs">
                ({item.duration} min)
              </span>
            </div>
          </div>

          {displayName ? (
            <button
              onClick={() => item.memberId && onMemberClick?.(item.memberId, displayName)}
              className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors"
            >
              <User className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">
                {displayName}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
              <User className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Unassigned</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      whileDrag={{
        scale: 1.02,
        boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
        zIndex: 10,
      }}
      className="group"
    >
      <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-4 hover:bg-slate-800/70 transition-all">
        <div className="flex items-center gap-4">
          <button
            className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-cyan-400 transition-colors touch-none"
            onPointerDown={(e) => controls.start(e)}
          >
            <GripVertical size={20} />
          </button>

          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium mb-1">{item.title}</h4>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-cyan-400 text-xs px-2 py-1 bg-cyan-500/10 rounded inline-flex items-center gap-1">
                <User size={12} />
                {item.roleName}
              </span>
              <span className="text-slate-500 text-xs inline-flex items-center gap-1">
                <Clock size={12} />
                {item.duration} min
              </span>
            </div>
          </div>

          <button
            onClick={() => onEdit?.(item)}
            onPointerDown={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-green-500/20 rounded-lg text-slate-400 hover:text-green-400"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onCopy?.(item)}
            onPointerDown={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-blue-500/20 rounded-lg text-slate-400 hover:text-blue-400"
          >
            <Copy size={18} />
          </button>
          <button
            onClick={() => onDelete?.(item.id)}
            onPointerDown={(e) => e.stopPropagation()}
            disabled={isDeleting}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 disabled:opacity-50"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </Reorder.Item>
  );
}

export default function AgendaList({
  agendas,
  meeting,
  meetingId,
  clubId,
  isEditMode,
  onEditAgenda,
  members = [],
}: AgendaListProps) {
  const agendasArray = Array.isArray(agendas) ? agendas : [];
  const sortedAgendas = [...agendasArray].sort((a, b) => a.sequence - b.sequence);
  const agendasWithTimes = calculateAgendaTimes(
    sortedAgendas,
    meeting.time
  ) as AgendaWithTiming[];

  const [items, setItems] = useState<AgendaWithTiming[]>(agendasWithTimes);
  const [isDirty, setIsDirty] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [popupMember, setPopupMember] = useState<{ name: string; introduction: string | null } | null>(null);

  const handleMemberClick = (memberId: string, memberName: string) => {
    const member = members.find((m) => m.member_id === memberId);
    setPopupMember({
      name: member?.memberName ?? memberName,
      introduction: member?.user_introduction ?? null,
    });
  };

  const deleteMutation = useDeleteAgenda(meetingId);
  const reorderMutation = useReorderAgendas(meetingId);
  const createAgendaMutation = useCreateAgenda();

  useEffect(() => {
    const currentAgendas = Array.isArray(agendas) ? agendas : [];
    const updatedAgendas = calculateAgendaTimes(
      [...currentAgendas].sort((a, b) => a.sequence - b.sequence),
      meeting.time
    ) as AgendaWithTiming[];
    setItems(updatedAgendas);
    setIsDirty(false);
  }, [agendas, meeting.time]);

  const handleReorder = (newOrder: AgendaWithTiming[]) => {
    setItems(newOrder);
    setIsDirty(true);
  };

  const handleSaveOrder = async () => {
    try {
      const agendaIds = items.map((item) => item.id);
      await reorderMutation.mutateAsync({ agendaIds, clubId });
      toast({
        title: "Success",
        description: "Agenda order saved successfully",
        variant: "success",
      });
      setIsDirty(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save agenda order",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async (item: AgendaWithTiming) => {
    const maxSequence = items.length > 0 ? Math.max(...items.map((i) => i.sequence)) : 0;
    try {
      await createAgendaMutation.mutateAsync({
        title: item.title,
        roleName: item.roleName ?? undefined,
        duration: item.duration,
        sequence: maxSequence + 1,
        meetingId,
        memberId: item.memberId ?? undefined,
        memberName: item.memberName ?? undefined,
        notes: item.notes ?? undefined,
        clubId,
      });
      toast({
        title: "Success",
        description: "Agenda item duplicated",
        variant: "success",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to duplicate agenda item",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agenda item?")) return;

    try {
      setIsDeletingId(id);
      await deleteMutation.mutateAsync({ agendaId: id, clubId });
      toast({
        title: "Success",
        description: "Agenda item deleted successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete agenda item",
        variant: "destructive",
      });
    } finally {
      setIsDeletingId(null);
    }
  };

  if (!isEditMode) {
    return (
      <>
        <div className="space-y-3">
          {items.map((item, index) => (
            <AgendaItem
              key={item.id}
              item={item}
              index={index}
              isEditMode={false}
              onMemberClick={handleMemberClick}
              members={members}
            />
          ))}
        </div>
        <IntroductionPopup
          isOpen={!!popupMember}
          onClose={() => setPopupMember(null)}
          memberName={popupMember?.name ?? ""}
          introduction={popupMember?.introduction ?? null}
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      {isDirty && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl"
        >
          <p className="text-cyan-400 text-sm font-medium">
            You have unsaved changes to the agenda order
          </p>
          <button
            onClick={handleSaveOrder}
            disabled={reorderMutation.isPending}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {reorderMutation.isPending ? "Saving..." : "Save Order"}
          </button>
        </motion.div>
      )}

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={handleReorder}
        className="space-y-3"
      >
        {items.map((item, index) => (
          <AgendaItem
            key={item.id}
            item={item}
            index={index}
            isEditMode={true}
            onDelete={handleDelete}
            onEdit={onEditAgenda}
            onCopy={handleCopy}
            isDeletingId={isDeletingId}
          />
        ))}
      </Reorder.Group>
    </div>
  );
}
