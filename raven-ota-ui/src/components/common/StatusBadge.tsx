import React from "react";
import type { AssuranceState } from "../../types";
import { cn } from "../../utils/cn";

interface StatusBadgeProps {
  status: AssuranceState;
  className?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  className,
  showDot = true 
}) => {
  const getStyles = () => {
    switch (status) {
      case "NORMAL":
        return {
          bg: "bg-[#eef6f2]",
          border: "border-[#b7dec9]",
          text: "text-[#2d6a4f]",
          dot: "bg-[#2d6a4f]"
        };
      case "WARNING":
        return {
          bg: "bg-[#fdf7ed]",
          border: "border-[#f5d399]",
          text: "text-[#b45309]",
          dot: "bg-[#b45309]"
        };
      case "DEGRADED":
        return {
          bg: "bg-[#fdf3ed]",
          border: "border-[#f7c4a8]",
          text: "text-[#c2410c]",
          dot: "bg-[#c2410c]"
        };
      case "UNSAFE":
        return {
          bg: "bg-[#fdf2f2]",
          border: "border-[#f3b2b2]",
          text: "text-[#b91c1c]",
          dot: "bg-[#b91c1c]"
        };
      default:
        return {
          bg: "bg-surface-container",
          border: "border-outline-variant",
          text: "text-on-surface",
          dot: "bg-outline"
        };
    }
  };

  const styles = getStyles();

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1 px-[6px] py-[2px] rounded-[2px] border font-label-sm text-label-sm uppercase",
        styles.bg,
        styles.border,
        styles.text,
        className
      )}
    >
      {showDot && <span className={cn("w-[5px] h-[5px] rounded-full", styles.dot)} />}
      {status}
    </span>
  );
};
