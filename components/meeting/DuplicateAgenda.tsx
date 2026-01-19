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
import { Clock, User, FileText, ArrowLeft } from "lucide-react";
import { useState } from "react";

// Preview component for selected template
const TemplatePreview = ({
  session,
  onBack,
  onConfirm,
}: {
  session: MeetingSession;
  onBack: () => void;
  onConfirm: () => void;
}) => {
  return (
    <DialogContent className="max-w-3xl max-h-[85vh] p-0">
      <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {session.theme}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-1">
              Review template details before scheduling
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <ScrollArea className="flex-1 h-[250px] md:h-[300px] px-6 py-4">
        <div className="space-y-6">
          {/* Session Overview */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Session Details</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700">
                  Duration: {session.time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {session.agendas.length} agenda item
                  {session.agendas.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            {session.notes && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">{session.notes}</p>
              </div>
            )}
          </div>

          {/* Agenda Items */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Agenda Items</h4>
            <div className="space-y-3">
              {session.agendas
                .sort((a, b) => a.sequence - b.sequence)
                .map((agenda, agendaIndex) => (
                  <div
                    key={agendaIndex}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-sm font-semibold text-white">
                        {agenda.sequence}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 mb-2">
                          {agenda.title}
                        </h5>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="text-sm text-gray-600 flex items-center gap-1.5">
                            <User className="h-4 w-4" />
                            {agenda.roleName}
                          </span>
                          <span className="text-sm text-gray-600 flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {agenda.duration} min
                          </span>
                        </div>
                        {agenda.notes && (
                          <div className="bg-gray-50 rounded p-3 mt-2">
                            <p className="text-sm text-gray-600">
                              {agenda.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2 bg-gray-50 rounded-b-2xl">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Back
        </Button>
        <Button
          size="sm"
          onClick={onConfirm}
          className="bg-gray-900 hover:bg-gray-800 text-white"
        >
          Confirm & Schedule
        </Button>
      </div>
    </DialogContent>
  );
};

export const DuplicateAgenda = ({
  duplicateAgenda,
  onTemplateSelect,
}: {
  duplicateAgenda: Template;
  onTemplateSelect?: (session: MeetingSession) => void;
}) => {
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleSelectTemplate = (sessionIndex: number) => {
    setSelectedSession(sessionIndex);
    setShowPreview(true);
  };

  const handleConfirm = () => {
    if (selectedSession !== null && duplicateAgenda.data) {
      const session = duplicateAgenda.data[selectedSession];
      onTemplateSelect?.(session);
      console.log("Confirmed session:", session);
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
    <DialogContent className="max-w-3xl max-h-[85vh] p-0">
      <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200">
        <DialogTitle className="text-xl font-semibold text-gray-900">
          Schedule Using Template
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-600 mt-1">
          Select a meeting template to quickly schedule your agenda
        </DialogDescription>
      </DialogHeader>
      
      <ScrollArea className="flex-1 h-[250px] md:h-[300px] px-6 ">
        {duplicateAgenda.data && duplicateAgenda.data.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-3">
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

      {/* Footer with pagination and actions */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50 rounded-b-2xl">
        <div className="text-sm text-gray-600">
          Showing {duplicateAgenda.data?.length || 0} of {duplicateAgenda.total}{" "}
          templates
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