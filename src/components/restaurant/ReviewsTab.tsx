
import React from "react";
import { Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <ScrollArea className="h-[calc(100vh-400px)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-3xl font-bold">4.8</div>
          <div className="flex text-yellow-400 mt-1">
            <Star className="h-4 w-4 fill-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400" />
          </div>
          <div className="text-sm text-gray-500 mt-1">Based on 127 reviews</div>
        </div>
        <Button className="bg-gray-800 hover:bg-gray-900">
          Write a Review
        </Button>
      </div>

      {/* Review List */}
      <div className="space-y-6 mt-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex justify-between">
              <div className="font-medium">{review.name}</div>
              <div className="text-xs text-gray-500">{review.date}</div>
            </div>
            <div className="flex text-yellow-400 mt-1">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400" />
              ))}
              {Array.from({ length: 5 - review.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 text-gray-300" />
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
            <div className="flex items-center mt-3">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                <Heart className="h-3 w-3 mr-1" />
                Helpful
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ReviewsTab;
