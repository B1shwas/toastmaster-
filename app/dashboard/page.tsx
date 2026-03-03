"use client";
import { useState, useEffect } from "react";
import { JoinClubModal, CreateClubModal } from "@/components/clubs";
import type { CreateClubInput } from "@/components/clubs/CreateClubModal";
import type { JoinClubInput } from "@/lib/schemas/club.schema";
import {
	WelcomeSection,
	// QuickActions,
	YourClubsSection,
	UpcomingMeetingsSection,
	UnauthenticatedView,
} from "@/components/dashboard";
import { useAuth } from "@/lib/hooks/useAuth";
import { useCreateClub, useJoinClub, useUserClub, useUpcomingMeetings, useRequestJoinClub, useGetPendingRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/api";
import useAuthStore from "@/lib/stores/useAuthStore";
import { ListAllAgendas } from "@/components/agendaReport/ListAllAgendas";
import { PendingRequest } from "@/components/dashboard/PendingRequest";

export default function DashboardPage() {
	const [isMounted, setIsMounted] = useState(false);
	const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
	const { data: clubs = [], isLoading: isUserClubsLoading } = useUserClub();
	const { data: meetings = [], isLoading: isMeetingsLoading } = useUpcomingMeetings();
	const { toast } = useToast();
	const createClubMutation = useCreateClub();
  const joinClubMutation = useJoinClub();
  const requestJoinClubMutation = useRequestJoinClub();
  const { data: pendingRequestData, isError: isPendingRequestError, error: pendingRequestError } = useGetPendingRequest()
  // console.log("pending Request :: ", pendingRequestData)
  
	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		useAuthStore.setState({ userClubs: clubs });
	}, [clubs]);


	const isAnyLoading = isAuthLoading || isUserClubsLoading || isMeetingsLoading;

	if (!isMounted) return null;

	if (!isAuthenticated) return <UnauthenticatedView />;

	const handleCreate = async (data: CreateClubInput) => {
		try {
			await createClubMutation.mutateAsync(data);
			toast({
				title: "Success",
				description: "Successfully created the club!",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		}
	};

	const handleJoinClub = async (data: JoinClubInput) => {
			await requestJoinClubMutation.mutateAsync(data);
	};

	if (isAnyLoading) {
		return (
			<div className="min-h-screen bg-linear-to-b from-slate-950 to-slate-900 pt-24 pb-12 px-4 flex justify-center items-center">
				<p className="text-white">Loading...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-linear-to-b from-slate-950 to-slate-900 pt-24 pb-12 px-4">
			<div className="max-w-7xl mx-auto">
				<WelcomeSection
					name={user.name}
					clubs={clubs}
				/>

				{isPendingRequestError ? (
					<p className="text-red-400 text-sm px-6">{getErrorMessage(pendingRequestError)}</p>
				) : pendingRequestData ? (
					<PendingRequest pendingRequestData={pendingRequestData} />
				) : null}

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
					<UpcomingMeetingsSection meetings={meetings} />
					<div className="space-y-4">
						<div className="h-8" />
						<ListAllAgendas />
					</div>
				</div>

				{/* <QuickActions
					onJoinClick={() => setIsJoinModalOpen(true)}
					onCreateClick={() => setIsCreateModalOpen(true)}
				/> */}
			</div>

			{isAnyLoading && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
					<p className="text-white text-lg">Loading...</p>
				</div>
			)}

			<JoinClubModal
				isOpen={isJoinModalOpen}
				onClose={() => setIsJoinModalOpen(false)}
				onJoin={handleJoinClub}
				isLoading={joinClubMutation.isPending}
			/>

			<CreateClubModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onCreate={handleCreate}
				isLoading={createClubMutation.isPending}
			/>
		</div>
	);
}
