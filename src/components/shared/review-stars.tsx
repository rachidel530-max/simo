import React from "react";
import { Star, StarHalf } from "lucide-react";

interface ReviewStarsProps {
  rating: number;
  size?: number;
  className?: string;
}

export const ReviewStars: React.FC<ReviewStarsProps> = ({ rating, size = 16, className = "" }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          size={size}
          className="fill-[#D4AF37] text-[#D4AF37]"
        />
      ))}
      {hasHalfStar && (
        <StarHalf
          size={size}
          className="fill-[#D4AF37] text-[#D4AF37]"
        />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={size}
          className="text-neutral-700 fill-transparent"
        />
      ))}
    </div>
  );
};
