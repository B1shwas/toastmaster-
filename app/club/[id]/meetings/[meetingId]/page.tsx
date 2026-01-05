"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import type { Meeting } from "@/lib/types/meeting";
import { useMeeting } from "@/lib/api/hooks/use-meetings";
import { useClubRole } from "@/lib/api/hooks/use-clubs";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import {
    MeetingHeader,
    MeetingDetailsCard,
    MeetingNotesCard,
    MeetingAgendaManager,
} from "@/components/meeting";
import {
    PageWrapper,
    BackLink,
    NotFoundState,
} from "@/components/ui/page-layout";
import { ListAllAgendas } from "@/components/agendaReport/ListAllAgendas";
import { CreateAgendaReport } from "@/components/agendaReport/CreateAgendaReport";
import { useCanUserCreateReport } from "@/lib/api/hooks/use-agenda-report";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
};

function MeetingContent({
    meeting,
    clubId,
    canManageNotes,
    userRole,
}: {
    meeting: Meeting;
    clubId: string;
    canManageNotes: boolean;
    userRole: "OWNER" | "ADMIN" | "MEMBER";
}) {
    const agendas = meeting.agendas || [];
    const assignedCount = agendas.filter((a) => a.memberId).length;
    const { data: canUserCreateIt } = useCanUserCreateReport(meeting?.id);

    return (
        <PageWrapper>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
            >
                <motion.div variants={itemVariants}>
                    <BackLink href={`/club/${clubId}`} label="Back to Club" />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <MeetingHeader meeting={meeting} />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <MeetingDetailsCard
                        meeting={meeting}
                        assignedCount={assignedCount}
                        totalRoles={agendas.length}
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <MeetingNotesCard
                        notes={meeting.notes}
                        meetingId={meeting.id}
                        clubId={clubId}
                        canManageNotes={canManageNotes}
                    />
                </motion.div>

                {meeting?.status == "COMPLETED" ? (
                    <ListAllAgendas club_id={clubId} meeting_id={meeting?.id} />
                ) : null}
                {["IN_PROGRESS", "COMPLETED"].includes(meeting?.status) &&
                ["Grammarian", "Ah Counter"].includes(
                    canUserCreateIt?.roleName,
                ) ? (
                    <CreateAgendaReport canUserCreateIt={canUserCreateIt} />
                ) : null}

                <motion.div variants={itemVariants}>
                    <MeetingAgendaManager
                        meeting={meeting}
                        clubId={clubId}
                        userRole={userRole}
                    />
                </motion.div>
            </motion.div>
        </PageWrapper>
    );
}

export default function MeetingPage() {
    const params = useParams<{ id: string; meetingId: string }>();
    const { user } = useAuthStore();
    const { data: meeting, isLoading } = useMeeting(params.meetingId);
    const { data: roleData } = useClubRole(params.id, user?.id || "");

    const canManageNotes =
        roleData?.role === "OWNER" || roleData?.role === "ADMIN";
    const userRole = (roleData?.role || "MEMBER") as
        | "OWNER"
        | "ADMIN"
        | "MEMBER";

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-slate-950 to-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400">Loading meeting...</p>
                </div>
            </div>
        );
    }

    if (!meeting) {
        return (
            <NotFoundState
                title="Meeting not found"
                message="The meeting you're looking for doesn't exist."
                backHref={`/club/${params.id}`}
                backLabel="Back to Club"
            />
        );
    }

    return (
        <MeetingContent
            meeting={meeting}
            clubId={params.id}
            canManageNotes={canManageNotes}
            userRole={userRole}
        />
    );
}
