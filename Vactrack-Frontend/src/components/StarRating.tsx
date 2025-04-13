
import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function StarRating({ 
  value, 
  onChange, 
  max = 5, 
  className,
  size = "md"
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <div 
      className={cn("flex items-center space-x-1", className)}
      onMouseLeave={() => setHoverValue(null)}
    >
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = hoverValue !== null 
          ? starValue <= hoverValue
          : starValue <= value;

        return (
          <Star
            key={index}
            className={cn(
              sizeMap[size], 
              "cursor-pointer transition-all",
              isFilled 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300 hover:text-yellow-200"
            )}
            onMouseEnter={() => setHoverValue(starValue)}
            onClick={() => onChange(starValue)}
          />
        );
      })}
    </div>
  );
}
