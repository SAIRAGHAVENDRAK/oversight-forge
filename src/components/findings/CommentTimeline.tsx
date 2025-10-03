import { useState } from "react";
import { Comment } from "@/types/audit";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { toast } from "sonner";

interface CommentTimelineProps {
  comments: Comment[];
  onAddComment?: (text: string) => void;
}

export function CommentTimeline({ comments, onAddComment }: CommentTimelineProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (onAddComment) {
        onAddComment(newComment);
      }
      
      toast.success("Comment added successfully");
      setNewComment("");
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Add Comment */}
      <Card className="p-4">
        <Textarea
          placeholder="Add a comment... Use @ to mention someone"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px] mb-3"
        />
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit} 
            disabled={!newComment.trim() || isSubmitting}
            size="sm"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </Card>

      {/* Comments Timeline */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.author.avatar} />
                  <AvatarFallback>
                    {getInitials(comment.author.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{comment.author.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {comment.author.role}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
