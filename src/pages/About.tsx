import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Code2, Users, Trophy, Heart } from "lucide-react";

const values = [
  {
    icon: Code2,
    title: "Learn by Doing",
    description: "We believe the best way to learn is through hands-on practice with real-world projects.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Our community of Flutter developers supports each other through code reviews and feedback.",
  },
  {
    icon: Trophy,
    title: "Excellence",
    description: "We strive for excellence in every challenge, pushing developers to reach their potential.",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "We're passionate about Flutter development and helping others succeed in their careers.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-5" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-5xl lg:text-6xl mb-6">
                About <span className="gradient-text">FlutterDev</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                We're on a mission to help developers master Flutter app development 
                through practical, hands-on challenges that build real-world skills.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto mb-16">
              <Card className="gradient-card border-border p-8">
                <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  FlutterDev was founded by a team of Flutter developers who experienced firsthand 
                  the gap between tutorial-based learning and real-world development skills. We 
                  created a platform that bridges this gap through professionally designed 
                  challenges that simulate actual project work.
                </p>
                <p className="text-muted-foreground">
                  Today, thousands of developers use FlutterDev to improve their Flutter skills. 
                  Our community-driven approach ensures that every developer gets the feedback 
                  and support they need to succeed.
                </p>
              </Card>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <Card key={index} className="gradient-card border-border p-6 text-center">
                  <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
