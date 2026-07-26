"use client";

import { memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, Search } from "lucide-react";
import type { ClubMember } from "@/lib/types/club";
import { filterMembers } from "@/lib/utils/club";
import { MemberCard } from "./MemberCard";

interface MemberListSectionProps {
	members: ClubMember[];
	searchQuery: string;
	onSearchChange: (query: string) => void;
	onAddMember: () => void;
	onRemoveMember?: (memberId: string) => void;
	onEditRole?: (member: ClubMember) => void;
	ownerId?: string;
	isLoading?: boolean;
	canManageMembers?: boolean;
}

function MemberListSectionComponent({
	members,
	searchQuery,
	onSearchChange,
	onAddMember,
	onRemoveMember,
	onEditRole,
	ownerId,
	isLoading = false,
	canManageMembers = false,
	onMemberClick,
}: MemberListSectionProps & { onMemberClick?: (member: ClubMember) => void }) {
	const filteredMembers = useMemo(
		() => filterMembers(Array.isArray(members) ? members : [], searchQuery),
		[members, searchQuery]
	);

	return (
		<div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
						<Users className="w-5 h-5 text-white" />
					</div>
					<div>
						<h2 className="text-xl font-bold text-white">Club Members</h2>
						<p className="text-slate-400 text-sm">
							Manage your club&apos;s membership
						</p>
					</div>
				</div>

				{canManageMembers && (
					<div className="flex items-center gap-3 w-full sm:w-auto">
						{/* Search */}
						<div className="relative flex-1 sm:flex-none">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => onSearchChange(e.target.value)}
								placeholder="Search members..."
								className="w-full sm:w-64 pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
								aria-label="Search members"
							/>
						</div>

						{/* Add Member Button */}
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={onAddMember}
							disabled={isLoading}
							className="bg-linear-to-br from-blue-500 to-cyan-400 text-white font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<UserPlus className="w-4 h-4" />
							<span className="hidden sm:inline">Add Member</span>
						</motion.button>
					</div>
				)}
			</div>

			{/* Members Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				<AnimatePresence mode="popLayout">
					{filteredMembers.length > 0 ? (
						filteredMembers.map((member) => (
							<MemberCard
								key={member.member_id}
								member={member}
								onRemove={canManageMembers ? onRemoveMember : undefined}
								onEditRole={canManageMembers ? onEditRole : undefined}
								onClick={onMemberClick}
								isOwner={member.userId === ownerId}
								canViewEmail={canManageMembers}
							/>
						))
					) : (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="col-span-2 text-center py-12"
						>
							<Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
							<p className="text-slate-400">
								{searchQuery
									? "No members found matching your search"
									: "No members yet. Add your first member!"}
							</p>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
			{/* Results count */}
			{searchQuery && filteredMembers.length > 0 && (
				<div className="mt-4 text-slate-500 text-sm text-center">
					Showing {filteredMembers.length} of {members.length} members
				</div>
			)}
		</div>
	);
}

export const MemberListSection = memo(MemberListSectionComponent);
