import { Template, MeetingSession } from "@/lib/types/meeting";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Clock, User, FileText, ArrowLeft, CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { SelectInput } from "../ui/form-elements";
import { ROLE_LABELS, SystemRole } from "@/lib/types/agenda";
import { useClubMembers, useCreateMeetingWithTemplate } from "@/lib/api";
import { useParams } from "next/navigation";

const meetingSessionSchema = z.object({
  theme: z.string().min(1, "Theme is required"),
  clubId: z.string().min(1, "clubId is required"),
  meetingNo: z.string().min(1, "meetingNo is required"),
  date: z.string().min(1, "date is required"),
  venue: z.string().min(1, "venue is required"),
  // isDeleted: z.boolean(),
  status: z.string(),
  time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, "Invalid time format"),
  notes: z.string().nullable(),
  agendas: z
    .array(
      z.object({
        // description: z.string().min(1, "description is required"),
        // role: z.number().min(1, "role is required"),
        title: z.string().min(1, "Title is required"),
        roleName: z.string().min(1, "Role is required"),
        duration: z.number().min(1).max(300),
        memberId: z.string().nullable(),
        memberName: z.string().min(2, "member name should be given"),
        sequence: z.number().min(1),
        notes: z.string().nullable(),
        assignmentType: z.enum(["member", "guest"]),
      }),
    )
    .min(1, "At least one agenda item is required"),
});

export type MeetingSessionForm = z.infer<typeof meetingSessionSchema>;

