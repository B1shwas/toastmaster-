import type { Meeting } from "@/lib/types/meeting";
import { formatMeetingTime, getMeetingTypeConfig } from "@/lib/utils/meeting";
import { ScrollableListFrame } from "@/components/ui/scrollable-list-frame";
import { Calendar, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { motion, Transition } from "framer-motion";
interface UpcomingMeetingsSectionProps {
	meetings: Meeting[];
}

export function UpcomingMeetingsSection({ meetings }: UpcomingMeetingsSectionProps) {
	const transitionVariants = {
		hidden: {
			opacity: 0,
			filter: "blur(12px)",
			y: 12,
		},
		visible: {
			opacity: 1,
			filter: "blur(0px)",
			y: 0,
		},
		transition: {
			type: "spring",
			bounce: 0.3,
			duration: 1.5,
		},
	};

	if (!Array.isArray(meetings) || meetings.length === 0) {
		return (
			<div className="space-y-4">
			<h2 className="text-2xl font-semibold text-white px-2">Meetings of Clubs</h2>
			<ScrollableListFrame>
				<div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
					<Calendar className="h-10 w-10 mb-2 opacity-50" />
					<p>{!Array.isArray(meetings) ? "Failed to load meetings" : "No meetings scheduled"}</p>
					</div>
				</ScrollableListFrame>
			</div>
		);
	}
	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-semibold text-white px-2">Meetings of Clubs</h2>
			<ScrollableListFrame className="max-h-[600px]" showPrettyScrollbar={true}>
				{meetings.map((meeting, index) => (
					<Link
						key={meeting.id}
						href={`/club/${meeting.clubId}/meetings/${meeting.id}`}
						className="block "
					>
						<motion.div

							transition={transitionVariants.transition as Transition<unknown>}
							className={cn(
								"group relative overflow-hidden  rounded-lg bg-slate-800/50 p-4 border border-transparent hover:border-blue-500/30 transition-all duration-300 ease-minor-spring",
								"animate-in slide-in-from-bottom-2 fade-in duration-500 fill-mode-backwards",
								"hover:bg-slate-800 hover:shadow-lg hover:scale-[1.01]  shrink-0 hover:shadow-blue-900/10"
							)}
							style={{ animationDelay: `${index * 100}ms` }}
						>
							<div className="flex flex-col sm:flex-row xs:place-items-center-safe   sm:place-items-start gap-4">
								{/* Date Box  Left one */}
								<div className=" flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:bg-blue-500/20 group-hover:border-blue-500/40 transition-colors">
									<span className="text-xs font-semibold uppercase">
										{new Date(meeting.date).toLocaleDateString('en-US', { month: 'short' })}
									</span>
									<span className="text-xl font-bold">
										{new Date(meeting.date).getDate()}
									</span>
								</div>
								{/* Content */}
								<div className="flex-1 shrink-0 min-w-0">
									<div className="flex items-start justify-between gap-2">
										<div>
											<h3 className="text-base font-medium text-white group-hover:text-blue-200 transition-colors truncate">
												{meeting.theme || `Meeting #${meeting.meetingNo}`}
											</h3>
											<div className="flex  flex-col sm:flex-row items-start gap-2 mt-1 text-xs text-slate-400">
												<span className="flex items-center gap-1">
													<Clock className="w-3 h-3" />
													{formatMeetingTime(meeting.time)}
												</span>
												<div className="sm:opacity-100 opacity-0">
													<span className="w-1 h-1 rounded-full bg-slate-600" />
												</div>
												<span className="flex items-center gap-1 truncate">
													<MapPin className="w-3 h-3" />
													{meeting.venue || "TBD"}
												</span>
											</div>
										</div>
										<div className="flex shrink-0 items-center gap-1.5">
											{meeting.meetingType && (
												<span
													className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium border"
													style={{
														color: getMeetingTypeConfig(meeting.meetingType).color,
														backgroundColor: getMeetingTypeConfig(meeting.meetingType).bgColor,
														borderColor: getMeetingTypeConfig(meeting.meetingType).bgColor,
													}}
												>
													{getMeetingTypeConfig(meeting.meetingType).label}
												</span>
											)}
											<span className={cn(
												"inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium border",
												meeting.status === "SCHEDULED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
													meeting.status === "DRAFT" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
														"bg-slate-500/10 text-slate-400 border-slate-500/20"
											)}>
												{meeting.status}
											</span>
										</div>
									</div>

									{/* Bottom metadata or description could go here */}
									{meeting.meetingNo && (
										<div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
											<span className="font-mono bg-slate-900/50 px-1.5 py-0.5 rounded text-slate-400">
												#{meeting.meetingNo}
											</span>
										</div>
									)}


								</div>

							</div>

						</motion.div>

					</Link>
				))}

			</ScrollableListFrame>

		</div>
	);
}
