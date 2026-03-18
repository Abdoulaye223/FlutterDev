import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Lock, ArrowRight, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Challenge, DifficultyLevel } from "@/data/challenges";
import { useChallengeParticipants } from "@/hooks/useChallengeParticipants";
import { useSingleChallengeCompletions } from "@/hooks/useChallengeCompletions";

interface ChallengeCardProps {
  challenge: Challenge;
}

const difficultyColors: Record<DifficultyLevel, string> = {
  beginner: "bg-accent/10 text-accent border-accent/20",
  intermediate: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  advanced: "bg-primary/10 text-primary border-primary/20",
  expert: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  master: "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

export const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  const navigate = useNavigate();
  const { count: participantCount } = useChallengeParticipants(challenge.id);
  const { count: completionCount } = useSingleChallengeCompletions(challenge.id);

  const handleClick = () => {
    navigate(`/challenges/${challenge.id}`);
  };

  return (
    <Card 
      className="gradient-card border-border overflow-hidden group hover:border-primary/50 transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={challenge.image}
          alt={challenge.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {challenge.isPremium && (
          <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Premium
          </div>
        )}
        
        <Badge
          className={`absolute top-4 left-4 ${difficultyColors[challenge.difficulty]} backdrop-blur-sm`}
        >
          {challenge.difficulty}
        </Badge>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {challenge.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {challenge.description}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-xs">
            <span>🎯</span>
            Flutter
          </span>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{participantCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-primary" />
              <span>{completionCount.toLocaleString()}</span>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="group/btn">
            Start Challenge
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
