import { useEffect, useState } from "react";
import { getMyProfile } from "@/lib/server/profile";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import type { Profile } from "@/lib/types";

export function useProfile() {
  const { user, isPending } = useCurrentUserState();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      setProfile(null);
      setReady(true);
      return;
    }
    setReady(false);
    void getMyProfile()
      .then((p) => {
        setProfile(p);
        setReady(true);
      })
      .catch(() => {
        setProfile(null);
        setReady(true);
      });
  }, [user, isPending]);

  return { profile, setProfile, ready, user, isPending };
}
