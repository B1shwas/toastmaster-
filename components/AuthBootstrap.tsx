"use client";

import { useProfile } from "@/lib/api";

export function AuthBootstrap() {
    useProfile();
    return null;
}
