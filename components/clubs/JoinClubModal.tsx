"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { FormField, TextInput } from "@/components/ui/form-elements";
import { joinClubSchema, type JoinClubInput } from "@/lib/schemas/club.schema";

interface JoinClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (data: JoinClubInput) => Promise<void>;
  isLoading?: boolean;
}

export function JoinClubModal({
  isOpen,
  onClose,
  onJoin,
  isLoading = false,
}: JoinClubModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<JoinClubInput>({
    resolver: zodResolver(joinClubSchema),
    mode: "onChange",
    defaultValues: {
      clubCode: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: JoinClubInput) => {
    try {
      await onJoin(data);
      reset();
      onClose();
    } catch {
      // Error handling is done in the parent component
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Join a Club"
      icon={Ticket}
      iconColorClass="text-blue-400"
      iconBgClass="bg-blue-500/20"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Club Code" error={errors.clubCode?.message}>
          <TextInput
            {...register("clubCode")}
            placeholder="Enter club code (e.g., TM-2024-001)"
            error={!!errors.clubCode}
            disabled={isLoading}
          />
        </FormField>

        <p className="text-sm text-slate-400">
          Ask your club administrator for the club code to join their club.
        </p>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            onClick={handleClose}
            className="flex-1 bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading || !isValid}
          >
            {isLoading ? "Joining..." : "Join Club"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
