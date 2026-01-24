"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, initializing } = useAuth();

  useEffect(() => {
    if (!initializing && !user) {
      router.replace("/login?from=" + encodeURIComponent(pathname));
    }
  }, [initializing, user, router, pathname]);

  if (initializing || !user) {
    return null;
  }

  return <div className="min-h-[calc(100vh-441px)]">{children}</div>;
}
