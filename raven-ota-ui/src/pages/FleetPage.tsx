import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { VehicleService } from "../services/api";
import type { Vehicle } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";
import { MetricCard } from "../components/common/MetricCard";

export const FleetPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<string>("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    VehicleService.getVehicles().then(data => {
      setVehicles(data);
      if (data.length > 0) setSelectedVehicleId(data[0].id);
      setLoading(false);
    });
  }, []);

  const filteredVehicles = vehicles.filter(v => filterState === "ALL" || v.assuranceState === filterState);
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  return (
    <div className="flex flex-col w-full h-[calc(100vh-4rem)] bg-surface overflow-hidden">
      {/* Header Area */}
      <div className="px-margin-desktop pt-space-xl pb-space-md shrink-0 flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-space-2xs">
            <span className="font-code-md text-code-md text-secondary uppercase tracking-widest">
              FLEET ORCHESTRATION / NODE REGISTRY & MARGIN ASSURANCE
            </span>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Vehicle Fleet</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mt-space-xs">
              Runtime assurance states, safety envelope margins, and telemetry context across monitored SDVs in validation & release cycles.
            </p>
          </div>
          <div className="flex flex-col items-end gap-space-sm">
            <span className="font-code-md text-code-md text-on-surface flex items-center gap-space-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              SYNC INTERVAL: 100ms | HEURISTIC EVAL: FORMAL
            </span>
            <div className="flex gap-space-sm">
              <button 
                onClick={() => window.alert("Initiating batch envelope check across the fleet...")}
                className="px-space-md py-space-xs bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface font-title-sm text-title-sm rounded-DEFAULT border border-outline-variant flex items-center gap-space-xs"
              >
                <span className="material-symbols-outlined text-[16px]">library_add_check</span>
                Batch Envelope Check
              </button>
              <button 
                onClick={() => window.alert("Exporting Fleet Audit as CSV...")}
                className="px-space-md py-space-xs bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface font-title-sm text-title-sm rounded-DEFAULT border border-outline-variant flex items-center gap-space-xs"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Export Fleet Audit
              </button>
            </div>
          </div>
        </div>

        {/* Fleet Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-base mt-space-sm border-b border-outline-variant pb-space-lg">
          <MetricCard label="ACTIVE EVALUATED FLEET" value="148" footerText="PROTOTYPE UNITS" className="bg-transparent border-none p-0" />
          <MetricCard label="FLEET MARGIN VARIANCE" value="11.8" unit="%" footerText="MEAN POOL" className="bg-transparent border-none p-0 border-l border-outline-variant pl-space-base rounded-none" />
          <MetricCard label="ENVELOPE DEVIATIONS" value="9" footerText="NODES ELEVATED" className="bg-transparent border-none p-0 border-l border-outline-variant pl-space-base rounded-none" />
          <MetricCard label="OTA ROLLOUT COVERAGE" value="87.2" unit="%" footerText="OTA-2026-041" className="bg-transparent border-none p-0 border-l border-outline-variant pl-space-base rounded-none" />
        </div>
        
        {/* Filters */}
        <div className="flex gap-space-md items-center py-space-xs">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-secondary text-[18px]">search</span>
            <input 
              type="text" 
              placeholder="Search by Vehicle ID, VIN, or Software Version..." 
              className="w-full pl-10 pr-space-sm py-space-xs bg-surface border border-outline-variant rounded-DEFAULT font-body-sm text-body-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex bg-surface-container-low p-space-2xs rounded-DEFAULT border border-outline-variant">
            <button onClick={() => setFilterState("ALL")} className={`px-space-sm py-space-2xs rounded-[2px] font-label-sm text-label-sm transition-colors ${filterState === "ALL" ? "bg-primary text-on-primary" : "text-secondary hover:text-on-surface"}`}>ALL ({vehicles.length})</button>
            <button onClick={() => setFilterState("NORMAL")} className={`px-space-sm py-space-2xs rounded-[2px] font-label-sm text-label-sm transition-colors ${filterState === "NORMAL" ? "bg-primary text-on-primary" : "text-secondary hover:text-on-surface"}`}>NORMAL ({vehicles.filter(v => v.assuranceState === "NORMAL").length})</button>
            <button onClick={() => setFilterState("WARNING")} className={`px-space-sm py-space-2xs rounded-[2px] font-label-sm text-label-sm transition-colors ${filterState === "WARNING" ? "bg-primary text-on-primary" : "text-secondary hover:text-on-surface"}`}>WARNING ({vehicles.filter(v => v.assuranceState === "WARNING").length})</button>
            <button onClick={() => setFilterState("DEGRADED")} className={`px-space-sm py-space-2xs rounded-[2px] font-label-sm text-label-sm transition-colors ${filterState === "DEGRADED" ? "bg-primary text-on-primary" : "text-secondary hover:text-on-surface"}`}>DEGRADED ({vehicles.filter(v => v.assuranceState === "DEGRADED").length})</button>
            <button onClick={() => setFilterState("UNSAFE")} className={`px-space-sm py-space-2xs rounded-[2px] font-label-sm text-label-sm transition-colors ${filterState === "UNSAFE" ? "bg-primary text-on-primary" : "text-secondary hover:text-on-surface"}`}>UNSAFE ({vehicles.filter(v => v.assuranceState === "UNSAFE").length})</button>
          </div>
        </div>
      </div>

      {/* Split View Content */}
      <div className="flex-1 flex overflow-hidden border-t border-outline-variant bg-surface-container-lowest">
        
        {/* Left: Table */}
        <div className="flex-1 overflow-y-auto p-space-md border-r border-outline-variant">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-surface-container-lowest z-10">
              <tr className="border-b border-outline-variant">
                <th className="p-space-sm font-label-md text-label-md text-secondary tracking-widest uppercase">Vehicle ID & Model</th>
                <th className="p-space-sm font-label-md text-label-md text-secondary tracking-widest uppercase">Version / Build</th>
                <th className="p-space-sm font-label-md text-label-md text-secondary tracking-widest uppercase">Assurance State</th>
                <th className="p-space-sm font-label-md text-label-md text-secondary tracking-widest uppercase">Envelope Margin</th>
                <th className="p-space-sm font-label-md text-label-md text-secondary tracking-widest uppercase">Dominant Constraint</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-space-lg text-center text-secondary font-code-md">Loading fleet...</td></tr>
              ) : (
                filteredVehicles.map((v) => (
                  <tr 
                    key={v.id} 
                    onClick={() => setSelectedVehicleId(v.id)}
                    className={`border-b border-outline-variant transition-colors cursor-pointer ${selectedVehicleId === v.id ? 'bg-surface-container' : 'hover:bg-surface-container-low'}`}
                  >
                    <td className="p-space-sm">
                      <div className="flex flex-col">
                        <span className="font-code-md text-code-md text-on-surface font-medium">{v.id}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant max-w-[120px] truncate">{v.model}</span>
                      </div>
                    </td>
                    <td className="p-space-sm">
                      <div className="flex flex-col">
                        <span className="font-code-md text-code-md text-on-surface">{v.softwareVersion}</span>
                        <span className="font-body-sm text-body-sm text-secondary">bld-9941</span>
                      </div>
                    </td>
                    <td className="p-space-sm">
                      <StatusBadge status={v.assuranceState} />
                    </td>
                    <td className="p-space-sm">
                      <div className="flex flex-col gap-1 w-32">
                        <div className="flex justify-between items-baseline">
                          <span className={v.envelopeMargin < 5 ? 'font-code-md text-code-md text-error font-bold' : 'font-code-md text-code-md text-[#2d6a4f]'}>
                            {v.envelopeMargin.toFixed(1)}%
                          </span>
                          <span className="font-label-sm text-label-sm text-secondary">{v.envelopeMargin < 5 ? 'CPU 82% < 85%' : 'Nominal'}</span>
                        </div>
                        <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
                          <div className={`h-full ${v.envelopeMargin < 5 ? 'bg-error' : 'bg-[#2d6a4f]'}`} style={{ width: `${100 - (v.envelopeMargin * 2)}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-space-sm">
                      <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-space-xs">
                        {v.dominantConstraint && <span className="material-symbols-outlined text-[16px] text-secondary">memory</span>}
                        {v.dominantConstraint || "None (Balanced)"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Right: Telemetry Inspector */}
        <div className="w-96 shrink-0 flex flex-col bg-surface overflow-y-auto">
          {selectedVehicle ? (
            <>
              <div className="p-space-md border-b border-outline-variant flex items-center justify-between sticky top-0 bg-surface z-10">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[18px]">query_stats</span>
                  <span className="font-title-sm text-title-sm">Telemetry Inspector</span>
                </div>
                <span className="font-code-md text-code-md text-secondary bg-surface-container px-space-xs py-space-2xs rounded-[2px]">{selectedVehicle.id}</span>
              </div>
              
              <div className="p-space-md flex flex-col gap-space-lg">
                <div className="flex flex-col gap-space-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Node Classification</span>
                    <StatusBadge status={selectedVehicle.assuranceState} showDot={false} />
                  </div>
                  <h2 className="font-headline-lg text-headline-lg">{selectedVehicle.id}</h2>
                  <span className="font-code-md text-code-md text-secondary">VIN: 1HGBH41JXMN109281 • ECU-ADAS-PRIMARY</span>
                </div>

                <div className="flex flex-col gap-space-sm">
                  <div className="flex justify-between items-center border-b border-outline-variant pb-space-xs">
                    <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Formal Safety Margins</span>
                    <span className="font-code-md text-code-md text-on-surface">CONTRACT V3</span>
                  </div>
                  
                  {selectedVehicle.margins.map((m, idx) => (
                    <div key={idx} className="flex flex-col gap-1 pt-space-xs">
                      <div className="flex justify-between font-code-md text-code-md">
                        <span className="text-on-surface-variant">{m.metric} (&lt; {m.threshold})</span>
                        <span className={m.status === 'NORMAL' ? 'text-on-surface' : 'text-error font-bold'}>
                          {m.value} <span className="text-secondary font-normal">({m.marginPercent > 0 ? '+' : ''}{m.marginPercent.toFixed(1)}% margin)</span>
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div className={`h-full ${m.status === 'NORMAL' ? 'bg-[#121314]' : 'bg-error'}`} style={{ width: `${(m.value / m.threshold) * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-space-xs pt-space-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Recessed CAN Log Stream</span>
                    <span className="font-code-md text-code-md text-secondary">100Hz</span>
                  </div>
                  <div className="bg-surface-container p-space-sm rounded-DEFAULT font-code-md text-code-md flex flex-col gap-1 text-[11px] leading-tight font-mono">
                    <div className="flex justify-between text-on-surface-variant"><span>0x18F00503</span><span className="text-error">WARN: CPU_SPIKE 82%</span></div>
                    <div className="flex justify-between text-on-surface-variant"><span>0x0CFE6CEE</span><span>STEER_TORQUE_VAL OK</span></div>
                    <div className="flex justify-between text-on-surface-variant"><span>0x18FEF100</span><span>WHEEL_SPEED_FL 42.1</span></div>
                    <div className="flex justify-between text-on-surface-variant"><span>0x18EAFF00</span><span>AUTOSAR_HEARTBEAT 1</span></div>
                  </div>
                </div>

                <div className="flex flex-col gap-space-sm mt-auto">
                  <button 
                    onClick={() => navigate(`/vehicles/${selectedVehicle.id}`)}
                    className="w-full py-space-sm bg-primary hover:bg-tertiary-container text-on-primary font-title-sm text-title-sm rounded-DEFAULT transition-colors flex items-center justify-center gap-space-xs"
                  >
                    <span>Open Comprehensive Vehicle Profile</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                  <button 
                    onClick={() => window.alert(`Requesting live diagnostic snapshot for ${selectedVehicle.id}...`)}
                    className="w-full py-space-sm bg-transparent hover:bg-surface-container border border-outline-variant text-on-surface font-title-sm text-title-sm rounded-DEFAULT transition-colors flex items-center justify-center gap-space-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    <span>Request Diagnostic Snapshot</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-space-xl flex items-center justify-center h-full text-secondary font-body-md text-center">
              Select a vehicle to view telemetry
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
