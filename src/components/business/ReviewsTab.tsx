import React, { useState } from "react";
import { Star, ThumbsUp, MessageSquare, Send, X, Store, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewReply {
  id: string;
  reviewId: number;
  businessName: string;
  reply: string;
  date: string;
}

interface ReviewsTabProps {
  reviews: Review[];
  businessName?: string;
  isBusinessOwner?: boolean;
}

const ReviewsTab = ({ reviews, businessName = "Business", isBusinessOwner = false }: ReviewsTabProps) => {
  const { currentUser } = useAuth();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<ReviewReply[]>(() => {
    try {
      const stored = localStorage.getItem('businessReviewReplies');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [helpfulReviews, setHelpfulReviews] = useState<number[]>([]);
  const [expandedReplies, setExpandedReplies] = useState<number[]>([]);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");

  const isOwner = isBusinessOwner || currentUser?.role === "business";

  const handleReply = (reviewId: number) => {
    if (!replyText.trim()) {
      toast({
        title: "Empty Reply",
        description: "Please write a reply before submitting",
        variant: "destructive"
      });
      return;
    }

    const newReply: ReviewReply = {
      id: `reply-${Date.now()}`,
      reviewId,
      businessName: currentUser?.name || businessName,
      reply: replyText.trim(),
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const updatedReplies = [...replies, newReply];
    setReplies(updatedReplies);
    localStorage.setItem('businessReviewReplies', JSON.stringify(updatedReplies));
    
    setReplyText("");
    setReplyingTo(null);
    setExpandedReplies(prev => [...prev, reviewId]);

    toast({
      title: "Reply Posted",
      description: "Your reply has been posted successfully"
    });
  };

  const getReplyForReview = (reviewId: number) => {
    return replies.find(r => r.reviewId === reviewId);
  };

  const handleHelpful = (reviewId: number) => {
    if (helpfulReviews.includes(reviewId)) {
      setHelpfulReviews(prev => prev.filter(id => id !== reviewId));
    } else {
      setHelpfulReviews(prev => [...prev, reviewId]);
      toast({
        title: "Marked as Helpful",
        description: "Thank you for your feedback!"
      });
    }
  };

  const toggleReplyVisibility = (reviewId: number) => {
    if (expandedReplies.includes(reviewId)) {
      setExpandedReplies(prev => prev.filter(id => id !== reviewId));
    } else {
      setExpandedReplies(prev => [...prev, reviewId]);
    }
  };

  const handleSubmitReview = () => {
    if (!newReviewText.trim()) {
      toast({
        title: "Empty Review",
        description: "Please write your review before submitting",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Review Submitted",
      description: "Thank you for your review! It will appear after moderation."
    });

    setNewReviewText("");
    setNewReviewRating(5);
    setShowWriteReview(false);
  };

  return (
    <div className="py-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">Reviews</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowWriteReview(!showWriteReview)}
        >
          {showWriteReview ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      {/* Write Review Form */}
      {showWriteReview && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Your Review</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowWriteReview(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNewReviewRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star 
                    className={`h-6 w-6 ${star <= newReviewRating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <Textarea
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
            placeholder="Share your experience..."
            className="min-h-[100px] bg-background border-border"
          />

          <Button onClick={handleSubmitReview} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Submit Review
          </Button>
        </div>
      )}

      <div className="bg-muted/50 rounded-lg p-3 mb-4">
        <div className="flex items-center">
          <div className="text-3xl font-bold mr-3 text-foreground">4.7</div>
          <div className="flex flex-col">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-4 w-4 ${star <= 4.7 ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} 
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Based on {reviews.length} reviews</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => {
          const existingReply = getReplyForReview(review.id);
          const isExpanded = expandedReplies.includes(review.id);

          return (
            <div key={review.id} className="pb-4">
              <div className="flex justify-between items-start">
                <div className="font-medium text-foreground">{review.name}</div>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
              
              <div className="flex my-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-3 w-3 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} 
                  />
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
              
              {/* Action Buttons */}
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`h-7 px-2 text-xs ${helpfulReviews.includes(review.id) ? 'text-primary' : 'text-muted-foreground'}`}
                  onClick={() => handleHelpful(review.id)}
                >
                  <ThumbsUp className={`h-3 w-3 mr-1 ${helpfulReviews.includes(review.id) ? 'fill-current' : ''}`} />
                  Helpful
                </Button>
                
                {isOwner && !existingReply && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-xs text-muted-foreground"
                    onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Reply as Business
                  </Button>
                )}

                {existingReply && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-xs text-muted-foreground"
                    onClick={() => toggleReplyVisibility(review.id)}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Hide Reply
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        View Business Reply
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Reply Input for Business */}
              {replyingTo === review.id && (
                <div className="mt-3 p-3 bg-muted/50 rounded-lg space-y-3 border border-border">
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Reply as {businessName}</span>
                  </div>
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your response to this review..."
                    className="min-h-[80px] text-sm bg-background border-border"
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleReply(review.id)}
                      className="gap-1"
                    >
                      <Send className="h-3 w-3" />
                      Post Reply
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Display Business Reply */}
              {existingReply && isExpanded && (
                <div className="mt-3 p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Store className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">{existingReply.businessName}</span>
                    <Badge variant="secondary" className="text-xs">Business Owner</Badge>
                    <span className="text-xs text-muted-foreground ml-auto">{existingReply.date}</span>
                  </div>
                  <p className="text-sm text-foreground">{existingReply.reply}</p>
                </div>
              )}
              
              {review.id !== reviews[reviews.length - 1].id && <Separator className="mt-4" />}
            </div>
          );
        })}
      </div>
      
      <Button variant="outline" className="w-full mt-4">
        View All Reviews
      </Button>
    </div>
  );
};

export default ReviewsTab;
