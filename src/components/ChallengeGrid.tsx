import { ChallengeCard } from "@/components/ChallengeCard";
import { challenges, type DifficultyLevel } from "@/data/challenges";

interface ChallengeGridProps {
  selectedDifficulty: DifficultyLevel | "all";
  searchQuery?: string;
}

export const ChallengeGrid = ({ selectedDifficulty, searchQuery = "" }: ChallengeGridProps) => {
  const filteredChallenges = challenges.filter((challenge) => {
    const matchesDifficulty = selectedDifficulty === "all" || challenge.difficulty === selectedDifficulty;
    const matchesSearch = searchQuery === "" || 
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  return (
    <div>
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredChallenges.length}</span> challenges
        </p>
      </div>
      
      {filteredChallenges.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">
            No challenges found matching your filters.
          </p>
          <p className="text-muted-foreground mt-2">
            Try adjusting your selection to see more results.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      )}
    </div>
  );
};
