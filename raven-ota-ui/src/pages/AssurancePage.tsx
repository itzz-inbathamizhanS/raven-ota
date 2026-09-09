import { useState, useEffect } from "react";
import { VehicleService } from "../services/api";
import type { Vehicle } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";
import { MetricCard } from "../components/common/MetricCard";

export const AssurancePage = () => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    VehicleService.getVehicleById("RAVEN-017").then(data => {
      if (data) setVehicle(data);
    });
  }, []);

  if (!vehicle) return <div className="p-space-xl font-code-md">Loading Assurance Monitor...</div>;

  return (
    <div className="flex flex-col w-full px-margin-desktop py-space-xl bg-surface min-h-full gap-space-xl">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-space-xs">
          <span className="font-code-md text-code-md text-secondary uppercase tracking-widest">
            10-STAGE RUNTIME ASSURANCE LOOP
          </span>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Runtime Assurance Monitor</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mt-space-xs">
            Hardware-isolated onboard assurance monitor supervising execution margins and orchestrating non-disruptive graduated fallbacks during envelope breach.
          </p>
        </div>
      </div>

      {/* Verification Flow Stepper */}
      <div className="w-full overflow-x-auto pb-space-sm mt-space-md">
        <div className="flex items-center min-w-[1100px] gap-space-xs">
          {["OTA Update", "Artifact Gen", "Safety Envelope", "Telemetry Bus", "Margin Eval", "Prediction", "Assurance State", "Graduated Action", "Post-Verify", "Evidence Chain"].map((step, idx) => (
            <div key={idx} className="flex items-center flex-1">
              <div className={`p-space-sm rounded-DEFAULT text-left transition-all w-full border ${idx === 7 ? 'bg-primary text-on-primary border-primary' : 'bg-surface text-on-surface hover:bg-surface-container-high border-outline-variant'}`}>
                <span className={`font-code-md text-code-md block ${idx === 7 ? 'opacity-80' : 'text-secondary'}`}>{(idx + 1).toString().padStart(2, '0')}</span>
                <span className="font-title-sm text-title-sm block truncate">{step}</span>
              </div>
              {idx < 9 && <div className="w-2 h-0.5 bg-outline-variant shrink-0 mx-1"></div>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
        {/* Left: Active Monitor */}
        <div className="p-space-xl bg-[#fdf7ed]/30 border border-[#f5d399]/50 rounded-DEFAULT shadow-sm flex flex-col gap-space-md">
          <div className="flex justify-between items-center">
            <span className="font-code-md text-code-md text-secondary tracking-widest">ACTIVE MONITOR NODE</span>
            <StatusBadge status={vehicle.assuranceState} />
          </div>
          
          <div>
            <h2 className="font-headline-lg text-headline-lg">{vehicle.id} Live Telemetry</h2>
            <p className="font-code-md text-code-md text-on-surface-variant mt-1">Software: {vehicle.softwareVersion} • {vehicle.context.dominantWorkload}</p>
          </div>

          <div className="grid grid-cols-2 gap-space-md mt-space-md">
            <MetricCard label="CPU UTILIZATION" value={vehicle.currentTelemetry.cpuUtilization.toFixed(1)} unit="%" badgeLabel="85.0% LIMIT" badgeVariant="danger" className="bg-surface border border-outline-variant" />
            <MetricCard label="HEADROOM" value={vehicle.envelopeMargin.toFixed(1)} unit="%" badgeLabel="CRITICAL" badgeVariant="danger" className="bg-[#fdf2f2] border border-[#f3b2b2]" />
            <MetricCard label="TASK JITTER" value={vehicle.currentTelemetry.taskJitter.toFixed(2)} unit="ms" footerText="Threshold: 2.50ms" className="bg-surface border border-outline-variant" />
            <MetricCard label="PREDICTION" value={vehicle.prediction?.timeToBoundarySeconds} unit="s" badgeLabel="TO BREACH" badgeVariant="danger" className="bg-surface border border-outline-variant" />
          </div>
        </div>

        {/* Right: Graduated Response */}
        <div className="p-space-xl bg-surface-container-low rounded-DEFAULT border border-outline-variant shadow-sm flex flex-col gap-space-md">
          <span className="font-code-md text-code-md text-secondary tracking-widest">ASSURANCE DECISION ENGINE</span>
          <h2 className="font-headline-lg text-headline-lg">Graduated Response Action</h2>
          
          <div className="p-space-md bg-surface border border-outline-variant rounded-DEFAULT flex flex-col gap-space-xs mt-space-md">
            <span className="font-label-sm text-label-sm text-secondary uppercase">Decision Rationale</span>
            <p className="font-body-md text-body-md text-on-surface">
              Margin evaluation detects {vehicle.dominantConstraint} approaching safety bounds within {(vehicle.prediction?.timeToBoundarySeconds || 0)}s horizon.
              Confidence: {((vehicle.prediction?.confidence || 0) * 100).toFixed(1)}%.
            </p>
          </div>

          <div className="p-space-md bg-primary text-on-primary rounded-DEFAULT flex flex-col gap-space-xs mt-space-sm shadow-md">
            <div className="flex justify-between items-center">
              <span className="font-label-sm text-label-sm opacity-80 uppercase tracking-widest">Dispatched Action</span>
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <h3 className="font-title-md text-title-md uppercase tracking-wider text-[16px]">{vehicle.activeMitigation}</h3>
            <p className="font-body-sm text-body-sm opacity-90 mt-1">
              Safely shedding low-priority background logging tasks to reclaim ~8% CPU headroom without disrupting core ADAS perception tasks.
            </p>
          </div>

          <div className="mt-auto pt-space-md flex flex-col gap-space-xs border-t border-outline-variant">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Post-Response Verification</span>
            <div className="flex items-center gap-space-sm font-code-md text-code-md text-[#2d6a4f]">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>SAFETY MARGIN RESTORED (+10.8% headroom)</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-space-2xl text-center">
        <span className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
          RAVEN-OTA is a research prototype. Demonstrated responses operate on simulated/testbed vehicle states and are not production vehicle control commands.
        </span>
      </div>
    </div>
  );
};
