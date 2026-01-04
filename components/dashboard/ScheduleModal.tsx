import { Clock, MapPin, Calendar, FileText } from 'lucide-react';
import { ModalWrapper, ModalHeader, ModalContent } from '@/components/ui/modal-components';
import { Meeting } from '@/lib/types/meeting';
import { formatMeetingDate, formatMeetingTime } from '@/lib/utils/meeting';

interface ScheduleModalProps {
    event: Meeting | null;
    onClose: () => void;
}

export default function ScheduleModal({ event, onClose }: ScheduleModalProps) {
    if (!event) return null;
    return (
        <ModalWrapper isOpen={!!event} onClose={onClose} maxWidth="md">
            <ModalHeader
                title={event.theme}
                description="Meeting Details"
                onClose={onClose}
            />
            <ModalContent>
                <div className="space-y-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-slate-300">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Date & Time</p>
                                <p className="font-medium">
                                    {formatMeetingDate(event.date)} at {formatMeetingTime(event.time)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-slate-300">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Venue</p>
                                <p className="font-medium">{event.venue}</p>
                            </div>
                        </div>

                        {event.notes && (
                            <div className="flex items-start gap-3 text-slate-300">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 mt-1">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Notes</p>
                                    <p className="font-medium leading-relaxed">{event.notes}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3 text-slate-300">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Status</p>
                                <p className="font-medium capitalize">{event.status.replace(/_/g, ' ').toLowerCase()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalContent>
        </ModalWrapper>
    );
}
