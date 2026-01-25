import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { VerifiedIcon, MessageSquare, ThumbsUp, Send, X, Store, ChevronDown, ChevronUp } from "lucide-react";
import StarRating from "@/components/ui/star-rating";
import { Review } from "@/data/businessData";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface ReviewReply {
  id: string;
  reviewId: string;
  businessName: string;
  reply: string;
  date: string;
}

interface EnhancedReviewsTabProps {
  reviews: Review[];
  overallRating: number;
  totalReviews: number;
  businessName?: string;
  isBusinessOwner?: boolean;
}

const EnhancedReviewsTab = ({ 
  reviews, 
  overallRating, 
  totalReviews, 
  businessName = "Business",
  isBusinessOwner = false 
}: EnhancedReviewsTabProps) => {
  const { currentUser } = useAuth();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<ReviewReply[]>(() => {
    try {
      const stored = localStorage.getItem('businessReviewReplies');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [helpfulReviews, setHelpfulReviews] = useState<string[]>([]);
  const [expandedReplies, setExpandedReplies] = useState<string[]>([]);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");

  const isOwner = isBusinessOwner || currentUser?.role === "business";

  const getRatingBreakdown = () => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      breakdown[review.rating as keyof typeof breakdown]++;
    });
    return breakdown;
  };

  const ratingBreakdown = getRatingBreakdown();

  const handleReply = (reviewId: string) => {
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

  const getReplyForReview = (reviewId: string) => {
    return replies.find(r => r.reviewId === reviewId);
  };

  const handleHelpful = (reviewId: string) => {
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

  const toggleReplyVisibility = (reviewId: string) => {
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
    <div className="py-4 space-y-6">
      {/* Overall Rating Summary */}
      <Card className="bg-muted/30 border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Customer Reviews</h2>
              <StarRating 
                rating={overallRating} 
                size="lg" 
                showNumber={true}
                showCount={true}
                reviewCount={totalReviews}
              />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground">{overallRating}</div>
              <div className="text-sm text-muted-foreground">out of 5</div>
            </div>
          </div>
          
          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-8 text-right text-foreground">{star}</span>
                <StarRating rating={1} maxStars={1} size="xs" showNumber={false} />
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${reviews.length > 0 ? (ratingBreakdown[star as keyof typeof ratingBreakdown] / reviews.length) * 100 : 0}%` 
                    }}
                  />
                </div>
                <span className="w-8 text-left text-muted-foreground">
                  {ratingBreakdown[star as keyof typeof ratingBreakdown]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Write Review Section */}
      {showWriteReview && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Write Your Review</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowWriteReview(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Your Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewReviewRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <StarRating 
                      rating={star <= newReviewRating ? 1 : 0} 
                      maxStars={1} 
                      size="lg" 
                      showNumber={false} 
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
          </CardContent>
        </Card>
      )}

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review, index) => {
          const existingReply = getReplyForReview(review.id);
          const isExpanded = expandedReplies.includes(review.id);

          return (
            <Card key={review.id} className="hover:shadow-sm transition-shadow border-border">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {review.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{review.name}</h4>
                        {review.verified && (
                          <Badge variant="outline" className="text-xs gap-1 border-border">
                            <VerifiedIcon className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    
                    <StarRating 
                      rating={review.rating} 
                      size="sm" 
                      showNumber={false}
                    />
                    
                    <p className="text-sm text-foreground leading-relaxed">
                      {review.comment}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`text-xs gap-1 h-7 ${helpfulReviews.includes(review.id) ? 'text-primary' : ''}`}
                        onClick={() => handleHelpful(review.id)}
                      >
                        <ThumbsUp className={`h-3 w-3 ${helpfulReviews.includes(review.id) ? 'fill-current' : ''}`} />
                        Helpful
                      </Button>
                      
                      {isOwner && !existingReply && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs gap-1 h-7"
                          onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                        >
                          <MessageSquare className="h-3 w-3" />
                          Reply as Business
                        </Button>
                      )}

                      {existingReply && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs gap-1 h-7"
                          onClick={() => toggleReplyVisibility(review.id)}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-3 w-3" />
                              Hide Reply
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3" />
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
                        <div className="flex items-center gap-2 mb-2">
                          <Store className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold text-foreground">{existingReply.businessName}</span>
                          <Badge variant="secondary" className="text-xs">Business Owner</Badge>
                          <span className="text-xs text-muted-foreground ml-auto">{existingReply.date}</span>
                        </div>
                        <p className="text-sm text-foreground">{existingReply.reply}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-8">
          <div className="text-muted-foreground text-sm mb-4">
            No reviews yet. Be the first to share your experience!
          </div>
          <Button variant="outline" onClick={() => setShowWriteReview(true)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Write a Review
          </Button>
        </div>
      )}

      {/* Add Review Button */}
      {reviews.length > 0 && !showWriteReview && (
        <div className="flex justify-center pt-4">
          <Button className="w-full sm:w-auto" onClick={() => setShowWriteReview(true)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Write a Review
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnhancedReviewsTab;
