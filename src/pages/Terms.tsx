import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-5" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-5xl lg:text-6xl mb-6 text-center">
                Terms of <span className="gradient-text">Service</span>
              </h1>
              <p className="text-center text-muted-foreground mb-12">
                Last updated: January 2025
              </p>
              
              <Card className="gradient-card border-border p-8 space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground">
                    By accessing and using MobileDev, you accept and agree to be bound by the terms 
                    and provisions of this agreement. If you do not agree to these terms, please do 
                    not use our services.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4">2. Use of Service</h2>
                  <p className="text-muted-foreground mb-4">
                    MobileDev provides a platform for learning mobile development through challenges 
                    and community interaction. You agree to use the service only for lawful purposes 
                    and in accordance with these terms.
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>You must be at least 13 years old to use this service</li>
                    <li>You are responsible for maintaining the security of your account</li>
                    <li>You agree not to share copyrighted materials without permission</li>
                    <li>You agree not to harass or abuse other community members</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4">3. Intellectual Property</h2>
                  <p className="text-muted-foreground">
                    The challenges, designs, and educational content provided by MobileDev are 
                    protected by copyright. You may use these materials for personal learning 
                    purposes. Solutions you create remain your intellectual property.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4">4. Subscriptions and Payments</h2>
                  <p className="text-muted-foreground">
                    Premium subscriptions are billed according to the plan selected. You may cancel 
                    your subscription at any time. Refunds are available within 14 days of purchase.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4">5. Limitation of Liability</h2>
                  <p className="text-muted-foreground">
                    MobileDev is provided "as is" without warranties of any kind. We are not liable 
                    for any damages arising from your use of the service.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4">6. Contact</h2>
                  <p className="text-muted-foreground">
                    For questions about these terms, please contact us at legal@mobiledev.com.
                  </p>
                </section>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;