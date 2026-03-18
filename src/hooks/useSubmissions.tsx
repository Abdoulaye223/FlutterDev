import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Submission {
  id: string;
  user_id: string;
  challenge_id: string;
  title: string;
  description: string | null;
  screenshots: string[];
  github_url: string | null;
  live_url: string | null;
  created_at: string;
  updated_at: string;
  profile?: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface SubmissionComment {
  id: string;
  submission_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export const useSubmissions = (challengeId?: string) => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("challenge_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (challengeId) {
        query = query.eq("challenge_id", challengeId);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch public profiles using the secure function
      const userIds = [...new Set(data.map((s) => s.user_id))];
      const { data: profiles } = await supabase
        .rpc("get_public_profiles", { profile_user_ids: userIds });

      const profileMap = new Map(profiles?.map((p: any) => [p.user_id, p]) || []);

      const submissionsWithProfiles = data.map((s) => ({
        ...s,
        profile: profileMap.get(s.user_id) || undefined,
      }));

      setSubmissions(submissionsWithProfiles as Submission[]);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [challengeId]);

  const uploadScreenshots = async (files: File[]): Promise<string[]> => {
    if (!user) throw new Error("Not authenticated");

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("submissions")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("submissions")
        .getPublicUrl(fileName);

      uploadedUrls.push(urlData.publicUrl);
    }

    return uploadedUrls;
  };

  const createSubmission = async (
    challengeId: string,
    title: string,
    description: string,
    screenshots: File[],
    githubUrl?: string,
    liveUrl?: string
  ) => {
    if (!user) {
      toast.error("Please sign in to submit");
      return null;
    }

    try {
      const screenshotUrls = await uploadScreenshots(screenshots);

      const { data, error } = await supabase
        .from("challenge_submissions")
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
          title,
          description,
          screenshots: screenshotUrls,
          github_url: githubUrl || null,
          live_url: liveUrl || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Fetch the user's profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_id, username, full_name, avatar_url")
        .eq("user_id", user.id)
        .maybeSingle();

      const submissionWithProfile = {
        ...data,
        profile: profile || undefined,
      } as Submission;

      setSubmissions((prev) => [submissionWithProfile, ...prev]);
      toast.success("Submission posted successfully!");
      return submissionWithProfile;
    } catch (error) {
      console.error("Error creating submission:", error);
      toast.error("Failed to submit challenge");
      return null;
    }
  };

  return {
    submissions,
    loading,
    createSubmission,
    refetch: fetchSubmissions,
  };
};

export const useSubmissionComments = (submissionId: string) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<SubmissionComment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("submission_comments")
        .select("*")
        .eq("submission_id", submissionId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Fetch public profiles using the secure function
      const userIds = [...new Set(data.map((c) => c.user_id))];
      const { data: profiles } = await supabase
        .rpc("get_public_profiles", { profile_user_ids: userIds });

      const profileMap = new Map(profiles?.map((p: any) => [p.user_id, p]) || []);

      const commentsWithProfiles = data.map((c) => ({
        ...c,
        profile: profileMap.get(c.user_id) || undefined,
      }));

      setComments(commentsWithProfiles as SubmissionComment[]);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (submissionId) {
      fetchComments();
    }
  }, [submissionId]);

  const addComment = async (content: string) => {
    if (!user) {
      toast.error("Please sign in to comment");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("submission_comments")
        .insert({
          submission_id: submissionId,
          user_id: user.id,
          content,
        })
        .select()
        .single();

      if (error) throw error;

      // Fetch the user's profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_id, username, full_name, avatar_url")
        .eq("user_id", user.id)
        .maybeSingle();

      const commentWithProfile = {
        ...data,
        profile: profile || undefined,
      } as SubmissionComment;

      setComments((prev) => [...prev, commentWithProfile]);
      toast.success("Comment added!");

      // Send comment notification email (fire and forget)
      const commenterName = profile?.full_name || profile?.username || "Someone";
      supabase.functions.invoke("send-comment-notification", {
        body: { 
          submissionId, 
          commenterName, 
          commentContent: content 
        },
      }).catch((err) => console.error("Failed to send comment notification:", err));

      return commentWithProfile;
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
      return null;
    }
  };

  return {
    comments,
    loading,
    addComment,
    refetch: fetchComments,
  };
};
