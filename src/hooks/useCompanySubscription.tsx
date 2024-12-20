import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useCompanySubscription = (
  companyId: number | undefined,
  onCompanyChange: () => void
) => {
  useEffect(() => {
    if (!companyId) return;

    const channel = supabase.channel('company-changes');

    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'empresas',
          filter: `id=eq.${companyId}`
        },
        onCompanyChange
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [companyId, onCompanyChange]);
};