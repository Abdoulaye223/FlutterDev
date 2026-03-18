import zxcvbn from "zxcvbn";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
  onScoreChange?: (score: number) => void;
}

const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
const strengthColors = [
  "bg-destructive",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-emerald-500",
  "bg-green-600",
];

export const PasswordStrengthIndicator = ({
  password,
  onScoreChange,
}: PasswordStrengthIndicatorProps) => {
  const result = zxcvbn(password);
  const score = result.score;

  // Notify parent of score changes
  if (onScoreChange) {
    onScoreChange(score);
  }

  if (!password) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-300",
              index <= score ? strengthColors[score] : "bg-muted"
            )}
          />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <p
          className={cn(
            "text-xs font-medium",
            score <= 1
              ? "text-destructive"
              : score === 2
              ? "text-amber-600 dark:text-amber-500"
              : "text-emerald-600 dark:text-emerald-500"
          )}
        >
          {strengthLabels[score]}
        </p>
        {result.feedback.warning && (
          <p className="text-xs text-muted-foreground">
            {result.feedback.warning}
          </p>
        )}
      </div>
      {result.feedback.suggestions.length > 0 && score < 3 && (
        <ul className="text-xs text-muted-foreground space-y-0.5">
          {result.feedback.suggestions.slice(0, 2).map((suggestion, i) => (
            <li key={i}>• {suggestion}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const getPasswordStrength = (password: string) => {
  return zxcvbn(password);
};
