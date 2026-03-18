import { Card } from "@/components/ui/card";
import { Sparkles, FileCode, Layers, Globe, Lock, Trophy } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Feedback",
    description: "Get intelligent insights on your code quality, best practices, and improvement areas.",
  },
  {
    icon: FileCode,
    title: "Figma Design Files",
    description: "Access professional design files to practice real design-to-code workflows.",
  },
  {
    icon: Layers,
    title: "Flutter Focused",
    description: "All challenges are designed specifically for Flutter, from widgets to full-stack apps.",
  },
  {
    icon: Globe,
    title: "Custom Domains",
    description: "Deploy your solutions on custom domains to showcase in your portfolio.",
  },
  {
    icon: Lock,
    title: "Private Solutions",
    description: "Keep your work private or share selectively to build your personal brand.",
  },
  {
    icon: Trophy,
    title: "Skill Progression",
    description: "Level up from basics to advanced full-stack Flutter applications.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl mb-4">Everything You Need to <span className="gradient-text">Excel</span></h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional tools and resources to accelerate your Flutter development journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="gradient-card border-border p-6 hover:border-primary/50 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
