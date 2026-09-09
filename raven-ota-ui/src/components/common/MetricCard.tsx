import React from "react";
import { cn } from "../../utils/cn";

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  badgeLabel?: string;
  badgeVariant?: "primary" | "secondary" | "danger" | "neutral";
  progressValue?: number; // 0-100
  footerText?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  badgeLabel,
  badgeVariant = "neutral",
  progressValue,
  footerText,
  className
}) => {
  const getBadgeClass = () => {
    switch (badgeVariant) {
      case "primary": return "bg-primary text-on-primary";
      case "danger": return "bg-error text-on-error";
      case "secondary": return "bg-surface-container-highest text-on-surface";
      default: return "bg-surface-container-high text-on-surface";
    }
  };

  return (
    <div className={cn("p-space-md bg-surface rounded-DEFAULT flex flex-col justify-between gap-space-xs", className)}>
      <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">{label}</span>
      
      <div className="flex items-baseline justify-between">
        <span className="font-data-metric text-data-metric text-on-surface font-semibold">
          {value}
          {unit && <span className="font-label-md text-label-md text-secondary ml-1">{unit}</span>}
        </span>
        {badgeLabel && (
          <span className={cn("font-label-sm text-label-sm px-space-xs py-space-2xs rounded-DEFAULT", getBadgeClass())}>
            {badgeLabel}
          </span>
        )}
      </div>
      
      {progressValue !== undefined && (
        <div className="w-full bg-surface-container h-1 rounded-DEFAULT overflow-hidden">
          <div className="bg-primary h-full" style={{ width: `${progressValue}%` }}></div>
        </div>
      )}
      
      {footerText && (
        <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
          {footerText}
        </span>
      )}
    </div>
  );
};
