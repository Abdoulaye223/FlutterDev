import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export type ChallengeStatus = "started" | "in_progress" | "completed";

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  status: ChallengeStatus;
  started_at: string;
  completed_at: string | null;
}

export const useChallengeProgress = (challengeId?: string) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserChallenge | null>(null);
  const [allProgress, setAllProgress] = useState<UserChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProgress(null);
      setAllProgress([]);
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      setLoading(true);
      try {
        if (challengeId) {
          const { data, error } = await supabase
            .from("user_challenges")
            .select("*")
            .eq("user_id", user.id)
            .eq("challenge_id", challengeId)
            .maybeSingle();

          if (error) throw error;
          setProgress(data as UserChallenge | null);
        }

        // Always fetch all progress for dashboard
        const { data: allData, error: allError } = await supabase
          .from("user_challenges")
          .select("*")
          .eq("user_id", user.id);

        if (allError) throw allError;
        setAllProgress(allData as UserChallenge[]);
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user, challengeId]);

  const startChallenge = async (id: string) => {
    if (!user) {
      toast.error("Please sign in to start challenges");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("user_challenges")
        .insert({
          user_id: user.id,
          challenge_id: id,
          status: "started",
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          toast.info("You've already started this challenge");
          return null;
        }
        throw error;
      }

      setProgress(data as UserChallenge);
      setAllProgress((prev) => [...prev, data as UserChallenge]);
      toast.success("Challenge started! Good luck!");
      return data as UserChallenge;
    } catch (error) {
      console.error("Error starting challenge:", error);
      toast.error("Failed to start challenge");
      return null;
    }
  };

  const updateStatus = async (id: string, status: ChallengeStatus) => {
    if (!user) return null;

    try {
      const updateData: { status: ChallengeStatus; completed_at?: string } = { status };
      if (status === "completed") {
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("user_challenges")
        .update(updateData)
        .eq("user_id", user.id)
        .eq("challenge_id", id)
        .select()
        .single();

      if (error) throw error;

      setProgress(data as UserChallenge);
      setAllProgress((prev) =>
        prev.map((p) => (p.challenge_id === id ? (data as UserChallenge) : p))
      );

      if (status === "completed") {
        toast.success("Congratulations! Challenge completed! 🎉");
      }

      return data as UserChallenge;
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update progress");
      return null;
    }
  };

  return {
    progress,
    allProgress,
    loading,
    startChallenge,
    updateStatus,
  };
};
