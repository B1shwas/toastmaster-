"use client";

import { motion } from "framer-motion";
import { Settings, MapPin, Hash, Calendar, Users } from "lucide-react";
import type { Club } from "@/lib/types/club";
import { formatMeetingFrequency } from "@/lib/utils/club";
import { ClubCodeBadge } from "./ClubCodeBadge";
import { useClubCode, useRegenerateClubCode } from "@/lib/api";

interface ClubInfoCardProps {
	club: Club;
	onSettingsClick?: () => void;
	totalMembers: number;
	canSeeCode: boolean;
	isMember?: boolean;
	onJoinClick?: () => void;
}

const CLUB_DETAILS = [
	{
		icon: MapPin,
		getLabel: (club: Club) => club.district || "No District",
	},
	{
		icon: Hash,
		getLabel: (club: Club) =>
			`${club.area || "No Area"} / ${club.division || "No Division"}`,
	},
	{
		icon: Calendar,
		getLabel: (club: Club) => formatMeetingFrequency(club.meetingFrequency),
	},
	{
		icon: Users,
		getLabel: (_club: Club, totalMembers: number) => `${totalMembers} Members`,
	},
];

export function ClubInfoCard({
	club,
	onSettingsClick,
	totalMembers,
	canSeeCode,
	isMember = false,
	onJoinClick,
}: ClubInfoCardProps) {
	const { data: clubCodeData, isLoading: isCodeLoading } = useClubCode(
		club.id,
		canSeeCode
	);
	const { mutate: regenerateCode } = useRegenerateClubCode();

	const clubCode = clubCodeData?.code ?? "";

	const handleRegenerateCode = () => {
		regenerateCode(club.id);
	};

	return (
		<div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
			{/* Header */}
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1 min-w-0">
					<h1 className="text-3xl font-bold text-white mb-2 break-wrap-word">
						{club.name}
					</h1>
					{club.description && (
						<p className="text-slate-400 max-w-2xl line-clamp-5">
							{club.description}
						</p>
					)}
				</div>
				{onSettingsClick && (
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={onSettingsClick}
						className="p-2 bg-slate-700 rounded-lg text-slate-300 hover:text-white hover:bg-slate-600 transition shrink-0 ml-4"
						aria-label="Club settings"
					>
						<Settings className="w-5 h-5" />
					</motion.button>
				)}
				{!isMember && onJoinClick && (
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={onJoinClick}
						className="px-6 py-2 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-500 transition shrink-0 ml-4"
					>
						Join Club
					</motion.button>
				)}
			</div>

			{/* Club Details */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
				{CLUB_DETAILS.map((item, idx) => {
					const Icon = item.icon;
					const label = item.getLabel(club, totalMembers);

					return (
						<div key={idx} className="flex items-center gap-2 text-slate-400">
							<Icon className="w-4 h-4 text-cyan-400 shrink-0" />
							<span className="text-sm truncate">{label}</span>
						</div>
					);
				})}
			</div>

			{/* Club Code Section */}
			{canSeeCode && (
				<div className="mt-6">
					{isCodeLoading ? (
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
							<span className="text-slate-400 text-sm">Loading code...</span>
						</div>
					) : clubCode ? (
						<ClubCodeBadge
							code={clubCode}
							onRegenerate={handleRegenerateCode}
						/>
					) : (
						<span className="text-slate-400 text-sm">No code available</span>
					)}
				</div>
			)}
		</div>
	);
}
