"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, UserPlus, Loader2 } from "lucide-react";
import {
  addMemberSchema,
  type AddMemberInput,
} from "@/lib/schemas/club.schema";
import { getErrorMessage } from "@/lib/api/error";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddMemberInput) => void | Promise<void>;
  isLoading?: boolean;
  existingEmails?: string[];
}

export function AddMemberModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  existingEmails = [],
}: AddMemberModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AddMemberInput>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      memberName: "",
      memberEmail: "",
      toastmasterId: "",
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onFormSubmit = async (data: AddMemberInput) => {
    // Check for duplicate email
    if (
      existingEmails.some(
        (email) => email.toLowerCase() === data.memberEmail.toLowerCase()
      )
    ) {
      setError("memberEmail", {
        type: "manual",
        message: "A member with this email already exists",
      });
      return;
    }

    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to add member:", getErrorMessage(error));
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
          className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Add Member</h2>
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
            <div>
              <label
                htmlFor="memberName"
                className="block text-slate-300 text-sm font-medium mb-2"
              >
                Member Name *
              </label>
              <input
                id="memberName"
                type="text"
                {...register("memberName")}
                placeholder="Enter member's full name"
                disabled={isDisabled}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.memberName ? "border-red-500" : "border-slate-700"
                }`}
              />
              {errors.memberName && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.memberName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="memberEmail"
                className="block text-slate-300 text-sm font-medium mb-2"
              >
                Email Address *
              </label>
              <input
                id="memberEmail"
                type="email"
                {...register("memberEmail")}
                placeholder="Enter member's email"
                disabled={isDisabled}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.memberEmail ? "border-red-500" : "border-slate-700"
                }`}
              />
              {errors.memberEmail && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.memberEmail.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="toastmasterId"
                className="block text-slate-300 text-sm font-medium mb-2"
              >
                Toastmasters Member ID
              </label>
              <input
                id="toastmasterId"
                type="text"
                {...register("toastmasterId")}
                placeholder="e.g. PN-67598269"
                disabled={isDisabled}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-mono ${
                  errors.toastmasterId ? "border-red-500" : "border-slate-700"
                }`}
              />
              {errors.toastmasterId && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.toastmasterId.message}
                </p>
              )}
            </div>

            <p className="text-slate-500 text-sm">
              An invitation will be sent to the member&apos;s email address.
            </p>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <motion.button
                type="submit"
                disabled={isDisabled}
                whileHover={isDisabled ? {} : { scale: 1.02 }}
                whileTap={isDisabled ? {} : { scale: 0.98 }}
                className="flex-1 bg-linear-to-br from-blue-500 to-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDisabled ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Member"
                )}
              </motion.button>
              <motion.button
                type="button"
                disabled={isDisabled}
                whileHover={isDisabled ? {} : { scale: 1.02 }}
                whileTap={isDisabled ? {} : { scale: 0.98 }}
                onClick={handleClose}
                className="px-6 bg-slate-800 border border-slate-700 text-white font-semibold py-3 rounded-xl hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
