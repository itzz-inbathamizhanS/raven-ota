import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { VehicleService } from "../services/api";
import type { Vehicle } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";
import { MetricCard } from "../components/common/MetricCard";

export const VehicleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Telemetry");

  useEffect(() => {
    if (id) {
      VehicleService.getVehicleById(id).then(data => {
        if (data) setVehicle(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="p-space-xl font-code-md text-secondary">Loading vehicle data...</div>;
  if (!vehicle) return <div className="p-space-xl font-code-md text-error">Vehicle {id} not found.</div>;

  const tabs = [
    { id: "Telemetry", label: "Runtime Telemetry" },
    { id: "Envelope", label: "Safety Envelope" },
    { id: "Prediction", label: "Bayesian Prediction" },
    { id: "Assurance", label: "Assurance State" },
    { id: "Evidence", label: "Evidence Chain" },
    { id: "Timeline", label: "Chronological Timeline" },
  ];

  return (
    <div className="flex flex-col w-full px-margin-desktop py-space-xl bg-surface min-h-full gap-space-lg">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-space-xs">
          <span className="font-code-md text-code-md text-secondary uppercase tracking-widest flex items-center gap-2">
            VEHICLE RUNTIME DETAIL / <StatusBadge status={vehicle.assuranceState} />
          </span>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">{vehicle.id}</h1>
          <span className="font-body-md text-body-md text-on-surface-variant">
            {vehicle.model} • VIN: 1HGBH41JXMN109281 • Active OTA: {vehicle.softwareVersion}
          </span>
        </div>
        <div className="flex flex-col items-end gap-space-sm">
          <button 
            onClick={() => window.alert(`Exporting Evidence JSON trace for ${vehicle.id}...`)}
            className="px-space-md py-space-xs bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface font-title-sm text-title-sm rounded-DEFAULT border border-outline-variant flex items-center gap-space-xs"
          >
            <span className="material-symbols-outlined text-[16px]">sim_card_download</span>
            Export Evidence JSON
          </button>
        </div>
      </div>

      <div className="flex border-b border-outline-variant gap-space-md">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-space-xs font-title-sm text-title-sm transition-colors border-b-2 ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-on-surface'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-surface-container-lowest p-space-lg rounded-DEFAULT border border-outline-variant shadow-sm">
        {activeTab === "Telemetry" && (
          <div className="flex flex-col gap-space-lg">
            <h2 className="font-headline-lg text-headline-lg">Live Telemetry Snapshot</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
              <MetricCard label="CPU Utilization" value={vehicle.currentTelemetry.cpuUtilization.toFixed(1)} unit="%" />
              <MetricCard label="CAN Bus Load" value={vehicle.currentTelemetry.canBusLoad.toFixed(1)} unit="%" />
              <MetricCard label="Task Jitter" value={vehicle.currentTelemetry.taskJitter.toFixed(2)} unit="ms" />
              <MetricCard label="ECU Temp" value={vehicle.currentTelemetry.ecuTemp.toFixed(1)} unit="°C" />
            </div>
            
            <h3 className="font-title-md text-title-md mt-space-md uppercase text-secondary">Active Workload Context</h3>
            <div className="p-space-md bg-surface border border-outline-variant rounded-DEFAULT flex gap-space-xl font-code-md text-code-md">
              <div className="flex flex-col gap-1">
                <span className="text-secondary">Dominant Workload</span>
                <span className="text-on-surface">{vehicle.context.dominantWorkload}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-secondary">Environmental</span>
                <span className="text-on-surface">{vehicle.context.environmentalCondition}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-secondary">Road Type</span>
                <span className="text-on-surface">{vehicle.context.roadType}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Envelope" && (
          <div className="flex flex-col gap-space-lg">
            <h2 className="font-headline-lg text-headline-lg">Constraint Margins</h2>
            <div className="grid grid-cols-2 gap-space-lg">
              {vehicle.margins.map((m, idx) => (
                <div key={idx} className="p-space-md bg-surface border border-outline-variant rounded-DEFAULT flex flex-col gap-space-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-code-md text-code-md text-secondary uppercase tracking-widest">{m.metric}</span>
                    <StatusBadge status={m.status} showDot={false} />
                  </div>
                  <div className="flex items-baseline justify-between mt-space-xs">
                    <span className="font-data-metric text-data-metric font-medium">{m.value}</span>
                    <span className="font-label-sm text-label-sm text-secondary tracking-widest">LIMIT: {m.threshold}</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden mt-space-2xs">
                    <div className={`h-full ${m.status === 'NORMAL' ? 'bg-[#121314]' : 'bg-error'}`} style={{ width: `${(m.value / m.threshold) * 100}%` }}></div>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {m.marginPercent > 0 ? `+${m.marginPercent.toFixed(1)}% safe margin remaining` : `${m.marginPercent.toFixed(1)}% boundary violation`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Prediction" && (
          <div className="flex flex-col gap-space-lg">
            <h2 className="font-headline-lg text-headline-lg">Bayesian Boundary Approach</h2>
            {vehicle.prediction ? (
              <div className="p-space-xl bg-[#fdf2f2] border border-[#f3b2b2] rounded-DEFAULT flex flex-col gap-space-md">
                <div className="flex items-center gap-space-sm text-error">
                  <span className="material-symbols-outlined text-[24px]">trending_down</span>
                  <span className="font-headline-md text-headline-md">Predicted Breach in ~{vehicle.prediction.timeToBoundarySeconds}s</span>
                </div>
                <div className="grid grid-cols-2 gap-space-md font-code-md text-code-md">
                  <div className="flex flex-col gap-1">
                    <span className="text-[#b91c1c]/70">Confidence Interval</span>
                    <span className="text-error font-medium">{(vehicle.prediction.confidence * 100).toFixed(1)}% (Kalman Filter)</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#b91c1c]/70">Target Constraint</span>
                    <span className="text-error font-medium">{vehicle.prediction.predictedConstraint}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-space-xl bg-[#eef6f2] border border-[#b7dec9] rounded-DEFAULT flex items-center gap-space-sm text-[#2d6a4f]">
                <span className="material-symbols-outlined text-[24px]">check_circle</span>
                <span className="font-headline-md text-headline-md">No boundary breach predicted within 300s horizon.</span>
              </div>
            )}
          </div>
        )}

        {activeTab === "Assurance" && (
          <div className="flex flex-col gap-space-lg">
            <h2 className="font-headline-lg text-headline-lg">Assurance State Decision</h2>
            <div className="p-space-lg bg-surface border border-outline-variant rounded-DEFAULT">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block mb-space-xs">Current State</span>
              <StatusBadge status={vehicle.assuranceState} className="text-lg px-3 py-1" />
              
              {vehicle.activeMitigation && (
                <div className="mt-space-lg border-t border-outline-variant pt-space-lg">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block mb-space-xs">Graduated Mitigation Active</span>
                  <h3 className="font-headline-md text-headline-md text-primary">{vehicle.activeMitigation}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
                    This response was automatically verified and dispatched by the Runtime Assurance monitor to safely restore the 
                    {vehicle.dominantConstraint ? ` ${vehicle.dominantConstraint}` : ""} margin.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {(activeTab === "Evidence" || activeTab === "Timeline") && (
          <div className="flex flex-col gap-space-md items-center justify-center p-space-2xl text-center">
            <span className="material-symbols-outlined text-outline text-[48px]">pending</span>
            <span className="font-code-md text-code-md text-secondary">Awaiting formal trace generation for {activeTab.toLowerCase()} view.</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
              RAVEN-OTA is a research prototype. Demonstrated responses operate on simulated/testbed vehicle states and are not production vehicle control commands.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
