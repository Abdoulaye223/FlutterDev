import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useChallengeParticipants = (challengeId: string | undefined) => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipantCount = async () => {
      if (!challengeId) {
        setLoading(false);
        return;
      }

      try {
        const { count: participantCount, error } = await supabase
          .from("user_challenges")
          .select("*", { count: "exact", head: true })
          .eq("challenge_id", challengeId);

        if (error) {
          console.error("Error fetching participant count:", error);
          return;
        }

        setCount(participantCount || 0);
      } catch (error) {
        console.error("Error fetching participant count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantCount();
  }, [challengeId]);

  return { count, loading };
};
