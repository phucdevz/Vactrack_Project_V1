
import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InfoSectionProps {
  title: string;
  subtitle?: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  features?: string[];
  ctaText?: string;
  ctaAction?: () => void;
  imagePosition?: "left" | "right";
}

const InfoSection = ({
  title,
  subtitle,
  description,
  imageSrc,
  imageAlt,
  features = [],
  ctaText,
  ctaAction = () => {},
  imagePosition = "right",
}: InfoSectionProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const isImageRight = imagePosition === "right";

  return (
    <div className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Image */}
          {!isImageRight && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2"
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="w-full h-auto object-cover"
                />
                {/* Blue glow effect */}
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl" />
              </div>
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            className="w-full md:w-1/2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {subtitle && (
              <motion.div variants={itemVariants}>
                <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-4">
                  {subtitle}
                </span>
              </motion.div>
            )}

            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              {title}
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-gray-600 mb-6 leading-relaxed"
            >
              {description}
            </motion.p>

            {features.length > 0 && (
              <motion.ul variants={itemVariants} className="space-y-3 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                      <Check className="h-4 w-4 text-brand-600" />
                    </div>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </motion.ul>
            )}

            {ctaText && (
              <motion.div variants={itemVariants}>
                <Button
                  onClick={ctaAction}
                  className="bg-brand-500 hover:bg-brand-600 text-white px-6"
                >
                  {ctaText}
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Image (if position is right) */}
          {isImageRight && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2"
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="w-full h-auto object-cover"
                />
                {/* Blue glow effect */}
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl" />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
