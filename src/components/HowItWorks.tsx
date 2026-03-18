import { Card } from "@/components/ui/card";
import { FolderOpen, Code, Send, Users } from "lucide-react";

const steps = [
  {
    icon: FolderOpen,
    title: "Choose your challenge",
    description: "Pick from 100+ professionally designed Flutter projects across five skill levels—from widget basics to full-stack applications.",
  },
  {
    icon: Code,
    title: "Code the design",
    description: "Build responsive mobile apps using the provided designs as your guide. Practice with any tools, frameworks, or AI assistants you want to master.",
  },
  {
    icon: Send,
    title: "Submit and improve",
    description: "Get automated feedback, community code reviews, and compare your solution to the design. Refine your approach and level up with each project.",
  },
  {
    icon: Users,
    title: "Help others grow",
    description: "Review other developers' code to sharpen your skills and build connections in our supportive community.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl mb-4">How It <span className="gradient-text">Works</span></h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your path from learning to earning in four simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="gradient-card border-border p-6 relative overflow-hidden group hover:border-primary/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 gradient-hero opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity" />
              
              <div className="relative space-y-4">
                <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">Step {index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};