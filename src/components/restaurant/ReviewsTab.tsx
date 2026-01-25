import React, { useState } from "react";
import { Star, Heart, MessageSquare, Send, X, Store, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  restaurantName?: string;
  isOwner?: boolean;
}

const ReviewsTab = ({ reviews, restaurantName = "Restaurant", isOwner = false }: ReviewsTabProps) => {
  const { currentUser } = useAuth();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<ReviewReply[]>(() => {
    try {
      const stored = localStorage.getItem('restaurantReviewReplies');
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

  const isBusinessOwner = isOwner || currentUser?.role === "business";

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
      businessName: currentUser?.name || restaurantName,
      reply: replyText.trim(),
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const updatedReplies = [...replies, newReply];
    setReplies(updatedReplies);
    localStorage.setItem('restaurantReviewReplies', JSON.stringify(updatedReplies));
    
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
    <ScrollArea className="h-[calc(100vh-400px)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-3xl font-bold text-foreground">4.8</div>
          <div className="flex text-yellow-400 mt-1">
            <Star className="h-4 w-4 fill-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400" />
          </div>
          <div className="text-sm text-muted-foreground mt-1">Based on 127 reviews</div>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
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
            placeholder="Share your dining experience..."
            className="min-h-[100px] bg-background border-border"
          />

          <Button onClick={handleSubmitReview} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Submit Review
          </Button>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-6 mt-6">
        {reviews.map((review) => {
          const existingReply = getReplyForReview(review.id);
          const isExpanded = expandedReplies.includes(review.id);

          return (
            <div key={review.id} className="border-b border-border pb-4">
              <div className="flex justify-between">
                <div className="font-medium text-foreground">{review.name}</div>
                <div className="text-xs text-muted-foreground">{review.date}</div>
              </div>
              <div className="flex text-yellow-400 mt-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400" />
                ))}
                {Array.from({ length: 5 - review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-muted-foreground" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
              
              {/* Action Buttons */}
              <div className="flex items-center mt-3 gap-2 flex-wrap">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`h-8 px-2 text-xs ${helpfulReviews.includes(review.id) ? 'text-primary' : ''}`}
                  onClick={() => handleHelpful(review.id)}
                >
                  <Heart className={`h-3 w-3 mr-1 ${helpfulReviews.includes(review.id) ? 'fill-current' : ''}`} />
                  Helpful
                </Button>
                
                {isBusinessOwner && !existingReply && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-xs"
                    onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Reply as Owner
                  </Button>
                )}

                {existingReply && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-xs"
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
                        View Owner Reply
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
                    <span className="text-sm font-medium text-foreground">Reply as {restaurantName}</span>
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
                    <Badge variant="secondary" className="text-xs">Restaurant Owner</Badge>
                    <span className="text-xs text-muted-foreground ml-auto">{existingReply.date}</span>
                  </div>
                  <p className="text-sm text-foreground">{existingReply.reply}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ReviewsTab;
