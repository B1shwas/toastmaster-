"use client";

import { memo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  Clock,
  MapPin,
  Activity,
  FileText,
  Edit2,
  Plus,
  X,
  Loader2,
  Link,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Meeting } from "@/lib/types/meeting";
import {
  useUpdateMeetingNotes,
  useUpdateMeeting,
} from "@/lib/api/hooks/use-meetings";
import {
  getMeetingStatusConfig,
  getEffectiveMeetingStatus,
  formatFullMeetingDate,
  formatMeetingTime,
} from "@/lib/utils/meeting";

interface MeetingHeaderProps {
  meeting: Meeting;
}

interface MeetingDetailsCardProps {
  meeting: Meeting;
  totalDuration: number;
  canEdit?: boolean;
  meetingId?: string;
  clubId?: string;
}

interface MeetingNotesCardProps {
  notes: string | null;
  meetingId: string;
  clubId: string;
  canManageNotes: boolean;
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800">
        <Icon className="h-4 w-4 text-slate-400" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="text-white">{value}</p>
      </div>
    </div>
  );
}

const editMeetingSchema = z.object({
  theme: z
    .string()
    .min(3, "Theme must be at least 3 characters")
    .max(200, "Theme must be less than 200 characters"),
  date: z.string().min(1, "Date is required"),
  time: z
    .string()
    .regex(
      /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
      "Time must be in HH:MM format"
    ),
  venue: z
    .string()
    .min(3, "Venue must be at least 3 characters")
    .max(200, "Venue must be less than 200 characters"),
  socialLinks: z
    .array(
      z
        .string()
        .regex(/^https?:\/\/.+/, "Must be a valid URL starting with http(s)")
    )
    .max(3, "Maximum 3 social media links allowed")
    .optional(),
  wordOfTheDay: z
    .string()
    .max(255, "Word of the day must be less than 255 characters")
    .optional(),
  idiomOfTheDay: z
    .string()
    .max(255, "Idiom of the day must be less than 255 characters")
    .optional(),
});

type EditMeetingInput = z.infer<typeof editMeetingSchema>;

interface EditMeetingModalProps {
  meeting: Meeting;
  meetingId: string;
  clubId: string;
  onClose: () => void;
}

