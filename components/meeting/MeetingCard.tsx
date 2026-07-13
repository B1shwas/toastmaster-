"use client";

import { memo } from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, ChevronRight, Users } from "lucide-react";
import type { Meeting } from "@/lib/types/meeting";
import {
	getMeetingStatusConfig,
	getEffectiveMeetingStatus,
	getMeetingTypeConfig,
	formatMeetingDate,
	formatMeetingTime,
} from "@/lib/utils/meeting";

interface MeetingCardProps {
	meeting: Meeting;
	clubId: string;
}

function MeetingCardComponent({ meeting, clubId }: MeetingCardProps) {
	const statusConfig = getMeetingStatusConfig(getEffectiveMeetingStatus(meeting));
	const typeConfig = getMeetingTypeConfig(meeting.meetingType);
	const agendaCount = meeting.agendas?.length ?? 0;
	const filledRoles = meeting.agendas?.filter((a) => a.memberId).length ?? 0;

	return (
		<Link
			href={`/club/${clubId}/meetings/${meeting.id}`}
			className="group block rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 transition-all duration-200 hover:border-slate-600 hover:bg-slate-800 active:scale-[0.99]"
		>
			{/* Header */}
			<div className="mb-3 flex items-start justify-between gap-3">
				<div className="min-w-0 flex-1">
					<div className="mb-1 flex flex-wrap items-center gap-2">
						<span className="text-sm font-medium text-slate-400">
							#{meeting.meetingNo}
						</span>
						<span
							className={`rounded-full px-2 py-0.5 text-xs font-medium`}
							style={{
								color: statusConfig.color,
								backgroundColor: statusConfig.bgColor,
							}}
						>
							{statusConfig.label}
						</span>
						{meeting.meetingType && (
							<span
								className="rounded-full px-2 py-0.5 text-xs font-medium"
								style={{
									color: typeConfig.color,
									backgroundColor: typeConfig.bgColor,
								}}
							>
								{typeConfig.label}
							</span>
						)}
					</div>
					<h3 className="truncate text-base font-semibold text-white group-hover:text-blue-400">
						{meeting.theme || "Untitled Meeting"}
					</h3>
				</div>
				<ChevronRight className="h-5 w-5 shrink-0 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-400" />
			</div>

			{/* Details */}
			<div className="space-y-1.5 text-sm text-slate-400">
				<div className="flex items-center gap-2">
					<Calendar className="h-4 w-4 text-slate-500" />
					<span>{formatMeetingDate(meeting.date)}</span>
					<span className="text-slate-600">•</span>
					<Clock className="h-4 w-4 text-slate-500" />
					<span>{formatMeetingTime(meeting.time)}</span>
				</div>

				{meeting.venue && (
					<div className="flex items-center gap-2">
						<MapPin className="h-4 w-4 text-slate-500" />
						<span className="truncate">{meeting.venue}</span>
					</div>
				)}

				{agendaCount > 0 && (
					<div className="flex items-center gap-2">
						<Users className="h-4 w-4 text-slate-500" />
						<span>
							{filledRoles}/{agendaCount} roles filled
						</span>
					</div>
				)}
			</div>
		</Link>
	);
}

export const MeetingCard = memo(MeetingCardComponent);
