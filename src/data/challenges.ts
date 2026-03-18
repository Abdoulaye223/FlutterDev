import weatherAppImage from "@/assets/challenges/weather-app.png";
import recipeFinderImage from "@/assets/challenges/recipe-finder.png";
import todoListImage from "@/assets/challenges/todo-list.jpg";
import simpleCalculatorImage from "@/assets/challenges/simple-calculator.jpg";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced" | "expert" | "master";
export type TechStack = "all" | "flutter";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  tech: TechStack[];
  image: string;
  isPremium: boolean;
  completions: number;
  timeEstimate: string;
  skills: string[];
  learningOutcomes: string[];
  requirements: string[];
}

export const challenges: Challenge[] = [
  {
    id: "1",
    title: "Weather App Interface",
    description: "Build a beautiful weather app with animations and real-time data display. Learn to work with weather APIs and create stunning visualizations.",
    difficulty: "beginner",
    tech: ["flutter"],
    image: weatherAppImage,
    isPremium: false,
    completions: 1243,
    timeEstimate: "8-10 hours",
    skills: ["API Integration", "Animations", "State Management", "UI Design"],
    learningOutcomes: [
      "Integrate with weather APIs and handle async data",
      "Create smooth animations for weather conditions",
      "Build responsive layouts for different screen sizes",
      "Implement location-based services",
      "Handle loading and error states gracefully"
    ],
    requirements: [
      "Current weather display with temperature and conditions",
      "5-day forecast view with daily summaries",
      "Location search functionality",
      "Weather condition animations (rain, sun, clouds)",
      "Settings for temperature units (Celsius/Fahrenheit)"
    ]
  },
  {
    id: "2",
    title: "Recipe Finder App",
    description: "Search and save recipes with ingredient lists, cooking timers, and meal planning features.",
    difficulty: "beginner",
    tech: ["flutter"],
    image: recipeFinderImage,
    isPremium: false,
    completions: 1567,
    timeEstimate: "10-12 hours",
    skills: ["Search Implementation", "Local Storage", "Timer Features", "Lists"],
    learningOutcomes: [
      "Implement search with filters and sorting",
      "Use local storage for saved recipes",
      "Build countdown timers and notifications",
      "Create beautiful food photography layouts",
      "Handle offline functionality"
    ],
    requirements: [
      "Recipe search with category filters",
      "Recipe detail view with ingredients and steps",
      "Save favorite recipes locally",
      "Cooking timer with notifications",
      "Shopping list generation from recipes"
    ]
  },
  {
    id: "3",
    title: "Todo List with Reminders",
    description: "Create a task management app with categories, priorities, and notification reminders.",
    difficulty: "beginner",
    tech: ["flutter"],
    image: todoListImage,
    isPremium: false,
    completions: 2134,
    timeEstimate: "6-8 hours",
    skills: ["CRUD Operations", "Local Storage", "Notifications", "UI Components"],
    learningOutcomes: [
      "Build CRUD functionality for tasks",
      "Implement local data persistence",
      "Schedule local notifications",
      "Create intuitive task organization UI",
      "Handle task priorities and categories"
    ],
    requirements: [
      "Add, edit, and delete tasks",
      "Mark tasks as complete",
      "Set due dates and reminders",
      "Organize tasks by category",
      "Priority levels (high, medium, low)"
    ]
  },
  {
    id: "5",
    title: "Simple Calculator",
    description: "Build a functional calculator with basic operations and a clean, modern interface.",
    difficulty: "beginner",
    tech: ["flutter"],
    image: simpleCalculatorImage,
    isPremium: false,
    completions: 2567,
    timeEstimate: "5-7 hours",
    skills: ["State Management", "Event Handling", "UI Layout", "Logic"],
    learningOutcomes: [
      "Handle user input and events",
      "Manage application state",
      "Implement calculation logic",
      "Build grid-based layouts",
      "Create responsive button components"
    ],
    requirements: [
      "Basic operations (add, subtract, multiply, divide)",
      "Clear and delete functionality",
      "Decimal number support",
      "Display current and previous values",
      "Keyboard-style button layout"
    ]
  },
];

export const getChallengeById = (id: string): Challenge | undefined => {
  return challenges.find(challenge => challenge.id === id);
};

export const difficultyLabels: Record<DifficultyLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
  master: "Master"
};
