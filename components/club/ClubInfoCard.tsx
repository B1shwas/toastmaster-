"use client";

import { motion } from "framer-motion";
import { Settings, MapPin, Users, Calendar, ExternalLink, Link } from "lucide-react";
import type { Club, ClubMeetingMode } from "@/lib/types/club";
import { ClubCodeBadge } from "./ClubCodeBadge";
import { useClubCode, useRegenerateClubCode, useUserClubStatus } from "@/lib/api";

const MEETING_MODE_STYLES: Record<
	ClubMeetingMode,
	{ label: string; dot: string }
> = {
	ONLINE: { label: "Online", dot: "bg-green-400" },
	OFFLINE: { label: "Offline", dot: "bg-slate-400" },
	HYBRID: { label: "Hybrid", dot: "bg-amber-400" },
};

function meetingModeLabel(mode?: ClubMeetingMode): string {
	if (!mode) return "";
	return MEETING_MODE_STYLES[mode]?.label ?? mode;
}

function meetingModeDot(mode?: ClubMeetingMode): string {
	if (!mode) return "bg-slate-400";
	return MEETING_MODE_STYLES[mode]?.dot ?? "bg-slate-400";
}

interface ClubInfoCardProps {
	club: Club;
	onSettingsClick?: () => void;
	totalMembers: number;
	pendingMembers?: number;
	canSeeCode: boolean;
	isMember?: boolean;
	onJoinClick?: () => void;
	onPendingClick?: () => void;
	compact?: boolean;
	className?: string;
}

function getSocialPlatformLabel(url: string): string {
	try {
		const host = new URL(url).hostname.replace("www.", "");
		if (host.includes("facebook")) return "Facebook";
		if (host.includes("instagram")) return "Instagram";
		if (host.includes("linkedin")) return "LinkedIn";
		if (host.includes("twitter") || host.includes("x.com")) return "X / Twitter";
		if (host.includes("youtube")) return "YouTube";
		if (host.includes("tiktok")) return "TikTok";
		return host;
	} catch {
		return url;
	}
}

