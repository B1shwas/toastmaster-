import { useState, useEffect, useMemo } from "react";
import type { Agenda } from "@/lib/types/meeting";
import { isMeetingToday } from "@/lib/utils/meeting";

// ============================================
// Types
// ============================================
export interface AgendaWithTiming extends Agenda {
  startTime: string;
  endTime: string;
  startMins: number;
  endMins: number;
}

interface UseAgendaTimingOptions {
  agendas: Agenda[];
  meetingStartTime: string;
  meetingDate: string;
  meetingStatus: string;
}

interface UseAgendaTimingReturn {
  agendaWithTimes: AgendaWithTiming[];
  activeAgendaIndex: number;
  totalTime: number;
  assignedCount: number;
}

// ============================================
// Time Formatting Helper
// ============================================
function formatMinutesToTime(totalMins: number): string {
  const h = Math.floor(totalMins / 60) % 24;
  const m = totalMins % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

// ============================================
// Hook
// ============================================
export function useAgendaTiming({
  agendas,
  meetingStartTime,
  meetingDate,
  meetingStatus,
}: UseAgendaTimingOptions): UseAgendaTimingReturn {
  // Sort agendas by sequence
  const sortedAgendas = useMemo(
    () => [...agendas].sort((a, b) => a.sequence - b.sequence),
    [agendas]
  );

  // Calculate totals
  const totalTime = useMemo(
    () => agendas.reduce((sum, a) => sum + a.allottedTime, 0),
    [agendas]
  );

  const assignedCount = useMemo(
    () => agendas.filter((a) => a.memberId).length,
    [agendas]
  );

  // Calculate start/end times for each agenda item
  const agendaWithTimes = useMemo(() => {
    const [startHour, startMinute] = meetingStartTime.split(":").map(Number);
    let currentMinutes = startHour * 60 + startMinute;

    return sortedAgendas.map((agenda) => {
      const startMins = currentMinutes;
      const endMins = currentMinutes + agenda.allottedTime;
      currentMinutes = endMins;

      return {
        ...agenda,
        startTime: formatMinutesToTime(startMins),
        endTime: formatMinutesToTime(endMins),
        startMins,
        endMins,
      };
    });
  }, [sortedAgendas, meetingStartTime]);

  // Track current time for active agenda detection
  const [currentMinutes, setCurrentMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  const isToday = isMeetingToday(meetingDate);
  const meetingIsLive = meetingStatus === "IN_PROGRESS";
  const shouldTrackTime = isToday || meetingIsLive;

  // Update current time every minute, only if needed
  useEffect(() => {
    if (!shouldTrackTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      setCurrentMinutes(now.getHours() * 60 + now.getMinutes());
    }, 60000);

    return () => clearInterval(interval);
  }, [shouldTrackTime]);

  // Find active agenda index
  const activeAgendaIndex = useMemo(() => {
    if (!shouldTrackTime) return -1;

    return agendaWithTimes.findIndex(
      (a) => currentMinutes >= a.startMins && currentMinutes < a.endMins
    );
  }, [agendaWithTimes, currentMinutes, shouldTrackTime]);

  return {
    agendaWithTimes,
    activeAgendaIndex,
    totalTime,
    assignedCount,
  };
}
