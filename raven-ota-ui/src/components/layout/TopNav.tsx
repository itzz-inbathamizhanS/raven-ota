import React, { useState, useEffect } from "react";

export const TopNav: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toISOString().split("T")[1].split(".")[0];
  };

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface/90 backdrop-blur-md z-30 flex items-center justify-between px-gutter-mobile lg:px-gutter-desktop shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-space-base">
        <span className="hidden md:inline font-label-sm text-label-sm uppercase tracking-wider text-secondary">
          AUTONOMOUS VERIFICATION SYSTEM
        </span>
        <span className="hidden md:inline text-outline-variant">/</span>
        <div className="flex items-center gap-space-xs font-code-md text-code-md text-on-surface">
          <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
          <span>UTC {formatTime(time)}</span>
          <span className="text-on-surface-variant text-label-sm px-space-xs py-space-2xs bg-surface-container rounded-DEFAULT">
            REALTIME 100Hz
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-space-md">
        <button 
          onClick={() => window.alert('Global search dialog would open here.')}
          className="flex items-center gap-space-xs px-space-md py-space-xs rounded-DEFAULT bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">search</span>
          <span className="font-label-sm text-label-sm">Search vehicle, VIN or campaign...</span>
          <kbd className="font-code-md text-code-md bg-surface px-space-xs py-space-2xs rounded-DEFAULT text-outline ml-space-xs">
            ⌘K
          </kbd>
        </button>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
        </div>
      </div>
    </header>
  );
};