const TemplatePreview = ({
  session,
  onBack,
  onConfirm,
}: {
  session: MeetingSession;
  onBack: () => void;
  onConfirm: (data: MeetingSessionForm) => void;
}) => {
  const params = useParams<{
    id: string;
  }>();
  const clubId = params.id;

  const { data: membersData } = useClubMembers(clubId);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState({
    hours: 14,
    minutes: 0,
  });

  const roleOptions = [
    { value: "", label: "Select a role" },
    ...Object.values(SystemRole).map((role) => ({
      value: ROLE_LABELS[role],
      label: ROLE_LABELS[role],
    })),
  ];

  const memberOptions = [
    { value: "", label: "Select member" },
    ...(membersData || []).map((member) => ({
      value: member.member_id,
      label: member.member_member_name,
    })),
  ];

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MeetingSessionForm>({
    resolver: zodResolver(meetingSessionSchema),
    defaultValues: {
      theme: session.theme,
      time: session.time,
      notes: session.notes,
      venue: "",
      date: "",
      clubId: clubId || "",
      meetingNo: "",
      // isDeleted: false,
      status: "SCHEDULED",
      agendas: session.agendas
        .sort((a, b) => a.sequence - b.sequence)
        .map((agenda) => ({
          ...agenda,
          assignmentType: "member",
        })),
    },
  });
  console.log(errors);

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "agendas",
  });

  const onSubmit = (data: MeetingSessionForm) => {
    onConfirm(data);
  };

  return (
    <DialogContent className="max-w-3xl max-h-[85vh] p-0 flex flex-col">
      <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Session Details
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-1">
              Review template details and provide some fields before scheduling
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-1 min-h-0"
      >
        <ScrollArea className="flex-1 px-6 py-4 overflow-auto">
          <div className="space-y-6">
            {/* Session Overview */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">
                Meeting Details
              </h4>

              <div className="space-y-4">
                {/* meeting no */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Meeting no *
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register("meetingNo")}
                    placeholder="1"
                    className="flex-1 w-fit px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  {errors.meetingNo && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.meetingNo.message}
                    </p>
                  )}
                </div>

                {/* Meeting theme Field */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Meeting Theme *
                  </label>
                  <input
                    {...register("theme")}
                    className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Enter meeting theme"
                  />
                  {errors.theme && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.theme.message}
                    </p>
                  )}
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
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
                              className={`w-full px-3 py-2 bg-white border rounded-md text-left flex items-center gap-2 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                                errors.date
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } ${selectedDate ? "text-gray-900" : "text-gray-500"}`}
                            >
                              <CalendarIcon className="w-4 h-4 text-gray-600" />
                              {selectedDate ? (
                                <span className="text-sm">
                                  {format(selectedDate, "MMM dd, yyyy")}
                                </span>
                              ) : (
                                <span className="text-sm">Pick a date</span>
                              )}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-white border-gray-200 shadow-lg">
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
                              classNames={{
                                day_selected:
                                  "bg-gray-900 text-white hover:bg-gray-800 font-semibold",
                                day_today:
                                  "bg-gray-100 text-gray-900 font-semibold border border-gray-300",
                                nav_button:
                                  "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                                caption_label: "text-gray-900 font-semibold",
                                day: "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                                head_cell: "text-gray-600 font-medium",
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.date && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.date.message}
                      </p>
                    )}
                  </div>

                  {/* Time */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Time *
                    </label>
                    <Controller
                      name="time"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 flex-1">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <input
                              type="number"
                              min="0"
                              max="23"
                              value={selectedTime.hours}
                              onChange={(e) => {
                                const hours = Math.min(
                                  23,
                                  Math.max(0, parseInt(e.target.value) || 0),
                                );
                                setSelectedTime((prev) => ({ ...prev, hours }));
                                field.onChange(
                                  `${String(hours).padStart(2, "0")}:${String(
                                    selectedTime.minutes,
                                  ).padStart(2, "0")}:00`,
                                );
                              }}
                              placeholder="HH"
                              className={`w-20 px-3 py-2 bg-white border rounded-md text-gray-900 text-center placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                                errors.time
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            <span className="text-gray-600 text-lg">:</span>
                            <input
                              type="number"
                              min="0"
                              max="59"
                              value={selectedTime.minutes}
                              onChange={(e) => {
                                const minutes = Math.min(
                                  59,
                                  Math.max(0, parseInt(e.target.value) || 0),
                                );
                                setSelectedTime((prev) => ({
                                  ...prev,
                                  minutes,
                                }));
                                field.onChange(
                                  `${String(selectedTime.hours).padStart(
                                    2,
                                    "0",
                                  )}:${String(minutes).padStart(2, "0")}:00`,
                                );
                              }}
                              placeholder="MM"
                              className={`w-20 px-3 py-2 bg-white border rounded-md text-gray-900 text-center placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                                errors.time
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                          </div>
                        </div>
                      )}
                    />
                    {errors.time && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.time.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Venue Field */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Venue *
                  </label>
                  <input
                    {...register("venue")}
                    placeholder="Enter venue location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  {errors.venue && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.venue.message}
                    </p>
                  )}
                </div>

                {/* Notes Field */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Notes
                  </label>
                  <textarea
                    {...register("notes")}
                    rows={3}
                    placeholder="Add session notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                  />
                  {errors.notes && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.notes.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Agenda Items */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Agenda Items</h4>
              <Accordion type="multiple" className="space-y-3">
                {fields.map((field, index) => {
                  const assignmentType = watch(
                    `agendas.${index}.assignmentType`,
                  );

                  return (
                    <AccordionItem
                      key={field.id}
                      value={`item-${index}`}
                      className="bg-white border border-gray-200 rounded-lg"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center gap-3 w-full">
                          <div
                            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white ${
                              errors.agendas?.[index]
                                ? "bg-red-600"
                                : "bg-gray-900"
                            }`}
                          >
                            {field.sequence}
                          </div>
                          <div className="flex-1 text-left">
                            <h5
                              className={`font-semibold ${
                                errors.agendas?.[index]
                                  ? "text-red-600"
                                  : "text-gray-900"
                              }`}
                            >
                              {field.title}
                            </h5>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-4 pt-2">
                          {/* Title Field */}
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                              Title *
                            </label>
                            <input
                              {...register(`agendas.${index}.title`)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                              placeholder="Enter agenda title"
                            />
                            {errors.agendas?.[index]?.title && (
                              <p className="text-xs text-red-600 mt-1">
                                {errors.agendas[index]?.title?.message}
                              </p>
                            )}
                          </div>

                          {/* role Field */}
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                              Role *
                            </label>
                            <Controller
                              name={`agendas.${index}.roleName`}
                              control={control}
                              render={({ field }) => (
                                <SelectInput
                                  {...field}
                                  options={roleOptions}
                                  className="w-full px-3 py-2 text-black border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                                />
                              )}
                            />
                            {errors.agendas?.[index]?.roleName && (
                              <p className="text-xs text-red-600 mt-1">
                                {errors.agendas[index]?.roleName?.message}
                              </p>
                            )}
                          </div>

                          {/* sequence and Duration Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Duration */}
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">
                                Duration (minutes) *
                              </label>
                              <input
                                type="number"
                                {...register(`agendas.${index}.duration`, {
                                  valueAsNumber: true,
                                })}
                                min="1"
                                max="300"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                placeholder="Enter duration"
                              />
                              {errors.agendas?.[index]?.duration && (
                                <p className="text-xs text-red-600 mt-1">
                                  {errors.agendas[index]?.duration?.message}
                                </p>
                              )}
                            </div>

                            {/* sequence */}
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">
                                Sequence *
                              </label>
                              <input
                                type="number"
                                min="1"
                                {...register(`agendas.${index}.sequence`, {
                                  valueAsNumber: true,
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                placeholder="Enter sequence number"
                              />
                              {errors.agendas?.[index]?.sequence && (
                                <p className="text-xs text-red-600 mt-1">
                                  {errors.agendas[index]?.sequence?.message}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Assignment  */}
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                              Assigned To{" "}
                              <span className="text-red-600">*</span>
                            </label>
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                {assignmentType === "guest" ? (
                                  <input
                                    {...register(`agendas.${index}.memberName`)}
                                    placeholder="Enter guest name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                  />
                                ) : (
                                  <Controller
                                    name={`agendas.${index}.memberId`}
                                    control={control}
                                    render={({
                                      field: { onChange, value, ...fieldProps },
                                    }) => (
                                      <SelectInput
                                        {...fieldProps}
                                        value={value || ""}
                                        options={memberOptions}
                                        onChange={(e) => {
                                          const selectedValue = e.target.value;
                                          onChange(selectedValue || null);
                                          const selectedMember =
                                            membersData?.find(
                                              (m) =>
                                                m.member_id === selectedValue,
                                            );
                                          if (selectedMember) {
                                            setValue(
                                              `agendas.${index}.memberName`,
                                              selectedMember.member_member_name,
                                            );
                                          } else {
                                            setValue(
                                              `agendas.${index}.memberName`,
                                              "",
                                            );
                                          }
                                        }}
                                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                                      />
                                    )}
                                  />
                                )}
                              </div>
                              <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={assignmentType === "guest"}
                                  onChange={(e) => {
                                    const isGuest = e.target.checked;
                                    setValue(
                                      `agendas.${index}.assignmentType`,
                                      isGuest ? "guest" : "member",
                                    );
                                    if (isGuest) {
                                      setValue(
                                        `agendas.${index}.memberId`,
                                        null,
                                      );
                                      setValue(
                                        `agendas.${index}.memberName`,
                                        "",
                                      );
                                    } else {
                                      setValue(
                                        `agendas.${index}.memberName`,
                                        "",
                                      );
                                    }
                                  }}
                                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-2 focus:ring-gray-900 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                  Guest?
                                </span>
                              </label>
                            </div>
                            {errors.agendas?.[index]?.memberName && (
                              <p className="text-xs text-red-600 mt-1">
                                {errors.agendas[index]?.memberName?.message}
                              </p>
                            )}
                          </div>

                          {/* Notes Field */}
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                              Notes
                            </label>
                            <textarea
                              {...register(`agendas.${index}.notes`)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                              placeholder="Add notes for this agenda item..."
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2 bg-gray-50 rounded-b-2xl shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onBack}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Back
          </Button>
          <Button
            type="submit"
            size="sm"
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            Confirm & Schedule
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export const DuplicateAgenda = ({
  duplicateAgenda,
  onTemplateSelect,
  onClose,
}: {
  duplicateAgenda: Template;
  onTemplateSelect?: (session: MeetingSession) => void;
  onClose?: () => void;
}) => {
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const createMeetingWithTemplate = useCreateMeetingWithTemplate();

  const handleSelectTemplate = (sessionIndex: number) => {
    setSelectedSession(sessionIndex);
    setShowPreview(true);
  };

  const handleConfirm = (formData: MeetingSessionForm) => {
    if (selectedSession !== null && duplicateAgenda.data) {
      onTemplateSelect?.(formData);
      console.log("Confirmed session:", formData);
      createMeetingWithTemplate.mutate(formData, {
        onSuccess: () => {
          setShowPreview(false);
          setSelectedSession(null);
          onClose?.();
        },
      });
    }
  };

  const handleBack = () => {
    setShowPreview(false);
  };

  if (showPreview && selectedSession !== null && duplicateAgenda.data) {
    return (
      <TemplatePreview
        session={duplicateAgenda.data[selectedSession]}
        onBack={handleBack}
        onConfirm={handleConfirm}
      />
    );
  }

  return (
    <DialogContent className="max-w-3xl max-h-[85vh] p-0 flex flex-col">
      <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200 shrink-0">
        <DialogTitle className="text-xl font-semibold text-gray-900">
          Schedule Using Template
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-600 mt-1">
          Select a meeting template to quickly schedule your agenda
        </DialogDescription>
      </DialogHeader>

      <ScrollArea className="flex-1 px-6 overflow-auto">
        {duplicateAgenda.data && duplicateAgenda.data.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-3 py-4">
            {duplicateAgenda.data.map((session, sessionIndex) => (
              <AccordionItem
                key={sessionIndex}
                value={`session-${sessionIndex}`}
                className={`border rounded-lg transition-all ${
                  selectedSession === sessionIndex
                    ? "border-gray-900 bg-gray-50 shadow-sm"
                    : "border-gray-200 bg-white"
                }`}
              >
                {/* Session Header */}
                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedSession(sessionIndex)}
                >
                  <AccordionTrigger className="px-4 py-4 hover:no-underline border-b border-gray-100 [&[data-state=open]>svg]:rotate-90">
                    <div className="flex items-start justify-between flex-1 text-left pr-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-base">
                          {session.theme}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-600 flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {session.time}
                          </span>
                          <span className="text-sm text-gray-600">
                            {session.agendas.length} agenda item
                            {session.agendas.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        {session.notes && (
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                            {session.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                </div>

                {/* Agenda Items - Expandable */}
                <AccordionContent className="px-4 pb-4 bg-gray-50/50">
                  <div className="space-y-2 pt-2">
                    {session.agendas
                      .sort((a, b) => a.sequence - b.sequence)
                      .map((agenda, agendaIndex) => (
                        <div
                          key={agendaIndex}
                          className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-md"
                        >
                          <div className="shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                            {agenda.sequence}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900">
                              {agenda.title}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-xs text-gray-600 flex items-center gap-1">
                                <User className="h-3.5 w-3.5" />
                                {agenda.roleName}
                              </span>
                              <span className="text-xs text-gray-600 flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {agenda.duration} min
                              </span>
                            </div>
                            {agenda.notes && (
                              <p className="text-xs text-gray-500 mt-1.5 flex items-start gap-1">
                                <FileText className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                <span className="line-clamp-2">
                                  {agenda.notes}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-900 font-medium">No templates available</p>
            <p className="text-sm text-gray-500 mt-1">
              Create a meeting template to get started
            </p>
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50 rounded-b-2xl shrink-0">
        <div className="text-sm text-gray-600">
          {/*Showing {duplicateAgenda.data?.length || 0} of {duplicateAgenda.total}{" "}
          templates*/}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={selectedSession === null}
            onClick={() =>
              selectedSession !== null && handleSelectTemplate(selectedSession)
            }
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            Use This Template
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};
