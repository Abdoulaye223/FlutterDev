import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const usePremium = () => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [premiumUntil, setPremiumUntil] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsPremium(false);
      setPremiumUntil(null);
      setLoading(false);
      return;
    }

    const fetchPremiumStatus = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("is_premium, premium_until")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        const now = new Date();
        const until = data.premium_until ? new Date(data.premium_until) : null;
        
        // Check if premium is still valid
        const isActive = data.is_premium && (!until || until > now);
        
        setIsPremium(isActive);
        setPremiumUntil(until);
      } catch (error) {
        console.error("Error fetching premium status:", error);
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    };

    fetchPremiumStatus();
  }, [user]);

  return {
    isPremium,
    premiumUntil,
    loading,
  };
};