function EditMeetingModal({
  meeting,
  meetingId,
  clubId,
  onClose,
}: EditMeetingModalProps) {
  const updateMeeting = useUpdateMeeting(meetingId, clubId);

  const timeParts = (meeting.time || "00:00:00").split(":");
  const [selectedTime, setSelectedTime] = useState({
    hours: parseInt(timeParts[0] || "0"),
    minutes: parseInt(timeParts[1] || "0"),
  });

  const initialDate = meeting.date ? new Date(meeting.date) : undefined;
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDate
  );

  const initialLinks =
    meeting.socialLinks && meeting.socialLinks.length > 0
      ? meeting.socialLinks
      : [""];
  const [socialLinks, setSocialLinks] = useState<string[]>(initialLinks);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EditMeetingInput>({
    resolver: zodResolver(editMeetingSchema),
    defaultValues: {
      theme: meeting.theme || "",
      date: initialDate ? format(initialDate, "yyyy-MM-dd") : "",
      time: `${timeParts[0] || "00"}:${timeParts[1] || "00"}`,
      venue: meeting.venue || "",
      socialLinks: meeting.socialLinks ?? [],
      wordOfTheDay: meeting.wordOfTheDay ?? "",
      idiomOfTheDay: meeting.idiomOfTheDay ?? "",
    },
  });

  const onSubmit = (data: EditMeetingInput) => {
    const filteredLinks = socialLinks.filter((l) => l.trim() !== "");
    updateMeeting.mutate(
      {
        theme: data.theme,
        date: new Date(data.date),
        time: `${data.time}:00`,
        venue: data.venue,
        socialLinks: filteredLinks.length > 0 ? filteredLinks : [],
        wordOfTheDay: data.wordOfTheDay?.trim()
          ? data.wordOfTheDay.trim()
          : null,
        idiomOfTheDay: data.idiomOfTheDay?.trim()
          ? data.idiomOfTheDay.trim()
          : null,
      },
      { onSuccess: onClose }
    );
  };

  const isDisabled = updateMeeting.isPending;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-cyan-500 to-blue-400 flex items-center justify-center">
              <Edit2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Edit Meeting Details
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDisabled}
            className="text-slate-400 hover:text-white disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Theme */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Meeting Theme *
            </label>
            <input
              {...register("theme")}
              disabled={isDisabled}
              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.theme ? "border-red-500" : "border-slate-700"
              }`}
            />
            {errors.theme && (
              <p className="mt-1 text-sm text-red-400">
                {errors.theme.message}
              </p>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Date *
              </label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        disabled={isDisabled}
                        className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-left flex items-center gap-2 hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                          errors.date ? "border-red-500" : "border-slate-700"
                        } ${selectedDate ? "text-white" : "text-slate-500"}`}
                      >
                        <CalendarIcon className="w-4 h-4 text-cyan-400" />
                        {selectedDate ? (
                          format(selectedDate, "MMM dd, yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-slate-800 border-cyan-500/30 shadow-xl">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          if (date) {
                            field.onChange(format(date, "yyyy-MM-dd"));
                          }
                        }}
                        initialFocus
                        className="text-white"
                        classNames={{
                          day_selected:
                            "bg-cyan-500 text-white hover:bg-cyan-600 font-bold",
                          day_today:
                            "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/50",
                          nav_button:
                            "text-slate-300 hover:text-white hover:bg-slate-700",
                          caption_label: "text-white font-semibold",
                          day: "text-slate-200 hover:bg-slate-700 hover:text-white",
                          head_cell: "text-cyan-400 font-medium",
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Time */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Time *
              </label>
              <Controller
                name="time"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={selectedTime.hours}
                      onChange={(e) => {
                        const hours = Math.min(
                          23,
                          Math.max(0, parseInt(e.target.value) || 0)
                        );
                        setSelectedTime((prev) => ({ ...prev, hours }));
                        field.onChange(
                          `${String(hours).padStart(2, "0")}:${String(
                            selectedTime.minutes
                          ).padStart(2, "0")}`
                        );
                      }}
                      disabled={isDisabled}
                      className={`w-16 px-2 py-3 bg-slate-800/50 border rounded-xl text-white text-center focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                        errors.time ? "border-red-500" : "border-slate-700"
                      }`}
                    />
                    <span className="text-slate-400 text-xl">:</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={selectedTime.minutes}
                      onChange={(e) => {
                        const minutes = Math.min(
                          59,
                          Math.max(0, parseInt(e.target.value) || 0)
                        );
                        setSelectedTime((prev) => ({ ...prev, minutes }));
                        field.onChange(
                          `${String(selectedTime.hours).padStart(
                            2,
                            "0"
                          )}:${String(minutes).padStart(2, "0")}`
                        );
                      }}
                      disabled={isDisabled}
                      className={`w-16 px-2 py-3 bg-slate-800/50 border rounded-xl text-white text-center focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                        errors.time ? "border-red-500" : "border-slate-700"
                      }`}
                    />
                  </div>
                )}
              />
              {errors.time && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.time.message}
                </p>
              )}
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Venue *
            </label>
            <input
              {...register("venue")}
              disabled={isDisabled}
              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.venue ? "border-red-500" : "border-slate-700"
              }`}
            />
            {errors.venue && (
              <p className="mt-1 text-sm text-red-400">
                {errors.venue.message}
              </p>
            )}
          </div>

          {/* Social Media Links */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-slate-300 text-sm font-medium">
                Social Media Links
                <span className="ml-2 text-slate-500 text-xs font-normal">
                  (up to 3)
                </span>
              </label>
              {socialLinks.length < 3 && (
                <button
                  type="button"
                  disabled={isDisabled}
                  onClick={() => setSocialLinks((prev) => [...prev, ""])}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add link
                </button>
              )}
            </div>
            <div className="space-y-2">
              {socialLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => {
                        const updated = [...socialLinks];
                        updated[index] = e.target.value;
                        setSocialLinks(updated);
                      }}
                      disabled={isDisabled}
                      placeholder="https://www.facebook.com/share/p/..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    />
                  </div>
                  {socialLinks.length > 1 && (
                    <button
                      type="button"
                      disabled={isDisabled}
                      onClick={() =>
                        setSocialLinks((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      className="text-slate-500 hover:text-red-400 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Word of the Day */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Word of the Day
            </label>
            <input
              {...register("wordOfTheDay")}
              disabled={isDisabled}
              placeholder="e.g., Serendipity"
              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.wordOfTheDay ? "border-red-500" : "border-slate-700"
              }`}
            />
            {errors.wordOfTheDay && (
              <p className="mt-1 text-sm text-red-400">
                {errors.wordOfTheDay.message}
              </p>
            )}
          </div>

          {/* Idiom of the Day */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Idiom of the Day
            </label>
            <input
              {...register("idiomOfTheDay")}
              disabled={isDisabled}
              placeholder="e.g., Break the ice"
              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.idiomOfTheDay ? "border-red-500" : "border-slate-700"
              }`}
            />
            {errors.idiomOfTheDay && (
              <p className="mt-1 text-sm text-red-400">
                {errors.idiomOfTheDay.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isDisabled}
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDisabled}
              className="flex-1 px-4 py-3 bg-linear-to-br from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isDisabled ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MeetingHeaderComponent({ meeting }: MeetingHeaderProps) {
  const statusConfig = getMeetingStatusConfig(getEffectiveMeetingStatus(meeting));

  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className="rounded-full px-2.5 py-1 text-xs font-medium"
          style={{
            backgroundColor: statusConfig.bgColor,
            color: statusConfig.color,
          }}
        >
          {statusConfig.label}
        </span>
      </div>
      <h1 className="text-2xl font-bold text-white sm:text-3xl">
        {meeting.theme || "Untitled Meeting"}
      </h1>
    </header>
  );
}

function MeetingDetailsCardComponent({
  meeting,
  totalDuration,
  canEdit,
  meetingId,
  clubId,
}: MeetingDetailsCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const statusConfig = getMeetingStatusConfig(getEffectiveMeetingStatus(meeting));

  return (
    <section className="space-y-5 rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Details
          </h2>
          <span className="text-sm font-medium text-slate-400">
            Meeting #{meeting.meetingNo}
          </span>
        </div>
        {canEdit && meetingId && clubId && (
          <button
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-cyan-400 transition-colors hover:bg-slate-700"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit Details
          </button>
        )}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {[
          {
            icon: CalendarIcon,
            label: "Date",
            value: formatFullMeetingDate(meeting.date),
          },
          {
            icon: Clock,
            label: "Time",
            value: `${formatMeetingTime(meeting.time)}${totalDuration > 0 ? ` · ${totalDuration} min` : ""}`,
          },
          { icon: MapPin, label: "Venue", value: meeting.venue || "TBD" },
          { icon: Activity, label: "Status", value: statusConfig.label },
          ...(meeting.wordOfTheDay
            ? [{ icon: FileText, label: "Word of the Day", value: meeting.wordOfTheDay }]
            : []),
          ...(meeting.idiomOfTheDay
            ? [{ icon: FileText, label: "Idiom of the Day", value: meeting.idiomOfTheDay }]
            : []),
        ].map((item) => (
          <InfoItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
      {isEditOpen && meetingId && clubId && (
        <EditMeetingModal
          meeting={meeting}
          meetingId={meetingId}
          clubId={clubId}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </section>
  );
}

function MeetingNotesCardComponent({
  notes,
  meetingId,
  clubId,
  canManageNotes,
}: MeetingNotesCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState(notes || "");
  const updateNotesMutation = useUpdateMeetingNotes();

  const handleSave = () => {
    updateNotesMutation.mutate(
      { meetingId, notes: noteText, clubId },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setNoteText(notes || "");
    setIsEditing(false);
  };

  if (!notes && !canManageNotes) {
    return null;
  }

  return (
    <section className="space-y-3 rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Meeting Notes
          </h2>
        </div>
        {canManageNotes && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-cyan-400 transition-colors hover:bg-slate-700"
          >
            {notes ? (
              <>
                <Edit2 className="h-3.5 w-3.5" />
                Edit Notes
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                Add Notes
              </>
            )}
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Enter meeting notes..."
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            rows={6}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={updateNotesMutation.isPending}
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50"
            >
              {updateNotesMutation.isPending ? "Saving..." : "Save Notes"}
            </button>
            <button
              onClick={handleCancel}
              disabled={updateNotesMutation.isPending}
              className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="leading-relaxed text-slate-300 whitespace-pre-wrap">
          {notes || (
            <span className="italic text-slate-500">No notes added yet</span>
          )}
        </p>
      )}
    </section>
  );
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

function MeetingSocialLinksCardComponent({
  socialLinks,
}: {
  socialLinks: string[] | null;
}) {
  const links = socialLinks?.filter((l) => l.trim() !== "") ?? [];

  if (links.length === 0) return null;

  return (
    <section className="space-y-3 rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
      <div className="flex items-center gap-2">
        <ExternalLink className="h-4 w-4 text-slate-400" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Social Media Posts
        </h2>
      </div>
      <ul className="space-y-2">
        {links.map((url, i) => (
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
    </section>
  );
}

export const MeetingHeader = memo(MeetingHeaderComponent);
export const MeetingDetailsCard = memo(MeetingDetailsCardComponent);
export const MeetingNotesCard = memo(MeetingNotesCardComponent);
export const MeetingSocialLinksCard = memo(MeetingSocialLinksCardComponent);
