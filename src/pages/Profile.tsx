import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Code2, Heart, Calendar, Github, Linkedin, Twitter, ExternalLink, Loader2, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SubmissionCard } from "@/components/SubmissionCard";
import { Submission } from "@/hooks/useSubmissions";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";

interface ProfileData {
  user_id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  social_links: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  } | null;
}

interface ProfileStats {
  submissions: number;
  completedChallenges: number;
  upvotesReceived: number;
  commentsReceived: number;
}

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<ProfileStats>({
    submissions: 0,
    completedChallenges: 0,
    upvotesReceived: 0,
    commentsReceived: 0,
  });
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        // Fetch public profile using secure function
        const { data: profiles, error: profileError } = await supabase
          .rpc("get_public_profile", { profile_user_id: userId });

        if (profileError) throw profileError;
        
        const profileData = profiles?.[0];
        if (!profileData) {
          setLoading(false);
          return;
        }

        setProfile(profileData as ProfileData);

        // Fetch submissions
        const { data: submissionData, error: submissionError } = await supabase
          .from("challenge_submissions")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (submissionError) throw submissionError;

        const submissionsWithProfile = submissionData.map((s) => ({
          ...s,
          profile: {
            username: profileData.username,
            full_name: profileData.full_name,
            avatar_url: profileData.avatar_url,
          },
        })) as Submission[];

        setSubmissions(submissionsWithProfile);

        // Fetch stats
        const submissionIds = submissionData.map((s) => s.id);

        // Completed challenges count
        const { count: completedCount } = await supabase
          .from("user_challenges")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("status", "completed");

        // Upvotes received
        let upvotesReceived = 0;
        if (submissionIds.length > 0) {
          const { count: upvoteCount } = await supabase
            .from("submission_upvotes")
            .select("*", { count: "exact", head: true })
            .in("submission_id", submissionIds);
          upvotesReceived = upvoteCount || 0;
        }

        // Comments received
        let commentsReceived = 0;
        if (submissionIds.length > 0) {
          const { count: commentCount } = await supabase
            .from("submission_comments")
            .select("*", { count: "exact", head: true })
            .in("submission_id", submissionIds);
          commentsReceived = commentCount || 0;
        }

        setStats({
          submissions: submissionData.length,
          completedChallenges: completedCount || 0,
          upvotesReceived,
          commentsReceived,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleShare = async () => {
    const url = window.location.href;
    const text = `Check out ${profile?.full_name || profile?.username || "this developer"}'s profile on FigCode!`;

    if (navigator.share) {
      try {
        await navigator.share({ title: text, url });
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Profile link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20 pb-16 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
            <p className="text-muted-foreground mb-8">This user profile doesn't exist.</p>
            <Button asChild>
              <Link to="/community">Back to Community</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const displayName = profile.full_name || profile.username || "Anonymous Developer";
  const initials = displayName.split(" ").map((n) => n[0]).join("").toUpperCase();
  const socialLinks = profile.social_links || {};

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20 pb-16">
        {/* Profile Header */}
        <section className="py-12 gradient-hero">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <Avatar className="w-24 h-24 border-4 border-primary-foreground/20">
                <AvatarImage src={profile.avatar_url || ""} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                  {displayName}
                </h1>
                {profile.username && profile.full_name && (
                  <p className="text-primary-foreground/80 mb-2">@{profile.username}</p>
                )}
                {profile.bio && (
                  <p className="text-primary-foreground/90 max-w-2xl">{profile.bio}</p>
                )}
                <div className="flex items-center gap-2 mt-4 justify-center md:justify-start flex-wrap">
                  <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
                    <Calendar className="w-3 h-3 mr-1" />
                    Joined {format(new Date(profile.created_at), "MMM yyyy")}
                  </Badge>
                  {socialLinks.github && (
                    <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/20" asChild>
                      <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {socialLinks.twitter && (
                    <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/20" asChild>
                      <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {socialLinks.linkedin && (
                    <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/20" asChild>
                      <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {socialLinks.website && (
                    <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/20" asChild>
                      <a href={socialLinks.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary-foreground hover:bg-primary-foreground/20"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center">
              <CardHeader className="pb-2">
                <div className="mx-auto w-10 h-10 rounded-full gradient-hero flex items-center justify-center mb-2">
                  <Code2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">{stats.submissions}</CardTitle>
                <CardDescription>Submissions</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader className="pb-2">
                <div className="mx-auto w-10 h-10 rounded-full gradient-hero flex items-center justify-center mb-2">
                  <Trophy className="w-5 h-5 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">{stats.completedChallenges}</CardTitle>
                <CardDescription>Completed</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader className="pb-2">
                <div className="mx-auto w-10 h-10 rounded-full gradient-hero flex items-center justify-center mb-2">
                  <Heart className="w-5 h-5 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">{stats.upvotesReceived}</CardTitle>
                <CardDescription>Upvotes</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader className="pb-2">
                <div className="mx-auto w-10 h-10 rounded-full gradient-accent flex items-center justify-center mb-2">
                  <Code2 className="w-5 h-5 text-accent-foreground" />
                </div>
                <CardTitle className="text-2xl">{stats.commentsReceived}</CardTitle>
                <CardDescription>Feedback</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Submissions */}
          <Tabs defaultValue="submissions">
            <TabsList>
              <TabsTrigger value="submissions">Submissions ({stats.submissions})</TabsTrigger>
            </TabsList>
            <TabsContent value="submissions" className="mt-6">
              {submissions.length > 0 ? (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <SubmissionCard key={submission.id} submission={submission} showChallenge />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No submissions yet
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
