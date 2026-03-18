import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

interface UpvoteState {
  count: number;
  hasUpvoted: boolean;
}

export const useUpvotes = (submissionId: string) => {
  const { user } = useAuth();
  const [state, setState] = useState<UpvoteState>({ count: 0, hasUpvoted: false });
  const [loading, setLoading] = useState(false);

  const fetchUpvotes = async () => {
    try {
      // Get upvote count
      const { count, error: countError } = await supabase
        .from("submission_upvotes")
        .select("*", { count: "exact", head: true })
        .eq("submission_id", submissionId);

      if (countError) throw countError;

      // Check if current user has upvoted
      let hasUpvoted = false;
      if (user) {
        const { data, error: checkError } = await supabase
          .from("submission_upvotes")
          .select("id")
          .eq("submission_id", submissionId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (checkError) throw checkError;
        hasUpvoted = !!data;
      }

      setState({ count: count || 0, hasUpvoted });
    } catch (error) {
      console.error("Error fetching upvotes:", error);
    }
  };

  useEffect(() => {
    fetchUpvotes();
  }, [submissionId, user?.id]);

  const toggleUpvote = async () => {
    if (!user) {
      toast.error("Please sign in to upvote");
      return;
    }

    setLoading(true);
    try {
      if (state.hasUpvoted) {
        // Remove upvote
        const { error } = await supabase
          .from("submission_upvotes")
          .delete()
          .eq("submission_id", submissionId)
          .eq("user_id", user.id);

        if (error) throw error;
        setState((prev) => ({ count: prev.count - 1, hasUpvoted: false }));
      } else {
        // Add upvote
        const { error } = await supabase
          .from("submission_upvotes")
          .insert({ submission_id: submissionId, user_id: user.id });

        if (error) throw error;
        setState((prev) => ({ count: prev.count + 1, hasUpvoted: true }));

        // Send upvote notification email (fire and forget)
        // Fetch the upvoter's public profile first using secure function
        const { data: profiles } = await supabase
          .rpc("get_public_profile", { profile_user_id: user.id });

        const profile = profiles?.[0];
        const upvoterName = profile?.full_name || profile?.username || "Someone";
        supabase.functions.invoke("send-upvote-notification", {
          body: { submissionId, upvoterName },
        }).catch((err) => console.error("Failed to send upvote notification:", err));
      }
    } catch (error) {
      console.error("Error toggling upvote:", error);
      toast.error("Failed to update upvote");
    } finally {
      setLoading(false);
    }
  };

  return {
    upvoteCount: state.count,
    hasUpvoted: state.hasUpvoted,
    toggleUpvote,
    loading,
  };
};

// Hook to get upvote counts for multiple submissions at once
export const useBulkUpvotes = (submissionIds: string[]) => {
  const { user } = useAuth();
  const [upvoteCounts, setUpvoteCounts] = useState<Record<string, number>>({});
  const [userUpvotes, setUserUpvotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (submissionIds.length === 0) return;

    const fetchBulkUpvotes = async () => {
      try {
        // Get all upvotes for these submissions
        const { data, error } = await supabase
          .from("submission_upvotes")
          .select("submission_id, user_id")
          .in("submission_id", submissionIds);

        if (error) throw error;

        // Count upvotes per submission
        const counts: Record<string, number> = {};
        const userUpvoteSet = new Set<string>();

        data.forEach((upvote) => {
          counts[upvote.submission_id] = (counts[upvote.submission_id] || 0) + 1;
          if (user && upvote.user_id === user.id) {
            userUpvoteSet.add(upvote.submission_id);
          }
        });

        setUpvoteCounts(counts);
        setUserUpvotes(userUpvoteSet);
      } catch (error) {
        console.error("Error fetching bulk upvotes:", error);
      }
    };

    fetchBulkUpvotes();
  }, [submissionIds.join(","), user?.id]);

  return { upvoteCounts, userUpvotes };
};
