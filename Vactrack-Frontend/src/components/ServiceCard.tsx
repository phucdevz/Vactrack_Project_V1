
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  delay?: number;
  className?: string;
  id: string;
}

const ServiceCard = ({
  title,
  description,
  icon,
  color,
  delay = 0,
  className,
  id,
}: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={cn(
        "group bg-white border border-gray-100 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300",
        className
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
          color
        )}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-brand-500 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link 
        to={`/services/${id}`}
        className="flex items-center text-brand-500 font-medium text-sm"
      >
        <span>Tìm hiểu thêm</span>
        <ArrowRight className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" />
      </Link>
    </motion.div>
  );
};

export default ServiceCard;
