"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { User, Lock, Save, Loader2 } from "lucide-react";
import { useProfile, useUpdateProfile, useChangePassword } from "@/lib/api/hooks/use-auth";
import { useAuth } from "@/lib/hooks/useAuth";
import { FormInput } from "@/components/auth/FormInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useToast } from "@/hooks/use-toast";

const updateProfileSchema = z.object({
  fullName: z.string().min(7, "Name must be at least 7 characters"),
  email: z.string().email("Please enter a valid email address"),
  introduction: z.string().max(500, "Introduction must be under 500 characters").optional().or(z.literal("")),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type UpdateProfileForm = z.infer<typeof updateProfileSchema>;
type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function ProfilePage() {
  const { data: profileData, isLoading } = useProfile();
  const { isAuthenticated } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const { toast } = useToast();
  const [charCount, setCharCount] = useState(0);

  const profileForm = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      fullName: profileData?.user_full_name ?? "",
      email: profileData?.user_email ?? "",
      introduction: profileData?.introduction ?? "",
    },
  });

  const passwordForm = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onUpdateProfile = async (data: UpdateProfileForm) => {
    try {
      await updateProfileMutation.mutateAsync(data);
      toast({ title: "Profile updated", description: "Your profile has been saved." });
    } catch {
      toast({ variant: "destructive", title: "Failed to update profile", description: "Please try again." });
    }
  };

  const onChangePassword = async (data: ChangePasswordForm) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      passwordForm.reset();
      toast({ title: "Password changed", description: "Your password has been updated." });
    } catch {
      toast({ variant: "destructive", title: "Failed to change password", description: "Check your current password and try again." });
    }
  };

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-slate-950 to-slate-900">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  const initials = profileData?.user_full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xl">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{profileData?.user_full_name}</h1>
            <p className="text-slate-400 text-sm">{profileData?.user_email}</p>
          </div>
        </motion.div>

        {/* Update Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Profile Information</h2>
          </div>

          <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
            <FormInput
              label="Full Name"
              placeholder="Your full name"
              error={profileForm.formState.errors.fullName?.message}
              {...profileForm.register("fullName")}
            />
            <FormInput
              label="Email"
              type="email"
              placeholder="Your email address"
              error={profileForm.formState.errors.email?.message}
              {...profileForm.register("email")}
            />

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Introduction
              </label>
              <textarea
                rows={4}
                maxLength={500}
                placeholder="Tell other members about yourself..."
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                {...profileForm.register("introduction", {
                  onChange: (e) => setCharCount(e.target.value.length),
                })}
              />
              <div className="flex justify-between mt-1">
                {profileForm.formState.errors.introduction && (
                  <p className="text-sm text-red-400">{profileForm.formState.errors.introduction.message}</p>
                )}
                <p className="text-xs text-slate-500 ml-auto">{charCount}/500</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold px-6 py-2.5 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition"
            >
              {updateProfileMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </form>
        </motion.div>

        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Lock className="w-4 h-4 text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Change Password</h2>
          </div>

          <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
            <PasswordInput
              label="Current Password"
              placeholder="Enter current password"
              error={passwordForm.formState.errors.currentPassword?.message}
              {...passwordForm.register("currentPassword")}
            />
            <PasswordInput
              label="New Password"
              placeholder="Enter new password"
              error={passwordForm.formState.errors.newPassword?.message}
              {...passwordForm.register("newPassword")}
            />
            <PasswordInput
              label="Confirm New Password"
              placeholder="Confirm new password"
              error={passwordForm.formState.errors.confirmPassword?.message}
              {...passwordForm.register("confirmPassword")}
            />

            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 text-purple-300 font-semibold px-6 py-2.5 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {changePasswordMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              Change Password
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
