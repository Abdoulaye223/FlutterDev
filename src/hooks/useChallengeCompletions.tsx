import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CompletionCount {
  challenge_id: string;
  count: number;
}

export const useChallengeCompletions = () => {
  const [completions, setCompletions] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletionCounts = async () => {
      try {
        const { data, error } = await supabase
          .from("user_challenges")
          .select("challenge_id")
          .eq("status", "completed");

        if (error) {
          console.error("Error fetching completion counts:", error);
          return;
        }

        // Count completions per challenge
        const counts: Record<string, number> = {};
        data?.forEach((record) => {
          counts[record.challenge_id] = (counts[record.challenge_id] || 0) + 1;
        });

        setCompletions(counts);
      } catch (error) {
        console.error("Error fetching completion counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletionCounts();
  }, []);

  const getCompletionCount = (challengeId: string): number => {
    return completions[challengeId] || 0;
  };

  return { completions, getCompletionCount, loading };
};

export const useSingleChallengeCompletions = (challengeId: string | undefined) => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletionCount = async () => {
      if (!challengeId) {
        setLoading(false);
        return;
      }

      try {
        const { count: completionCount, error } = await supabase
          .from("user_challenges")
          .select("*", { count: "exact", head: true })
          .eq("challenge_id", challengeId)
          .eq("status", "completed");

        if (error) {
          console.error("Error fetching completion count:", error);
          return;
        }

        setCount(completionCount || 0);
      } catch (error) {
        console.error("Error fetching completion count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletionCount();
  }, [challengeId]);

  return { count, loading };
};
