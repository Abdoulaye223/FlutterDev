import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Code2, Smartphone, Users, Trophy, Lock, CheckCircle, Play, Loader2, Download, Upload } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getChallengeById, difficultyLabels, Challenge } from "@/data/challenges";
import { useChallengeProgress } from "@/hooks/useChallengeProgress";
import { useSubmissions } from "@/hooks/useSubmissions";
import { usePremium } from "@/hooks/usePremium";
import { useAuth } from "@/hooks/useAuth";
import { useChallengeParticipants } from "@/hooks/useChallengeParticipants";
import { useSingleChallengeCompletions } from "@/hooks/useChallengeCompletions";
import { toast } from "sonner";
import JSZip from "jszip";
import { useState, useRef } from "react";
import { SubmissionForm } from "@/components/SubmissionForm";
import { SubmissionCard } from "@/components/SubmissionCard";

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const { progress, loading, startChallenge, updateStatus } = useChallengeProgress(id);
  const { submissions, loading: submissionsLoading, refetch: refetchSubmissions } = useSubmissions(id);
  const { count: participantCount } = useChallengeParticipants(id);
  const { count: completionCount } = useSingleChallengeCompletions(id);
  
  // Check if current user has submitted for this challenge
  const userHasSubmitted = user ? submissions.some(s => s.user_id === user.id) : false;
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const submissionFormRef = useRef<HTMLDivElement>(null);
  
  const scrollToSubmissionForm = () => {
    setActiveTab("submissions");
    setTimeout(() => {
      submissionFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };
  
  const challenge = getChallengeById(id || "");

  const generateStarterKit = async (challenge: Challenge) => {
    const zip = new JSZip();
    
    // README.md with design specs
    const readme = `# ${challenge.title} - Starter Kit

## Overview
${challenge.description}

## Time Estimate
${challenge.timeEstimate}

## Difficulty
${difficultyLabels[challenge.difficulty]}

## Design Specifications

### Typography
- **Heading Font**: SF Pro Display / Roboto (System)
- **Body Font**: SF Pro Text / Roboto (System)
- **Heading Sizes**: 
  - H1: 32px (Bold)
  - H2: 24px (Semibold)
  - H3: 20px (Medium)
  - Body: 16px (Regular)
  - Caption: 14px (Regular)

### Color Palette
- **Primary**: #6366F1 (Indigo)
- **Secondary**: #8B5CF6 (Violet)
- **Background**: #FFFFFF (Light) / #0F172A (Dark)
- **Text Primary**: #1E293B (Light) / #F8FAFC (Dark)
- **Text Secondary**: #64748B
- **Success**: #22C55E
- **Warning**: #F59E0B
- **Error**: #EF4444

### Spacing
- Base unit: 4px
- Component padding: 16px
- Section gaps: 24px
- Screen margins: 16px (mobile) / 24px (tablet)

## Skills You'll Practice
${challenge.skills.map(s => `- ${s}`).join('\n')}

## Learning Outcomes
${challenge.learningOutcomes.map((o, i) => `${i + 1}. ${o}`).join('\n')}

## Requirements
${challenge.requirements.map((r, i) => `${i + 1}. ${r}`).join('\n')}

## Screenshots
Check the screenshots folder for reference images of the challenge design.

## Getting Started
1. Extract this starter kit
2. Review the screenshots in the screenshots folder
3. Read the design specifications above
4. Set up your development environment
5. Start building!

Good luck! 🚀
`;

    zip.file("README.md", readme);

    // Always use Flutter starter
    const techStack = "flutter";
    
    const starterCode = `// main.dart - Flutter Starter
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '${challenge.title}',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF6366F1)),
        useMaterial3: true,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                '${challenge.title}',
                style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                "Let's build something amazing!",
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`;
      zip.file("lib/main.dart", starterCode);

    zip.file("pubspec.yaml", `name: ${challenge.title.toLowerCase().replace(/\s+/g, '_')}
description: ${challenge.description}
version: 1.0.0

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0
`);

    // Screenshots folder - fetch and include actual challenge image
    const screenshotsFolder = zip.folder("screenshots");
    
    // Fetch the challenge image and add it to the zip
    try {
      const imageResponse = await fetch(challenge.image);
      if (imageResponse.ok) {
        const imageBlob = await imageResponse.blob();
        const imageExtension = challenge.image.split('.').pop()?.split('?')[0] || 'jpg';
        screenshotsFolder?.file(`challenge-design.${imageExtension}`, imageBlob);
      }
    } catch (error) {
      console.error("Failed to fetch challenge image:", error);
    }
    
    // Add a README with additional info
    screenshotsFolder?.file("README.txt", `Challenge Screenshots
====================

This folder contains the reference design for your challenge.

Files included:
- challenge-design.jpg - Main challenge reference image

Tips:
- Study the design carefully before coding
- Pay attention to spacing, colors, and typography
- Try to match the design as closely as possible
- Don't forget about different states (loading, empty, error)
`);

    return zip;
  };
  const handleDownloadStarterKit = async () => {
    if (!challenge) return;
    
    if (!user) {
      toast.error("Please sign in to download starter kits");
      navigate("/signin");
      return;
    }

    setDownloading(true);
    try {
      const zip = await generateStarterKit(challenge);
      const content = await zip.generateAsync({ type: "blob" });
      
      // Create download link
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${challenge.title.toLowerCase().replace(/\s+/g, '-')}-starter-kit.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Starter kit downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download starter kit");
    } finally {
      setDownloading(false);
    }
  };

  if (!challenge) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 text-center py-20">
            <h1 className="text-4xl font-bold mb-4">Challenge Not Found</h1>
            <p className="text-muted-foreground mb-6">The challenge you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/challenges")}>Browse Challenges</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleStartChallenge = async () => {
    if (!user) {
      toast.error("Please sign in to start challenges");
      navigate("/signin");
      return;
    }

    if (challenge.isPremium && !isPremium) {
      toast.error("Upgrade to Premium to access this challenge");
      navigate("/pricing");
      return;
    }

    await startChallenge(id!);
    await handleDownloadStarterKit();
  };

  const handleMarkComplete = async () => {
    await updateStatus(id!, "completed");
  };

  const techLabels: Record<string, string> = {
    "flutter": "Flutter",
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/challenges">Challenges</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{challenge.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant={challenge.difficulty === "beginner" ? "secondary" : "default"}>
                    {difficultyLabels[challenge.difficulty]}
                  </Badge>
                  {challenge.isPremium && (
                    <Badge className="gradient-hero text-primary-foreground">
                      <Lock className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">{challenge.timeEstimate}</span>
                </div>
                <h1 className="text-4xl font-bold mb-4">{challenge.title}</h1>
                <p className="text-lg text-muted-foreground">{challenge.description}</p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="submissions" className="flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    Submissions ({submissions.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  {/* Submit Your Solution CTA */}
                  {progress && progress.status !== "completed" && (
                    <Card className="border-primary/50 bg-gradient-to-r from-primary/5 to-accent/5">
                      <CardContent className="flex items-center justify-between py-6">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">Ready to Submit Your Solution?</h3>
                          <p className="text-sm text-muted-foreground">
                            Share your work with the community and get feedback
                          </p>
                        </div>
                        <Button variant="hero" onClick={scrollToSubmissionForm}>
                          <Upload className="w-4 h-4 mr-2" />
                          Submit Your Solution
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-primary" />
                        Learning Outcomes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {challenge.learningOutcomes.map((outcome, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-primary" />
                        Skills You'll Practice
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {challenge.skills.map((skill, index) => (
                          <Badge key={index} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="requirements" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Requirements</CardTitle>
                      <CardDescription>
                        Complete all requirements to successfully finish this challenge
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {challenge.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <span className="font-semibold text-primary">{index + 1}.</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="resources" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Resources & Assets</CardTitle>
                      <CardDescription>
                        Starter code and helpful resources
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 rounded-lg border bg-gradient-to-r from-primary/5 to-transparent">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Download className="w-4 h-4 text-primary" />
                          Complete Starter Kit
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Includes starter code, screenshots & design specs
                        </p>
                        <Button 
                          variant="hero" 
                          className="w-full"
                          onClick={handleDownloadStarterKit}
                          disabled={downloading}
                        >
                          {downloading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Preparing Download...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Download Starter Kit (.zip)
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2">What's Included</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-primary" />
                            README with typography, colors & spacing
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-primary" />
                            Starter code template
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-primary" />
                            Screenshots folder
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="submissions" className="mt-6 space-y-6">
                  {progress?.status === "completed" || progress?.status === "in_progress" ? (
                    <div ref={submissionFormRef}>
                      <SubmissionForm
                        challengeId={id!}
                        challengeTitle={challenge.title}
                        onSuccess={refetchSubmissions}
                      />
                    </div>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>Submit Your Solution</CardTitle>
                        <CardDescription>
                          Start this challenge first to submit your solution
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button onClick={handleStartChallenge} variant="hero">
                          Start Challenge to Submit
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  <div>
                    <h3 className="font-semibold text-lg mb-4">
                      Community Solutions ({submissions.length})
                    </h3>
                    {submissionsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    ) : submissions.length > 0 ? (
                      <div className="space-y-4">
                        {submissions.map((submission) => (
                          <SubmissionCard key={submission.id} submission={submission} />
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                          No submissions yet. Be the first to share your solution!
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Start This Challenge</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-primary" />
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {challenge.tech.filter(t => t !== "all").map((tech, index) => (
                        <Badge key={index} variant="secondary">
                          {techLabels[tech] || tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{participantCount.toLocaleString()} participants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-primary" />
                      <span>{completionCount.toLocaleString()} completed</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    {loading ? (
                      <Button className="w-full" disabled>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </Button>
                    ) : progress ? (
                      <>
                        {progress.status === "completed" ? (
                          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                            <CheckCircle className="w-5 h-5 text-primary mx-auto mb-1" />
                            <span className="text-sm font-medium text-primary">Completed!</span>
                          </div>
                        ) : (
                          <>
                            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-center mb-2">
                              <Play className="w-5 h-5 text-accent mx-auto mb-1" />
                              <span className="text-sm font-medium">In Progress</span>
                            </div>
                            {userHasSubmitted ? (
                              <Button 
                                className="w-full" 
                                variant="hero"
                                onClick={handleMarkComplete}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as Complete
                              </Button>
                            ) : (
                              <Button 
                                className="w-full" 
                                variant="outline"
                                onClick={scrollToSubmissionForm}
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Submit First to Complete
                              </Button>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <Button 
                        className="w-full" 
                        variant="hero"
                        onClick={handleStartChallenge}
                      >
                        {challenge.isPremium && !isPremium && <Lock className="w-4 h-4 mr-2" />}
                        Start Challenge
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setActiveTab("submissions")}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      View Solutions ({submissions.length})
                    </Button>
                  </div>

                  <div className="pt-4 border-t text-sm text-muted-foreground">
                    <p className="mb-2">💡 <strong>Pro Tip:</strong> Start by analyzing the design specs before writing any code.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChallengeDetail;
