import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Github, ExternalLink, MessageSquare, Loader2, ChevronDown, ChevronUp, Heart } from "lucide-react";
import { Submission, useSubmissionComments } from "@/hooks/useSubmissions";
import { getChallengeById } from "@/data/challenges";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useUpvotes } from "@/hooks/useUpvotes";
import { SocialShare } from "@/components/SocialShare";
import { Link } from "react-router-dom";

interface SubmissionCardProps {
  submission: Submission;
  showChallenge?: boolean;
}

export const SubmissionCard = ({ submission, showChallenge = false }: SubmissionCardProps) => {
  const { user } = useAuth();
  const { comments, loading: commentsLoading, addComment } = useSubmissionComments(submission.id);
  const { upvoteCount, hasUpvoted, toggleUpvote, loading: upvoteLoading } = useUpvotes(submission.id);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const challenge = getChallengeById(submission.challenge_id);
  const displayName = submission.profile?.full_name || submission.profile?.username || "Anonymous";
  const initials = displayName.split(" ").map((n) => n[0]).join("").toUpperCase();

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setSubmittingComment(true);
    await addComment(newComment);
    setNewComment("");
    setSubmittingComment(false);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to={`/profile/${submission.user_id}`}>
                <Avatar className="hover:ring-2 ring-primary transition-all">
                  <AvatarImage src={submission.profile?.avatar_url || ""} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link to={`/profile/${submission.user_id}`} className="font-semibold hover:text-primary transition-colors">
                  {displayName}
                </Link>
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
            {showChallenge && challenge && (
              <Link to={`/challenges/${challenge.id}`}>
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                  {challenge.title}
                </Badge>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">{submission.title}</h3>
            {submission.description && (
              <p className="text-muted-foreground">{submission.description}</p>
            )}
          </div>

          {submission.screenshots.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {submission.screenshots.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(url)}
                  className="aspect-video rounded-lg overflow-hidden border hover:ring-2 ring-primary transition-all"
                >
                  <img
                    src={url}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={hasUpvoted ? "default" : "outline"}
              size="sm"
              onClick={toggleUpvote}
              disabled={upvoteLoading}
              className={hasUpvoted ? "gradient-hero border-0" : ""}
            >
              <Heart className={`w-4 h-4 mr-1 ${hasUpvoted ? "fill-current" : ""}`} />
              {upvoteCount}
            </Button>
            {submission.github_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={submission.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-1" />
                  GitHub
                </a>
              </Button>
            )}
            {submission.live_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={submission.live_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Live Demo
                </a>
              </Button>
            )}
            <SocialShare
              title={`Check out "${submission.title}" on FigCode!`}
              description={submission.description || "A coding challenge solution"}
              url={`${window.location.origin}/challenges/${submission.challenge_id}`}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="ml-auto"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
              {showComments ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </Button>
          </div>

          {showComments && (
            <div className="border-t pt-4 space-y-4">
              {commentsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              ) : (
                <>
                  {comments.length > 0 && (
                    <div className="space-y-3">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={comment.profile?.avatar_url || ""} />
                            <AvatarFallback className="text-xs">
                              {(comment.profile?.full_name || comment.profile?.username || "A")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-muted rounded-lg p-3">
                              <div className="font-medium text-sm mb-1">
                                {comment.profile?.full_name || comment.profile?.username || "Anonymous"}
                              </div>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {user ? (
                    <div className="flex gap-2">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add feedback or encouragement..."
                        className="min-h-[60px]"
                      />
                      <Button
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || submittingComment}
                        size="sm"
                      >
                        {submittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      Sign in to leave feedback
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full size screenshot"
            className="max-w-full max-h-[90vh] rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
