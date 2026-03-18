import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface UpvoteNotificationRequest {
  submissionId: string;
  upvoterName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    // Create client with user's auth to validate JWT
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("Invalid JWT:", claimsError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const authenticatedUserId = claimsData.claims.sub;
    console.log("Authenticated user:", authenticatedUserId);

    const { submissionId, upvoterName }: UpvoteNotificationRequest = await req.json();

    console.log("Processing upvote notification for submission:", submissionId);

    // Use service role client for admin operations
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the authenticated user actually upvoted this submission
    const { data: upvoteExists, error: upvoteCheckError } = await adminClient
      .from("submission_upvotes")
      .select("id")
      .eq("submission_id", submissionId)
      .eq("user_id", authenticatedUserId)
      .maybeSingle();

    if (upvoteCheckError || !upvoteExists) {
      console.error("User did not upvote this submission:", upvoteCheckError);
      return new Response(
        JSON.stringify({ error: "Forbidden - you must be the upvoter" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get the submission and the owner's info
    const { data: submission, error: submissionError } = await adminClient
      .from("challenge_submissions")
      .select("user_id")
      .eq("id", submissionId)
      .single();

    if (submissionError || !submission) {
      console.error("Error fetching submission:", submissionError);
      return new Response(
        JSON.stringify({ error: "Submission not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Don't send notification if the upvoter is the submission owner
    if (submission.user_id === authenticatedUserId) {
      console.log("Skipping notification - upvoter is the submission owner");
      return new Response(
        JSON.stringify({ message: "Skipped - upvoter is submission owner" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get the submission owner's profile
    const { data: profile } = await adminClient
      .from("profiles")
      .select("full_name")
      .eq("user_id", submission.user_id)
      .single();

    // Get user email from auth
    const { data: userData, error: userError } = await adminClient.auth.admin.getUserById(
      submission.user_id
    );

    if (userError || !userData?.user?.email) {
      console.error("Error fetching user:", userError);
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const ownerEmail = userData.user.email;
    const ownerName = profile?.full_name || "there";

    console.log("Sending upvote notification to:", ownerEmail);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "CodeCraft <onboarding@resend.dev>",
        to: [ownerEmail],
        subject: `${upvoterName} upvoted your submission! 🎉`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f59e0b, #f97316); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
              .header h1 { color: white; margin: 0; font-size: 24px; }
              .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
              .emoji-big { font-size: 48px; text-align: center; margin: 20px 0; }
              .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Your Submission Got an Upvote!</h1>
              </div>
              <div class="content">
                <div class="emoji-big">👍</div>
                <p>Hi ${ownerName}! 👋</p>
                <p><strong>${upvoterName}</strong> just upvoted your submission!</p>
                <p>Your work is being recognized by the community. Keep up the amazing work!</p>
                <a href="${Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '.lovable.app')}/community" class="button">View Your Submission</a>
              </div>
              <div class="footer">
                <p>Keep building awesome things! 🚀<br>The CodeCraft Team</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error(`Resend API error: ${error}`);
    }

    const data = await res.json();
    console.log("Upvote notification sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending upvote notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
