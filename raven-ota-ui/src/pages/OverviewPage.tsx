import React from "react";
import { Link } from "react-router-dom";
import { MetricCard } from "../components/common/MetricCard";

export const OverviewPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Subtle ambient top gradient wash for depth */}
      <div className="relative w-full overflow-hidden px-margin-desktop py-space-2xl bg-surface">
        <div className="absolute right-0 top-0 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        
        {/* Hero Header */}
        <div className="max-w-6xl flex flex-col gap-space-lg relative z-10">
          <div className="flex flex-wrap items-center gap-space-sm">
            <span className="px-space-sm py-space-2xs bg-surface-container rounded-DEFAULT font-label-sm text-label-sm uppercase tracking-widest text-on-surface">
              Automotive Runtime Assurance • Research Platform
            </span>
            <span className="text-outline-variant font-code-md text-code-md">/</span>
            <span className="font-code-md text-code-md text-secondary tracking-tight">ISO-26262 ASIL-D • ISO-21448 SOTIF • SIL-4</span>
          </div>
          
          <div className="flex flex-col gap-space-xs max-w-4xl">
            <div className="flex items-baseline gap-space-md flex-wrap">
              <h1 className="font-headline-xl text-headline-xl tracking-tight text-on-surface">
                RAVEN-OTA
              </h1>
              <span className="font-label-md text-label-md text-on-surface-variant font-normal">
                [VERIFIED RUNTIME ARTIFACT EVALUATOR v4.8.2]
              </span>
            </div>
            <p className="font-headline-md text-headline-md text-on-surface-variant leading-relaxed">
              Runtime Assurance for Verified OTA Software in Software-Defined Electric Vehicles
            </p>
          </div>
          
          <div className="max-w-3xl pt-space-xs">
            <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
              From verified software assumptions to continuous runtime assurance. Bridging pre-deployment formal OTA verification contracts with real-time in-vehicle dynamic safety envelopes.
            </p>
          </div>
          
          {/* Action Cluster */}
          <div className="flex flex-wrap items-center gap-space-md pt-space-sm">
            <Link to="/assurance" className="px-space-lg py-space-sm bg-primary hover:bg-tertiary-container text-on-primary font-title-sm text-title-sm rounded-DEFAULT transition-colors shadow-sm flex items-center gap-space-xs">
              <span>Explore Pipeline Engine</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
            <Link to="/dashboard" className="px-space-lg py-space-sm bg-surface-container hover:bg-surface-container-high text-on-surface font-title-sm text-title-sm rounded-DEFAULT transition-colors flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[16px]">dashboard</span>
              <span>Operations Dashboard</span>
            </Link>
            <Link to="/simulator" className="px-space-md py-space-sm text-secondary hover:text-on-surface font-title-sm text-title-sm rounded-DEFAULT transition-colors flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Simulation Bench</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Metric Ribbon */}
      <div className="w-full bg-surface-container-low py-space-lg px-margin-desktop shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-base max-w-7xl">
          <MetricCard
            label="Safety Restoration Rate"
            value="99.8"
            unit="%"
            badgeLabel="SIL-4 CERT"
            progressValue={99.8}
          />
          <MetricCard
            label="Mean Response Latency"
            value="0.40"
            unit="s"
            badgeLabel="≤ 0.5s TARGET"
            progressValue={80}
          />
          <MetricCard
            label="False Intervention Rate"
            value="0.00"
            unit="%"
            badgeLabel="ZERO ROLLBACK"
            progressValue={0}
          />
          <div className="p-space-md bg-surface rounded-DEFAULT flex flex-col justify-between gap-space-xs">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Evaluated Testbed Target</span>
            <div className="flex items-baseline justify-between">
              <span className="font-code-md text-code-md text-on-surface font-semibold">RAVEN-017</span>
              <span className="font-label-sm text-label-sm px-space-xs py-space-2xs bg-surface-container-highest text-on-surface rounded-DEFAULT">v4.8.2 ACTIVE</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant truncate">High ADAS Inference Workload</span>
          </div>
        </div>
      </div>

      {/* Dual Architectural Pillars */}
      <div className="w-full px-margin-desktop py-space-2xl bg-surface flex flex-col gap-space-xl">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">Architectural Paradigm</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Dual-Plane Verification Architecture</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Separation of rigorous pre-deployment algorithmic validation and real-time execution constraint enforcement in mission-critical automotive computers.
          </p>
        </div>
        
        {/* Placeholder for the rest of the content */}
        <div className="p-space-xl bg-surface-container text-center text-on-surface-variant font-body-lg">
          <p>RAVEN-OTA is a research prototype. Demonstrated responses operate on simulated/testbed vehicle states and are not production vehicle control commands.</p>
        </div>
      </div>
    </div>
  );
};
