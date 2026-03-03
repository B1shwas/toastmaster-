"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileData,
  type ChangePasswordData,
} from "@/lib/schemas/auth.schema";
import { useProfile, useUpdateProfile, useChangePassword } from "@/lib/api";
import { FormInput } from "@/components/auth/FormInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/api";

export default function ProfilePage() {
  const { data: profileData, isLoading: loadingProfile } = useProfile();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const { toast } = useToast();

  // redirect if unauthenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
    }
  }, [authLoading, isAuthenticated]);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: updatingProfile },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: changingPassword },
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
  });

  useEffect(() => {
    if (profileData) {
      resetProfile({
        fullName: profileData.user_full_name,
        email: profileData.user_email,
        introduction: profileData.user_introduction ?? "",
      });
    }
  }, [profileData, resetProfile]);

  const onUpdateProfile = async (data: UpdateProfileData) => {
    try {
      await updateProfileMutation.mutateAsync(data);
      toast({ title: "Success", description: "Profile updated" });
    } catch (err) {
      toast({
        title: "Error",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    }
  };

  const onChangePassword = async (data: ChangePasswordData) => {
    try {
      await changePasswordMutation.mutateAsync(data);
      toast({ title: "Success", description: "Password changed" });
      resetPassword();
    } catch (err) {
      toast({
        title: "Error",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    }
  };

  if (loadingProfile) {
    return <p className="text-white p-6">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 to-slate-900 pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto space-y-12">
        <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-6">My Profile</h2>
          <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-5">
            <FormInput
              label="Full Name"
              type="text"
              placeholder="John Doe"
              error={profileErrors.fullName?.message}
              {...registerProfile("fullName")}
            />
            <FormInput
              label="Email address"
              type="email"
              placeholder="you@example.com"
              error={profileErrors.email?.message}
              {...registerProfile("email")}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">
                Introduction
              </label>
              <textarea
                placeholder="Tell others a bit about yourself..."
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                {...registerProfile("introduction")}
              />
              {profileErrors.introduction && (
                <p className="text-red-400 text-sm">{profileErrors.introduction.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={updatingProfile}
              className="w-full bg-linear-to-br from-blue-500 to-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updatingProfile ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </section>

        <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-6">Change Password</h2>
          <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-5">
            <PasswordInput
              label="Current password"
              placeholder="••••••••"
              error={passwordErrors.currentPassword?.message}
              {...registerPassword("currentPassword")}
            />
            <PasswordInput
              label="New password"
              placeholder="••••••••"
              error={passwordErrors.newPassword?.message}
              {...registerPassword("newPassword")}
            />
            <PasswordInput
              label="Confirm new password"
              placeholder="••••••••"
              error={passwordErrors.confirmPassword?.message}
              {...registerPassword("confirmPassword")}
            />
            <button
              type="submit"
              disabled={changingPassword}
              className="w-full bg-linear-to-br from-blue-500 to-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {changingPassword ? "Changing..." : "Change Password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
