"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/cn"; // We will create this standard utility in a second

interface GoldButtonProps extends HTMLMotionProps<"button"> {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const GoldButton: React.FC<GoldButtonProps> = ({
  variant = "solid",
  size = "md",
  children,
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variantClasses = {
    solid: "bg-gradient-to-r from-[#996515] via-[#D4AF37] to-[#F3E5AB] text-black border-transparent font-heading font-black tracking-wider hover:brightness-110 shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]",
    outline: "bg-transparent text-[#D4AF37] border border-[#D4AF37]/50 font-heading font-bold tracking-wider hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]",
    ghost: "bg-transparent text-white hover:bg-white/5 border-transparent font-sans hover:text-[#D4AF37]",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative overflow-hidden rounded-md transition-all duration-300 uppercase cursor-pointer border select-none focus:outline-none flex items-center justify-center gap-2",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {/* Sliding Shine Effect for Solid Button */}
      {variant === "solid" && (
        <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:animate-[shine_1.5s_ease-in-out_infinite]" 
              style={{
                animation: "shine 2s infinite ease-in-out",
                background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)",
                transform: "skewX(-25deg) translateX(-100%)",
              }}
        />
      )}
      {children}
    </motion.button>
  );
};
