import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useUserSubscription = (
  userId: string | undefined,
  onUserChange: () => void
) => {
  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel('user-changes');

    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'usuarios',
          filter: `user_id=eq.${userId}`
        },
        onUserChange
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, onUserChange]);
};