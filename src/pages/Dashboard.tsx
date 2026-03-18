import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Trophy, Target, PlayCircle, BookOpen, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { challenges, getChallengeById } from "@/data/challenges";

interface UserChallenge {
  id: string;
  challenge_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchUserChallenges = async () => {
      if (!user) return;
      
      setDataLoading(true);
      try {
        const { data, error } = await supabase
          .from("user_challenges")
          .select("*")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false });

        if (error) throw error;
        setUserChallenges(data || []);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      } finally {
        setDataLoading(false);
      }
    };

    if (user) {
      fetchUserChallenges();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Calculate real stats from user_challenges data
  const completedCount = userChallenges.filter(c => c.status === "completed").length;
  const inProgressCount = userChallenges.filter(c => c.status === "in_progress" || c.status === "started").length;
  const totalChallenges = challenges.length;
  const progressPercentage = totalChallenges > 0 ? Math.round((completedCount / totalChallenges) * 100) : 0;

  // Get recent challenges with their details
  const recentChallenges = userChallenges.slice(0, 5).map(uc => {
    const challengeDetails = getChallengeById(uc.challenge_id);
    return {
      id: uc.challenge_id,
      title: challengeDetails?.title || "Unknown Challenge",
      status: uc.status,
      difficulty: challengeDetails?.difficulty || "beginner",
    };
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, <span className="gradient-text">{user.user_metadata?.full_name || "Developer"}</span>!
            </h1>
            <p className="text-muted-foreground">
              Track your progress and continue your learning journey.
            </p>
          </div>

          {/* Continue Where You Left Off Section */}
          {!dataLoading && (() => {
            const inProgressChallenge = userChallenges.find(
              c => c.status === "in_progress" || c.status === "started"
            );
            if (!inProgressChallenge) return null;
            const challengeDetails = getChallengeById(inProgressChallenge.challenge_id);
            if (!challengeDetails) return null;
            
            return (
              <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PlayCircle className="w-5 h-5 text-primary animate-pulse" />
                      <CardTitle className="text-lg">Continue Where You Left Off</CardTitle>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {inProgressChallenge.status.replace("_", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <img 
                        src={challengeDetails.image} 
                        alt={challengeDetails.title}
                        className="w-20 h-20 rounded-lg object-cover hidden sm:block"
                      />
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{challengeDetails.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                          {challengeDetails.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {challengeDetails.difficulty}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {challengeDetails.timeEstimate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="hero" 
                      size="lg"
                      onClick={() => navigate(`/challenges/${inProgressChallenge.challenge_id}`)}
                      className="shrink-0"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Continue Challenge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })()}

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Trophy className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{completedCount}</div>
                    <p className="text-xs text-muted-foreground">challenges completed</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <PlayCircle className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{inProgressCount}</div>
                    <p className="text-xs text-muted-foreground">challenges in progress</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Progress</CardTitle>
                <Target className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{progressPercentage}%</div>
                    <Progress value={progressPercentage} className="mt-2" />
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Available</CardTitle>
                <BookOpen className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalChallenges}</div>
                <p className="text-xs text-muted-foreground">total challenges</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest challenge progress</CardDescription>
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : recentChallenges.length > 0 ? (
                  <div className="space-y-4">
                    {recentChallenges.map((challenge) => (
                      <div
                        key={challenge.id}
                        className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => navigate(`/challenges/${challenge.id}`)}
                      >
                        <div>
                          <p className="font-medium">{challenge.title}</p>
                          <Badge variant="outline" className="mt-1 capitalize">
                            {challenge.difficulty}
                          </Badge>
                        </div>
                        <Badge
                          variant={challenge.status === "completed" ? "default" : "secondary"}
                          className="capitalize"
                        >
                          {challenge.status.replace("_", " ").replace("-", " ")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No challenges started yet.</p>
                    <p className="text-sm mt-1">Start your first challenge to track progress!</p>
                  </div>
                )}
                <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/challenges")}>
                  View All Challenges
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Jump back into learning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="hero" onClick={() => navigate("/challenges")}>
                  Continue Learning
                </Button>
                <Button className="w-full" variant="outline" onClick={() => navigate("/community")}>
                  Join Community
                </Button>
                <Button className="w-full" variant="outline" onClick={() => navigate("/pricing")}>
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
