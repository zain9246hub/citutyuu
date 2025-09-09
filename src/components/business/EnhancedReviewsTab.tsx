import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { VerifiedIcon, MessageSquare, ThumbsUp } from "lucide-react";
import StarRating from "@/components/ui/star-rating";
import { Review } from "@/data/businessData";

interface EnhancedReviewsTabProps {
  reviews: Review[];
  overallRating: number;
  totalReviews: number;
}

const EnhancedReviewsTab = ({ reviews, overallRating, totalReviews }: EnhancedReviewsTabProps) => {
  const getRatingBreakdown = () => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      breakdown[review.rating as keyof typeof breakdown]++;
    });
    return breakdown;
  };

  const ratingBreakdown = getRatingBreakdown();

  return (
    <div className="py-4 space-y-6">
      {/* Overall Rating Summary */}
      <Card className="bg-muted/30">
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
                <span className="w-8 text-right">{star}</span>
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

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="hover:shadow-sm transition-shadow">
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
                        <Badge variant="outline" className="text-xs gap-1">
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
                  
                  <div className="flex items-center gap-4 pt-2">
                    <Button variant="ghost" size="sm" className="text-xs gap-1 h-7">
                      <ThumbsUp className="h-3 w-3" />
                      Helpful
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs gap-1 h-7">
                      <MessageSquare className="h-3 w-3" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-8">
          <div className="text-muted-foreground text-sm mb-4">
            No reviews yet. Be the first to share your experience!
          </div>
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Write a Review
          </Button>
        </div>
      )}

      {/* Add Review Button */}
      {reviews.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button className="w-full sm:w-auto">
            <MessageSquare className="h-4 w-4 mr-2" />
            Write a Review
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnhancedReviewsTab;