import React from "react";
import { cn } from "@/utils/cn";

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded bg-neutral-900 border border-neutral-800/30",
        className
      )}
      {...props}
    />
  );
};
