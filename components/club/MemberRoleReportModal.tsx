"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Award, Loader2, User, Trash2, CheckCircle } from "lucide-react";
import { useRoleCounts } from "@/lib/api/hooks/use-agenda";
import type { ClubMember } from "@/lib/types/club";
import { useMemo } from "react";

interface MemberRoleReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    member: ClubMember | null;
    clubId: string;
    onRemoveMember?: (memberId: string) => Promise<void> | void;
    onAcceptMember?: (memberId: string) => Promise<void> | void;
    canRemoveMember?: boolean;
    isRemovingMember?: boolean;
    isAcceptingMember?: boolean;
}

export function MemberRoleReportModal({
    isOpen,
    onClose,
    member,
    clubId,
    onRemoveMember,
    onAcceptMember,
    canRemoveMember = false,
    isRemovingMember = false,
    isAcceptingMember = false,
}: MemberRoleReportModalProps) {
    const { data: roleCountsResponse, isLoading } = useRoleCounts(clubId);

    const memberRoles = useMemo(() => {
        if (!roleCountsResponse?.data || !member) return [];
        return roleCountsResponse.data.filter(
            (rc) => rc.memberName === member.memberName && rc.role
        );
    }, [roleCountsResponse, member]);

    if (!isOpen || !member) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 bg-linear-to-br from-slate-800 to-slate-900">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                    <Award className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Member Report</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-white transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-lg">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg">
                                    {member.memberName}
                                </h3>
                                <p className="text-slate-400 text-sm italic">
                                    {member.member_role}
                                </p>
                                {member.member_toastmaster_id && (
                                    <p className="text-slate-500 text-xs font-mono mt-0.5">
                                        ID: {member.member_toastmaster_id}
                                    </p>
                                )}
                            </div>
                        </div>

                        {member.user_introduction?.trim() ? (
                            <div className="mt-4 p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Introduction</p>
                                <p className="text-slate-300 text-sm leading-relaxed">{member.user_introduction}</p>
                            </div>
                        ) : (
                            <div className="mt-4 p-3 bg-slate-800/30 border border-slate-700/30 rounded-xl">
                                <p className="text-slate-500 text-sm italic">No introduction added yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-4">
                                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                                <p className="text-slate-400 text-sm">Fetching report data...</p>
                            </div>
                        ) : memberRoles.length > 0 ? (
                            <div className="space-y-3">
                                {memberRoles.map((rc, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:bg-slate-800/60 transition group"
                                    >
                                        <span className="text-slate-200 font-medium truncate pr-4">
                                            {rc.role}
                                        </span>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-cyan-400 font-bold bg-cyan-400/10 px-3 py-1 rounded-full text-sm">
                                                {rc.count} {rc.count === 1 ? "time" : "times"}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <User className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                                <p className="text-slate-400">No meeting roles recorded yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/5 bg-slate-900/50">
                        {member.isPending ? (
                            <>
                                {onAcceptMember && (
                                    <button
                                        onClick={() => onAcceptMember(member.member_id)}
                                        disabled={isAcceptingMember}
                                        className="w-full py-3 mb-3 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-semibold rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isAcceptingMember ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Accepting...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                Accept Member
                                            </>
                                        )}
                                    </button>
                                )}
                                {canRemoveMember && onRemoveMember && (
                                    <button
                                        onClick={() => onRemoveMember(member.member_id)}
                                        disabled={isRemovingMember}
                                        className="w-full py-3 mb-3 bg-red-500/15 hover:bg-red-500/25 text-red-300 font-semibold rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isRemovingMember ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Removing...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="w-4 h-4" />
                                                Remove Member
                                            </>
                                        )}
                                    </button>
                                )}
                            </>
                        ) : (
                            canRemoveMember && onRemoveMember && (
                                <button
                                    onClick={() => onRemoveMember(member.member_id)}
                                    disabled={isRemovingMember}
                                    className="w-full py-3 mb-3 bg-red-500/15 hover:bg-red-500/25 text-red-300 font-semibold rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isRemovingMember ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Removing Member...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            Remove Member
                                        </>
                                    )}
                                </button>
                            )
                        )}
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition"
                        >
                            Close Report
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