function formatCharterDate(dateStr: string | null | undefined): string {
	if (!dateStr) return "No Charter Date";
	return new Date(dateStr).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

function clubIdentityLabel(club: Club): string {
	const parts: string[] = [];
	if (club.clubCode) parts.push(`#${club.clubCode}`);
	if (club.district) parts.push(`District ${club.district}`);
	if (club.division) parts.push(`Division ${club.division}`);
	if (club.area) parts.push(`Area ${club.area}`);
	return parts.length > 0 ? parts.join(", ") : "No Club Info";
}

export function ClubInfoCard({
	club,
	onSettingsClick,
	totalMembers,
	pendingMembers = 0,
	canSeeCode,
	isMember = false,
	onJoinClick,
	onPendingClick,
	compact = false,
	className,
}: ClubInfoCardProps) {
	const { data: clubCodeData, isLoading: isCodeLoading } = useClubCode(
		club.id,
		canSeeCode
	);
	const { mutate: regenerateCode } = useRegenerateClubCode();
	const { data: userClubStatusData } = useUserClubStatus();
	const mapUserClubStatusData = new Map<string, string>();
	let status = "";
	if (userClubStatusData) {
		userClubStatusData.forEach((c) =>
			mapUserClubStatusData.set(c.clubId, c.status),
		);
		status = mapUserClubStatusData.get(club.id) ?? "";
	}

	const clubCode = clubCodeData?.code ?? "";

	const handleRegenerateCode = () => {
		regenerateCode(club.id);
	};

	if (compact) {
		return (
			<div className={`bg-slate-800/50 border border-slate-700 rounded-2xl p-6 h-full ${className ?? ""}`}>
				<div className="flex items-start justify-between gap-3 mb-4">
					<div className="min-w-0">
						<h2 className="text-2xl font-bold text-white truncate">{club.name}</h2>
					</div>
					<div className="flex items-center gap-2 shrink-0">
						{onSettingsClick && (
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={onSettingsClick}
								className="p-2 bg-slate-700 rounded-lg text-slate-300 hover:text-white hover:bg-slate-600 transition"
								aria-label="Club settings"
							>
								<Settings className="w-4 h-4" />
							</motion.button>
						)}
						{!isMember && onJoinClick && (
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={onJoinClick}
								className="px-3 py-1.5 bg-blue-600 rounded-lg text-white text-sm font-semibold hover:bg-blue-500 transition"
							>
								{status === "pending"
									? "Pending"
									: status === "rejected"
										? "Declined"
										: "Join"}
							</motion.button>
						)}
					</div>
				</div>

				<div className="space-y-2 text-slate-400 text-sm">
					<div className="flex items-center gap-2">
						<MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
						<span className="truncate">{clubIdentityLabel(club)}</span>
					</div>
					<div className="flex items-center gap-2">
						<Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
						<span className="truncate">Charter Date: {formatCharterDate(club.charterDate)}</span>
					</div>
					<div className="flex items-center gap-2">
						<Users className="w-4 h-4 text-cyan-400 shrink-0" />
						<span className="font-medium text-white">{totalMembers} Members</span>
						{pendingMembers > 0 && (
							<button onClick={onPendingClick} className="text-orange-400 font-medium hover:underline cursor-pointer">· {pendingMembers} Pending</button>
						)}
					</div>
					{club.meetingMode && (
						<div className="flex items-center gap-2">
							<span className={`inline-block h-2 w-2 rounded-full ${meetingModeDot(club.meetingMode)} shrink-0`} />
							<span className="truncate">{meetingModeLabel(club.meetingMode)}</span>
						</div>
					)}
					{club.socialLinks && club.socialLinks.filter((l) => l.trim() !== "").length > 0 && (
						<div className="pt-1 space-y-1">
							{club.socialLinks.filter((l) => l.trim() !== "").map((url, i) => (
								<a
									key={i}
									href={url}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
								>
									<ExternalLink className="w-4 h-4 shrink-0" />
									<span className="truncate">{getSocialPlatformLabel(url)}</span>
								</a>
							))}
						</div>
					)}
				</div>
			</div>
		);
	}

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
				<div className="flex items-center gap-2 shrink-0 ml-4">
					{onSettingsClick && (
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={onSettingsClick}
							className="p-2 bg-slate-700 rounded-lg text-slate-300 hover:text-white hover:bg-slate-600 transition"
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
							className="px-6 py-2 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-500 transition"
						>
							{status === "pending" ? "Request Pending" : status === "rejected" ? "Request Decline" : "Join Club"}
						</motion.button>
					)}
				</div>
			</div>

			{/* Club Details */}
			<div className="flex flex-wrap gap-4 mt-6 text-slate-400 text-sm">
				<div className="flex items-center gap-2">
					<MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
					<span>{clubIdentityLabel(club)}</span>
				</div>
				<div className="flex items-center gap-2">
					<Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
					<span>Charter Date: {formatCharterDate(club.charterDate)}</span>
				</div>
			<div className="flex items-center gap-2">
				<Users className="w-4 h-4 text-cyan-400 shrink-0" />
				<span className="font-medium text-white">{totalMembers} Members</span>
				{pendingMembers > 0 && (
					<span className="text-orange-400 font-medium">· {pendingMembers} Pending</span>
				)}
			</div>
			{club.meetingMode && (
				<div className="flex items-center gap-2">
					<span className={`inline-block h-2 w-2 rounded-full ${meetingModeDot(club.meetingMode)} shrink-0`} />
					<span>{meetingModeLabel(club.meetingMode)}</span>
				</div>
			)}
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

			{/* Social Media Links */}
			{club.socialLinks && club.socialLinks.filter((l) => l.trim() !== "").length > 0 && (
				<div className="mt-6 space-y-2">
					<div className="flex items-center gap-2">
						<ExternalLink className="w-4 h-4 text-slate-400" />
						<span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
							Social Media
						</span>
					</div>
					<ul className="space-y-1.5">
						{club.socialLinks.filter((l) => l.trim() !== "").map((url, i) => (
							<li key={i}>
								<a
									href={url}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors break-all"
								>
									<Link className="h-3.5 w-3.5 shrink-0" />
									{getSocialPlatformLabel(url)}
									<ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
								</a>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
