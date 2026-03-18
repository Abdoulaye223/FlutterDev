import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-5" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-5xl lg:text-6xl mb-6 text-center">
                Privacy <span className="gradient-text">Policy</span>
              </h1>
              <p className="text-center text-muted-foreground mb-12">
                Last updated: January 2025
              </p>
              
              <Card className="gradient-card border-border p-8 space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                  <p className="text-muted-foreground mb-4">
                    We collect information you provide directly to us, including:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Account information (name, email, password)</li>
                    <li>Profile information (bio, social links, avatar)</li>
                    <li>Challenge submissions and code you share</li>
                    <li>Communications with our support team</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                  <p className="text-muted-foreground mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>Send you technical notices and support messages</li>
                    <li>Respond to your comments and questions</li>
                    <li>Analyze usage patterns to improve user experience</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
                  <p className="text-muted-foreground">
                    We do not sell, trade, or rent your personal information to third parties. 
                    We may share information with service providers who assist us in operating 
                    our platform, subject to confidentiality agreements.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                  <p className="text-muted-foreground">
                    We implement appropriate security measures to protect your personal information 
                    against unauthorized access, alteration, disclosure, or destruction. However, 
                    no method of transmission over the internet is 100% secure.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
                  <p className="text-muted-foreground mb-4">
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Access and receive a copy of your data</li>
                    <li>Request correction of inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Object to processing of your data</li>
                    <li>Withdraw consent at any time</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4">6. Cookies</h2>
                  <p className="text-muted-foreground">
                    We use cookies and similar technologies to collect information about your 
                    browsing activities and to distinguish you from other users. You can control 
                    cookies through your browser settings.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have questions about this privacy policy, please contact us at 
                    privacy@mobiledev.com.
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

export default Privacy;