
import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  name: string;
  role?: string;
  avatar?: string;
  content: string;
  rating: number;
  delay?: number;
  className?: string;
}

const TestimonialCard = ({
  name,
  role,
  avatar,
  content,
  rating,
  delay = 0,
  className,
}: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={cn(
        "bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300",
        className
      )}
    >
      {/* Rating stars */}
      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-5 w-5",
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            )}
          />
        ))}
      </div>

      {/* Content */}
      <p className="text-gray-600 mb-6 italic">{content}</p>

      {/* Author */}
      <div className="flex items-center">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-semibold mr-3">
            {name.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900">{name}</p>
          {role && <p className="text-gray-500 text-sm">{role}</p>}
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
