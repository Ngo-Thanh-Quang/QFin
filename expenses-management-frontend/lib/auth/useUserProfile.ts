"use client";

import { useEffect, useState } from "react";
import { useAuthUser } from "@/lib/auth/useAuthUser";

type UserProfile = {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  incomeAmount?: number;
};

export function useUserProfile() {
  const { user, initializing } = useAuthUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    if (!user || initializing) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      try {
        const idToken = await user.getIdToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        if (!isActive) {
          return;
        }

        if (!res.ok) {
          setProfile(null);
          return;
        }

        const data = await res.json();
        setProfile(data?.profile ?? null);
      } catch (error) {
        if (isActive) {
          setProfile(null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [user, initializing]);

  return { profile, loading };
}
