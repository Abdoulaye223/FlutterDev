import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-flutter.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-10" />
      
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Code2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Learn Flutter by Doing</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl leading-tight">
              Master Flutter Through{" "}
              <span className="gradient-text">Real Projects</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl">
              Build your portfolio with 100+ professional design-to-code challenges. 
              Practice Flutter with real-world projects that get you hired.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" className="group" asChild>
                <Link to="/challenges">
                  Start Coding Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/challenges">View Challenges</Link>
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold">100+</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-muted-foreground">Developers</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <div className="text-3xl font-bold">5</div>
                <div className="text-sm text-muted-foreground">Skill Levels</div>
              </div>
            </div>
          </div>
          
          <div className="relative lg:block hidden">
            <div className="absolute inset-0 gradient-accent rounded-3xl blur-3xl opacity-20" />
            <img 
              src={heroImage} 
              alt="Flutter development coding environment" 
              className="relative rounded-3xl shadow-2xl border border-border/50"
            />
            <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-semibold">Real-World Skills</div>
                  <div className="text-sm text-muted-foreground">Job-ready portfolio</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
