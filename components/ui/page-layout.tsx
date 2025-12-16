"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackLinkProps {
  href: string;
  label?: string;
}

interface NotFoundStateProps {
  title: string;
  message: string;
  backHref: string;
  backLabel?: string;
}

export function BackLink({ href, label = "Back" }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 to-slate-900 px-4 pb-12 pt-24">
      <div className="mx-auto max-w-3xl space-y-8">{children}</div>
    </div>
  );
}

export function NotFoundState({
  title,
  message,
  backHref,
  backLabel = "Go Back",
}: NotFoundStateProps) {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 to-slate-900 px-4 pb-12 pt-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-2 text-2xl font-bold text-white">{title}</h1>
        <p className="mb-6 text-slate-400">{message}</p>
        <Link href={backHref}>
          <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-500">
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Button>
        </Link>
      </div>
    </div>
  );
}
