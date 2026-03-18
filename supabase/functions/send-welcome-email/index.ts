import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  fullName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client and verify JWT
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify JWT and get claims
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("JWT verification failed:", claimsError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get the authenticated user's email from JWT claims
    const userEmail = claimsData.claims.email as string;
    if (!userEmail) {
      console.error("No email found in JWT claims");
      return new Response(
        JSON.stringify({ error: "User email not found" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Parse request body for optional fullName
    let fullName: string | undefined;
    try {
      const body: WelcomeEmailRequest = await req.json();
      fullName = body.fullName;
      
      // Validate fullName if provided (max 100 chars, sanitize)
      if (fullName) {
        fullName = String(fullName).slice(0, 100).replace(/[<>]/g, '');
      }
    } catch {
      // Body is optional, continue without fullName
    }

    console.log("Sending welcome email to authenticated user:", userEmail);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "CodeCraft <onboarding@resend.dev>",
        to: [userEmail], // Only send to the authenticated user's email
        subject: "Welcome to CodeCraft! 🚀",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
              .header h1 { color: white; margin: 0; font-size: 28px; }
              .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
              .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to CodeCraft!</h1>
              </div>
              <div class="content">
                <p>Hi ${fullName || 'there'}! 👋</p>
                <p>Thank you for joining CodeCraft! We're excited to have you as part of our community of developers.</p>
                <p>Here's what you can do:</p>
                <ul>
                  <li>🎯 Take on coding challenges to sharpen your skills</li>
                  <li>🏆 Track your progress and climb the leaderboard</li>
                  <li>🤝 Share your solutions and learn from others</li>
                  <li>💬 Engage with the community through comments</li>
                </ul>
                <p>Ready to start your coding journey?</p>
                <a href="${supabaseUrl?.replace('.supabase.co', '.lovable.app')}/challenges" class="button">Browse Challenges</a>
              </div>
              <div class="footer">
                <p>Happy coding! 🎉<br>The CodeCraft Team</p>
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
    console.log("Welcome email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
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
