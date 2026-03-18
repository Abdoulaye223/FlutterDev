import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { validateImageFile } from "@/lib/fileValidation";

interface SubmissionFormProps {
  challengeId: string;
  challengeTitle: string;
  onSuccess?: () => void;
}

export const SubmissionForm = ({ challengeId, challengeTitle, onSuccess }: SubmissionFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createSubmission } = useSubmissions(challengeId);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + screenshots.length > 5) {
      toast.error("Maximum 5 screenshots allowed");
      return;
    }

    // Validate each file with magic byte verification
    const validFiles: File[] = [];
    for (const file of files) {
      const validation = await validateImageFile(file, 5 * 1024 * 1024);
      if (!validation.valid) {
        toast.error(validation.error);
        continue;
      }
      validFiles.push(file);
    }

    setScreenshots((prev) => [...prev, ...validFiles]);
    
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to submit");
      navigate("/signin");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (screenshots.length === 0) {
      toast.error("Please add at least one screenshot");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createSubmission(
        challengeId,
        title,
        description,
        screenshots,
        githubUrl,
        liveUrl
      );

      if (result) {
        setTitle("");
        setDescription("");
        setGithubUrl("");
        setLiveUrl("");
        setScreenshots([]);
        setPreviews([]);
        onSuccess?.();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Submit Your Solution</CardTitle>
          <CardDescription>Sign in to share your completed challenge</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate("/signin")} variant="hero" className="w-full">
            Sign In to Submit
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Your Solution</CardTitle>
        <CardDescription>
          Share your {challengeTitle} implementation for community feedback
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My awesome implementation"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your approach, what you learned, or any questions you have..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Screenshots * (up to 5)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden border">
                  <img
                    src={preview}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeScreenshot(index)}
                    className="absolute top-1 right-1 p-1 bg-destructive rounded-full hover:bg-destructive/90 transition-colors"
                  >
                    <X className="w-3 h-3 text-destructive-foreground" />
                  </button>
                </div>
              ))}
              {previews.length < 5 && (
                <label className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <ImageIcon className="w-6 h-6 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">Add Image</span>
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="github">GitHub URL (optional)</Label>
              <Input
                id="github"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="live">Live Demo URL (optional)</Label>
              <Input
                id="live"
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <Button type="submit" variant="hero" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Submit for Feedback
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
