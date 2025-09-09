
import React from "react";
import { Star, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsTabProps {
  reviews: Review[];
}

const ReviewsTab = ({ reviews }: ReviewsTabProps) => {
  return (
    <div className="py-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Reviews</h2>
        <Button variant="outline" size="sm">
          Write a Review
        </Button>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="flex items-center">
          <div className="text-3xl font-bold mr-3">4.7</div>
          <div className="flex flex-col">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-4 w-4 ${star <= 4.7 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">Based on {reviews.length} reviews</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="pb-4">
            <div className="flex justify-between items-start">
              <div className="font-medium">{review.name}</div>
              <span className="text-xs text-gray-500">{review.date}</span>
            </div>
            
            <div className="flex my-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-3 w-3 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                />
              ))}
            </div>
            
            <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
            
            <div className="mt-3 flex items-center">
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-gray-600">
                <ThumbsUp className="h-3 w-3 mr-1" />
                Helpful
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-gray-600">
                Reply
              </Button>
            </div>
            
            {review.id !== reviews[reviews.length - 1].id && <Separator className="mt-4" />}
          </div>
        ))}
      </div>
      
      <Button variant="outline" className="w-full mt-4">
        View All Reviews
      </Button>
    </div>
  );
};

export default ReviewsTab;
