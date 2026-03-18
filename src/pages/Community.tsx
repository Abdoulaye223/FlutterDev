import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Heart, Code2, Loader2 } from "lucide-react";
import { useSubmissions } from "@/hooks/useSubmissions";
import { SubmissionCard } from "@/components/SubmissionCard";
import { Leaderboard } from "@/components/Leaderboard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Community = () => {
  const { submissions, loading: submissionsLoading } = useSubmissions();
  const [stats, setStats] = useState({ submissions: 0, comments: 0, upvotes: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      // Get submission count
      const { count: submissionCount } = await supabase
        .from("challenge_submissions")
        .select("*", { count: "exact", head: true });

      // Get comment count
      const { count: commentCount } = await supabase
        .from("submission_comments")
        .select("*", { count: "exact", head: true });

      // Get upvote count
      const { count: upvoteCount } = await supabase
        .from("submission_upvotes")
        .select("*", { count: "exact", head: true });

      setStats({
        submissions: submissionCount || 0,
        comments: commentCount || 0,
        upvotes: upvoteCount || 0,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20 pb-16">
        <section className="py-16 gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-primary-foreground" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-foreground">
              Community <span className="gradient-text">Gallery</span>
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
              Explore solutions from fellow developers, get inspired, and share your work
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <Card className="text-center">
              <CardHeader className="pb-2">
                <div className="mx-auto w-10 h-10 rounded-full gradient-hero flex items-center justify-center mb-2">
                  <Code2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">{stats.submissions}</CardTitle>
                <CardDescription>Solutions</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-2">
                <div className="mx-auto w-10 h-10 rounded-full gradient-hero flex items-center justify-center mb-2">
                  <Heart className="w-5 h-5 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">{stats.upvotes}</CardTitle>
                <CardDescription>Upvotes</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-2">
                <div className="mx-auto w-10 h-10 rounded-full gradient-hero flex items-center justify-center mb-2">
                  <MessageSquare className="w-5 h-5 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">{stats.comments}</CardTitle>
                <CardDescription>Feedback</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-2">
                <div className="mx-auto w-10 h-10 rounded-full gradient-accent flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-accent-foreground" />
                </div>
                <CardTitle className="text-2xl">{submissions.length}+</CardTitle>
                <CardDescription>Contributors</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    Recent Submissions
                  </CardTitle>
                  <CardDescription>
                    Latest solutions from the community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submissionsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : submissions.length > 0 ? (
                    <div className="space-y-4">
                      {submissions.slice(0, 10).map((submission) => (
                        <SubmissionCard
                          key={submission.id}
                          submission={submission}
                          showChallenge
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No submissions yet. Be the first to share your work!
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Leaderboard />

              <Card className="bg-[#5865F2]/10 border-[#5865F2]/30">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-[#5865F2] flex items-center justify-center mb-2">
                    <svg 
                      className="w-7 h-7 text-white" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                    >
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </div>
                  <CardTitle>Join Our Discord</CardTitle>
                  <CardDescription>
                    Connect with fellow developers, get help, and share your progress
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    size="lg" 
                    className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
                    asChild
                  >
                    <a href="https://discord.gg/Gn45PTm4qS" target="_blank" rel="noopener noreferrer">
                      Join Discord Community
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Share Your Work</CardTitle>
                  <CardDescription>
                    Complete a challenge and submit your solution for feedback
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button size="lg" variant="hero" asChild>
                    <a href="/challenges">Browse Challenges</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Community;
