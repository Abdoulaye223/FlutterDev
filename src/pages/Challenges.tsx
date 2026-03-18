import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChallengeGrid } from "@/components/ChallengeGrid";
import { ChallengeFilters } from "@/components/ChallengeFilters";
import { ChallengeSearch } from "@/components/ChallengeSearch";
import { useState } from "react";
import type { DifficultyLevel } from "@/data/challenges";

export type { DifficultyLevel };

const Challenges = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-5" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mb-8">
              <h1 className="text-5xl lg:text-6xl mb-6">
                Browse <span className="gradient-text">Flutter Challenges</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Choose from 100+ professionally designed Flutter projects. 
                Filter by difficulty level to find your perfect challenge.
              </p>
              <ChallengeSearch 
                searchQuery={searchQuery} 
                onSearchChange={setSearchQuery} 
              />
            </div>
            
            <ChallengeFilters
              selectedDifficulty={selectedDifficulty}
              onDifficultyChange={setSelectedDifficulty}
            />
          </div>
        </section>
        
        <section className="pb-24">
          <div className="container mx-auto px-4">
            <ChallengeGrid
              selectedDifficulty={selectedDifficulty}
              searchQuery={searchQuery}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Challenges;
