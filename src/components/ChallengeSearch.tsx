import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ChallengeSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ChallengeSearch = ({ searchQuery, onSearchChange }: ChallengeSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search challenges by name, skill, or technology..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 h-12 text-base"
      />
    </div>
  );
};
