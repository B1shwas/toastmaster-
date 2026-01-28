import { Check, X, User, Mail, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Member, PendingClubGroup } from "@/lib/types/club";

interface RequestWithClubInfo extends Member {
  clubName: string;
  clubId: string;
}

const RequestList = ({
  requests,
  handleAccept,
  handleReject,
  formatDate,
}: {
  requests: RequestWithClubInfo[];
  handleAccept: (clubId: string, memberId: string) => void;
  handleReject: (clubId: string, memberId: string) => void;
  formatDate: (dateString: string) => string;
}) => (
  <>
    {requests.map((request) => (
      <div
        key={request.id}
        className="group bg-linear-to-br from-neutral-900 to-neutral-900/50 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/20"
      >
        <div className="p-5 md:p-7">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Left section with user info */}
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/20 shrink-0">
                <User className="w-6 h-6 text-blue-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h4 className="text-base md:text-lg font-semibold text-white">
                    {request.memberName}
                  </h4>
                  <span className="text-neutral-600">•</span>
                  <span className="text-sm font-medium text-neutral-400">
                    {request.clubName}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-neutral-400">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1.5 text-neutral-500" />
                    <span>{request.memberEmail}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5 text-neutral-500" />
                    <span>{formatDate(request.dateJoined)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => handleAccept(request.clubId, request.id)}
                className="flex-1 md:flex-none px-5 py-2.5 text-sm font-medium text-white bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Accept
              </button>
              <button
                onClick={() => handleReject(request.clubId, request.id)}
                className="flex-1 md:flex-none px-5 py-2.5 text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-neutral-600 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </>
);

export const PendingRequest = ({
  pendingRequestData,
  clubId,
}: {
  pendingRequestData: PendingClubGroup[];
  clubId?: string;
}) => {
  const handleAccept = (clubId: string, memberId: string) => {
    console.log("Accepting request:", { clubId, memberId });
    // Add your accept logic here
  };

  const handleReject = (clubId: string, memberId: string) => {
    console.log("Rejecting request:", { clubId, memberId });
    // Add your reject logic here
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  let allPendingRequests = pendingRequestData.flatMap((club) =>
    club.members
      .filter((m) => m.status === "pending")
      .map((member) => ({ ...member, clubName: club.name, clubId: club.id })),
  );

  if (clubId) {
    allPendingRequests = allPendingRequests.filter((a) => a.clubId === clubId);
  }

  const shouldScroll = allPendingRequests.length > 4;

  if (allPendingRequests.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-white text-xl md:text-2xl font-semibold mb-6">
          Pending Requests
        </h2>
        <div className="flex flex-col items-center justify-center py-16 md:py-24 border border-dashed border-neutral-700 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-neutral-600" />
          </div>
          <h3 className="text-neutral-300 text-lg font-semibold mb-2">
            No Pending Requests
          </h3>
          <p className="text-neutral-500 text-sm text-center max-w-sm">
            Membership requests will appear here when members apply to join your
            clubs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-white text-xl md:text-2xl font-semibold mb-6">
        Pending Requests
      </h2>

      {shouldScroll ? (
        <ScrollArea className="h-[500px] rounded-2xl">
          <div className="flex flex-col gap-4 md:gap-5 pr-4">
            <RequestList
              requests={allPendingRequests}
              handleAccept={handleAccept}
              handleReject={handleReject}
              formatDate={formatDate}
            />
          </div>
        </ScrollArea>
      ) : (
        <div className="flex flex-col gap-4 md:gap-5">
          <RequestList
            requests={allPendingRequests}
            handleAccept={handleAccept}
            handleReject={handleReject}
            formatDate={formatDate}
          />
        </div>
      )}
    </div>
  );
};
