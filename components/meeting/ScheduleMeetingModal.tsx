"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Calendar as CalendarIcon, Clock, Loader2, Link, Plus, Trash2 } from "lucide-react";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const scheduleMeetingSchema = z.object({
  meetingNo: z
    .number()
    .int("Meeting number must be an integer")
    .positive("Meeting number must be positive")
    .min(1, "Meeting number must be at least 1"),
  theme: z
    .string()
    .min(3, "Theme must be at least 3 characters")
    .max(200, "Theme must be less than 200 characters"),
  date: z.string().min(1, "Date is required"),
  time: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format"),
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
});

export type ScheduleMeetingInput = z.infer<typeof scheduleMeetingSchema>;

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduleMeetingInput) => void | Promise<void>;
  isLoading?: boolean;
  nextMeetingNo?: number;
}

export function ScheduleMeetingModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  nextMeetingNo = 1,
}: ScheduleMeetingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState({
    hours: 14,
    minutes: 0,
  });
  const [socialLinks, setSocialLinks] = useState<string[]>([""]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleMeetingInput>({
    resolver: zodResolver(scheduleMeetingSchema),
    defaultValues: {
      meetingNo: nextMeetingNo,
      theme: "",
      date: "",
      time: "14:00",
      venue: "",
      socialLinks: [],
    },
  });

  // Reset form when modal closes or nextMeetingNo changes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setSelectedDate(undefined);
      setSelectedTime({ hours: 14, minutes: 0 });
      setSocialLinks([""]);
    } else {
      reset({
        meetingNo: nextMeetingNo,
        theme: "",
        date: "",
        time: "14:00",
        venue: "",
        socialLinks: [],
      });
      setSelectedDate(undefined);
      setSelectedTime({ hours: 14, minutes: 0 });
      setSocialLinks([""]);
    }
  }, [isOpen, nextMeetingNo, reset]);

  const onFormSubmit = async (data: ScheduleMeetingInput) => {
    try {
      const filteredLinks = socialLinks.filter((l) => l.trim() !== "");
      const submitData = {
        ...data,
        time: `${data.time}:00`,
        socialLinks: filteredLinks.length > 0 ? filteredLinks : undefined,
      };
      await onSubmit(submitData);
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to schedule meeting:", error);
    }
  };

  const handleClose = () => {
    if (!isLoading && !isSubmitting) {
      reset();
      onClose();
    }
  };

  if (!isOpen) return null;

  const isDisabled = isLoading || isSubmitting;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-cyan-500 to-blue-400 flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Schedule Meeting</h2>
            </div>
            <button
              onClick={handleClose}
              disabled={isDisabled}
              className="text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            {/* Meeting Number */}
            <div>
              <label
                htmlFor="meetingNo"
                className="block text-slate-300 text-sm font-medium mb-2"
              >
                Meeting Number *
              </label>
              <input
                id="meetingNo"
                type="number"
                {...register("meetingNo", { valueAsNumber: true })}
                disabled={isDisabled}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.meetingNo ? "border-red-500" : "border-slate-700"
                }`}
              />
              {errors.meetingNo && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.meetingNo.message}
                </p>
              )}
            </div>

            {/* Theme */}
            <div>
              <label
                htmlFor="theme"
                className="block text-slate-300 text-sm font-medium mb-2"
              >
                Meeting Theme *
              </label>
              <input
                id="theme"
                type="text"
                {...register("theme")}
                placeholder="e.g., Annual Budget Discussion"
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

            {/* Date & Time Grid */}
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
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
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
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <Clock className="w-4 h-4 text-cyan-400" />
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
                          placeholder="HH"
                          className={`w-20 px-3 py-3 bg-slate-800/50 border rounded-xl text-white text-center placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed ${
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
                          placeholder="MM"
                          className={`w-20 px-3 py-3 bg-slate-800/50 border rounded-xl text-white text-center placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                            errors.time ? "border-red-500" : "border-slate-700"
                          }`}
                        />
                      </div>
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
              <label
                htmlFor="venue"
                className="block text-slate-300 text-sm font-medium mb-2"
              >
                Venue *
              </label>
              <input
                id="venue"
                type="text"
                {...register("venue")}
                placeholder="e.g., Conference Room A"
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

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
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
                    Scheduling...
                  </>
                ) : (
                  "Schedule Meeting"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
