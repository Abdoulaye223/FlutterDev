import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { DifficultyLevel } from "@/data/challenges";

const difficulties = [
  { id: "all", label: "All Levels", color: "text-foreground" },
  { id: "beginner", label: "Beginner", color: "text-accent" },
  { id: "intermediate", label: "Intermediate", color: "text-blue-400" },
  { id: "advanced", label: "Advanced", color: "text-primary" },
  { id: "expert", label: "Expert", color: "text-purple-400" },
  { id: "master", label: "Master", color: "text-pink-400" },
] as const;

interface ChallengeFiltersProps {
  selectedDifficulty: DifficultyLevel | "all";
  onDifficultyChange: (difficulty: DifficultyLevel | "all") => void;
}

export const ChallengeFilters = ({
  selectedDifficulty,
  onDifficultyChange,
}: ChallengeFiltersProps) => {
  return (
    <Card className="gradient-card border-border p-6">
      <h3 className="font-semibold mb-4">Difficulty Level</h3>
      <div className="flex flex-wrap gap-2">
        {difficulties.map((difficulty) => (
          <Button
            key={difficulty.id}
            variant={selectedDifficulty === difficulty.id ? "hero" : "outline"}
            size="sm"
            onClick={() => onDifficultyChange(difficulty.id as DifficultyLevel | "all")}
            className={selectedDifficulty === difficulty.id ? "" : difficulty.color}
          >
            {difficulty.label}
          </Button>
        ))}
      </div>
    </Card>
  );
};
