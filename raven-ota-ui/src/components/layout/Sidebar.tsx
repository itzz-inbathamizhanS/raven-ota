import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";

const NAV_ITEMS = [
  { path: "/", label: "Overview", num: "01" },
  { path: "/dashboard", label: "Operations Dashboard", num: "02" },
  { path: "/vehicles", label: "Vehicle Fleet", num: "03" },
  // Detail page doesn't show up in the main nav list as its own static entry, or maybe it does? 
  // Based on Stitch HTML, Vehicle Detail was item 04. Let's map it to a placeholder or omit it if it's dynamic. 
  // Stitch has it explicitly: "04 Vehicle Detail". We'll route it to /vehicles/RAVEN-017 by default.
  { path: "/vehicles/RAVEN-017", label: "Vehicle Detail", num: "04" },
  { path: "/ota", label: "OTA Campaigns", num: "05" },
  { path: "/ota/OTA-2026-041", label: "Update & Envelope", num: "06" },
  { path: "/assurance", label: "Runtime Assurance", num: "07" },
  { path: "/incidents", label: "Incidents & Evidence", num: "08" },
  { path: "/analytics", label: "Fleet Analytics", num: "09" },
  { path: "/simulator", label: "Scenario Simulator", num: "10" },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-surface-container-low z-40 flex flex-col justify-between select-none shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="p-space-lg flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm">
            <span className="font-headline-md text-headline-md text-on-surface tracking-tight">RAVEN-OTA</span>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider pl-space-2xs">
            Runtime Assurance • Verified OTA
          </p>
        </div>
        
        <div className="px-space-md py-space-xs">
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest px-space-sm">
            Assurance Plane
          </span>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-space-md space-y-space-2xs">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.num}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-space-sm py-space-xs rounded-DEFAULT transition-colors",
                  isActive
                    ? "bg-surface text-on-surface font-title-sm shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
                    : "text-on-surface-variant hover:bg-surface hover:text-on-surface font-body-md text-body-md"
                )
              }
            >
              <span className="font-code-md text-code-md text-outline-variant mr-space-md w-4 text-center">
                {item.num}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-space-md bg-surface-container flex flex-col gap-space-sm">
        <div className="flex items-center justify-between px-space-xs">
          <span className="inline-flex items-center gap-space-xs px-space-sm py-space-2xs rounded-DEFAULT bg-surface text-on-surface font-label-sm text-label-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            PROTOTYPE TESTBED • CONNECTED
          </span>
        </div>
        <button 
          onClick={() => window.alert('Global Engine Parameters dialog would open here.')}
          className="w-full flex items-center justify-between px-space-md py-space-sm rounded-DEFAULT bg-surface-container-high text-on-surface hover:bg-surface transition-colors font-title-sm text-title-sm"
          type="button"
        >
          <span>Settings & Parameters</span>
          <span className="material-symbols-outlined text-[16px]">tune</span>
        </button>
        <div className="px-space-xs pt-space-2xs text-on-surface-variant font-label-sm text-label-sm flex justify-between">
          <span>AUTOSAR Classic/Adaptive</span>
          <span>R-CAN v4.1</span>
        </div>
      </div>
    </aside>
  );
};
