import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, HelpCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Message sent! We'll get back to you soon.");
    setLoading(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-5" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-5xl lg:text-6xl mb-6">
                Get in <span className="gradient-text">Touch</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Have questions or feedback? We'd love to hear from you.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="space-y-6">
                <Card className="gradient-card border-border p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email Us</h3>
                      <p className="text-sm text-muted-foreground">support@mobiledev.com</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="gradient-card border-border p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Community</h3>
                      <p className="text-sm text-muted-foreground">Join our Discord server</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="gradient-card border-border p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">FAQ</h3>
                      <p className="text-sm text-muted-foreground">Check our pricing FAQ</p>
                    </div>
                  </div>
                </Card>
              </div>
              
              <Card className="lg:col-span-2 gradient-card border-border p-8">
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="you@example.com" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us more about your question or feedback..." 
                      rows={5}
                      required 
                    />
                  </div>
                  <Button type="submit" variant="hero" size="lg" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;