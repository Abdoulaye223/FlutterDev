import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Heart, Code2, Medal, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardUser {
  user_id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  score: number;
}

type LeaderboardType = "submissions" | "upvotes" | "completed";

export const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<LeaderboardType>("submissions");
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        let userScores: Map<string, number> = new Map();

        if (activeTab === "submissions") {
          const { data } = await supabase.from("challenge_submissions").select("user_id");
          if (data) {
            data.forEach((s) => {
              userScores.set(s.user_id, (userScores.get(s.user_id) || 0) + 1);
            });
          }
        } else if (activeTab === "upvotes") {
          // Get all submissions with their upvotes
          const { data: submissions } = await supabase.from("challenge_submissions").select("id, user_id");
          if (submissions && submissions.length > 0) {
            const submissionIds = submissions.map((s) => s.id);
            const { data: upvotes } = await supabase
              .from("submission_upvotes")
              .select("submission_id")
              .in("submission_id", submissionIds);

            if (upvotes) {
              const submissionOwners = new Map(submissions.map((s) => [s.id, s.user_id]));
              upvotes.forEach((u) => {
                const ownerId = submissionOwners.get(u.submission_id);
                if (ownerId) {
                  userScores.set(ownerId, (userScores.get(ownerId) || 0) + 1);
                }
              });
            }
          }
        } else if (activeTab === "completed") {
          const { data } = await supabase
            .from("user_challenges")
            .select("user_id")
            .eq("status", "completed");
          if (data) {
            data.forEach((c) => {
              userScores.set(c.user_id, (userScores.get(c.user_id) || 0) + 1);
            });
          }
        }

        // Sort and get top 10
        const sortedUsers = [...userScores.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10);

        if (sortedUsers.length === 0) {
          setLeaders([]);
          setLoading(false);
          return;
        }

        // Fetch public profiles using the secure function
        const userIds = sortedUsers.map(([id]) => id);
        const { data: profiles } = await supabase
          .rpc("get_public_profiles", { profile_user_ids: userIds });

        const profileMap = new Map(profiles?.map((p: any) => [p.user_id, p]) || []);

        const leaderboardData = sortedUsers.map(([userId, score]) => ({
          user_id: userId,
          score,
          ...(profileMap.get(userId) || { username: null, full_name: null, avatar_url: null }),
        }));

        setLeaders(leaderboardData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [activeTab]);

  const getRankBadge = (index: number) => {
    if (index === 0) return <Medal className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-700" />;
    return <span className="font-bold text-muted-foreground">#{index + 1}</span>;
  };

  const getScoreLabel = () => {
    switch (activeTab) {
      case "submissions":
        return "solutions";
      case "upvotes":
        return "upvotes";
      case "completed":
        return "challenges";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Leaderboard
        </CardTitle>
        <CardDescription>Top contributors in the community</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LeaderboardType)}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="submissions" className="text-xs sm:text-sm">
              <Code2 className="w-4 h-4 mr-1 hidden sm:inline" />
              Submissions
            </TabsTrigger>
            <TabsTrigger value="upvotes" className="text-xs sm:text-sm">
              <Heart className="w-4 h-4 mr-1 hidden sm:inline" />
              Most Liked
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm">
              <Trophy className="w-4 h-4 mr-1 hidden sm:inline" />
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : leaders.length > 0 ? (
              <div className="space-y-2">
                {leaders.map((user, index) => (
                  <Link
                    key={user.user_id}
                    to={`/profile/${user.user_id}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="w-8 flex justify-center">{getRankBadge(index)}</div>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar_url || ""} />
                      <AvatarFallback className="text-xs">
                        {(user.full_name || user.username || "A")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {user.full_name || user.username || "Anonymous"}
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {user.score} {getScoreLabel()}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No data yet. Be the first!
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
