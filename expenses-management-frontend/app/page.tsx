"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { Promotion } from "@/components/promotion";
import { DashboardContent } from "@/components/dashboard/layout/DashboardContent";

export default function Home() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="min-h-[calc(100vh-441px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-441px)]">
      {user ? <DashboardContent /> : <Promotion />}
    </div>
  );
}
