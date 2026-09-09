import { useState, useEffect } from "react";
import { MetricCard } from "../components/common/MetricCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer } from "recharts";
import { AssuranceService, VehicleService } from "../services/api";
import type { Vehicle } from "../types";

export const DashboardPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartMetric, setChartMetric] = useState("CPU Utilization");

  useEffect(() => {
    VehicleService.getVehicles().then(data => {
      setVehicles(data);
      setLoading(false);
    });
  }, []);

  // Mock data for the chart representing Constraint Evolution
  const chartData = [
    { time: -60, margin: chartMetric === "CPU Utilization" ? 40 : chartMetric === "CAN Bus Load" ? 50 : 60 },
    { time: -50, margin: chartMetric === "CPU Utilization" ? 38 : chartMetric === "CAN Bus Load" ? 45 : 55 },
    { time: -40, margin: chartMetric === "CPU Utilization" ? 32 : chartMetric === "CAN Bus Load" ? 40 : 50 },
    { time: -30, margin: chartMetric === "CPU Utilization" ? 25 : chartMetric === "CAN Bus Load" ? 35 : 45 },
    { time: -20, margin: chartMetric === "CPU Utilization" ? 15 : chartMetric === "CAN Bus Load" ? 20 : 30 },
    { time: -10, margin: chartMetric === "CPU Utilization" ? 8  : chartMetric === "CAN Bus Load" ? 12 : 20 },
    { time: 0, margin:   chartMetric === "CPU Utilization" ? 3  : chartMetric === "CAN Bus Load" ? 8  : 15 }, // Approaching 0
  ];

  return (
    <div className="flex flex-col w-full px-margin-desktop py-space-xl bg-surface min-h-full gap-space-xl">
      <div className="flex flex-col gap-space-2xs">
        <span className="font-code-md text-code-md text-secondary uppercase tracking-widest">
          SIL-4 FORMAL VERIFICATION NODE • AUTOSAR AP 23-11
        </span>
        <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Operations Dashboard</h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mt-space-xs">
          Fleet runtime assurance overview & active constraint boundary monitoring across dynamic OTA envelopes.
        </p>
      </div>

      {/* Top Metric Row */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-space-base">
        <MetricCard label="VEHICLES MONITORED" value="148" footerText="Active telemetry streams" />
        <MetricCard label="NORMAL" value="139" badgeLabel="93.9%" badgeVariant="primary" footerText="Safe margin > 10%" className="bg-[#eef6f2]/30" />
        <MetricCard label="WARNING" value="6" badgeLabel="4.1%" badgeVariant="secondary" footerText="Requires pre-mitigation" className="bg-[#fdf7ed]/50" />
        <MetricCard label="DEGRADED" value="2" badgeLabel="1.4%" badgeVariant="secondary" footerText="SOTIF sub-mode active" className="bg-[#fdf3ed]/50" />
        <MetricCard label="UNSAFE" value="1" badgeLabel="0.7%" badgeVariant="danger" footerText="MRM Safe Stop engaged" className="bg-[#fdf2f2]/50" />
        <MetricCard label="OTA CAMPAIGNS" value="3" footerText="OTA-2026-041 v4.8.2 active" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {/* Left Column: Chart */}
        <div className="lg:col-span-2 p-space-xl bg-surface-container-low rounded-DEFAULT shadow-sm flex flex-col gap-space-md">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Safety Margin & Constraint Evolution</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Target Subject: <strong className="text-on-surface">RAVEN-017</strong> • Real-time temporal convergence</p>
            </div>
            <div className="flex gap-space-xs">
              <button 
                onClick={() => setChartMetric("CPU Utilization")}
                className={`px-space-sm py-space-2xs border rounded-DEFAULT font-label-sm text-label-sm transition-colors ${chartMetric === "CPU Utilization" ? "bg-surface text-on-surface border-outline-variant" : "bg-transparent text-secondary border-transparent hover:bg-surface"}`}>CPU Utilization</button>
              <button 
                onClick={() => setChartMetric("CAN Bus Load")}
                className={`px-space-sm py-space-2xs border rounded-DEFAULT font-label-sm text-label-sm transition-colors ${chartMetric === "CAN Bus Load" ? "bg-surface text-on-surface border-outline-variant" : "bg-transparent text-secondary border-transparent hover:bg-surface"}`}>CAN Bus Load</button>
              <button 
                onClick={() => setChartMetric("Task Jitter")}
                className={`px-space-sm py-space-2xs border rounded-DEFAULT font-label-sm text-label-sm transition-colors ${chartMetric === "Task Jitter" ? "bg-surface text-on-surface border-outline-variant" : "bg-transparent text-secondary border-transparent hover:bg-surface"}`}>Task Jitter</button>
            </div>
          </div>
          
          <div className="h-64 w-full mt-space-md bg-surface border border-outline-variant rounded-DEFAULT pt-space-md pr-space-md relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e3" />
                <XAxis dataKey="time" hide />
                <YAxis domain={[0, 50]} hide />
                <ReferenceLine y={10} stroke="#b45309" strokeDasharray="4 4" label={{ position: 'insideTopRight', value: 'WARNING MARGIN THRESHOLD: 10%', fill: '#b45309', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                <ReferenceLine y={0} stroke="#b91c1c" strokeDasharray="4 4" label={{ position: 'insideTopRight', value: 'FORMAL VERIFIED LIMIT: 0% MARGIN', fill: '#b91c1c', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                <Line type="monotone" dataKey="margin" stroke="#121314" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="absolute right-4 bottom-8 w-3 h-3 bg-[#b91c1c] rounded-full border-2 border-surface animate-pulse"></div>
          </div>

          <div className="bg-[#fdf2f2] border border-[#f3b2b2] rounded-DEFAULT p-space-sm mt-space-sm flex items-start gap-space-sm">
            <span className="material-symbols-outlined text-[#b91c1c] text-[18px] mt-0.5">warning</span>
            <span className="font-code-md text-code-md text-[#b91c1c]">
              Predicted boundary breach in <strong className="font-bold">~42s</strong> without intervention. Sampling: 100Hz. Kalman Confidence: 99.4%. Invariant: inv_temporal_sched_bound
            </span>
          </div>
        </div>

        {/* Right Column: Assurance Context */}
        <div className="p-space-xl bg-[#fdf7ed]/30 border border-[#f5d399]/50 rounded-DEFAULT shadow-sm flex flex-col gap-space-md">
          <div className="flex justify-between items-center">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Assurance Context</span>
            <span className="bg-[#fdf7ed] border border-[#f5d399] text-[#b45309] font-label-sm text-label-sm px-2 py-0.5 rounded-[2px]">WARNING</span>
          </div>
          
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">RAVEN-017 Mitigation</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">VIN: 1FTFW1ED8NFA91 • Autonomous Test Platform 4</p>
          </div>

          <div className="grid grid-cols-2 gap-space-sm mt-space-xs">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-secondary uppercase">Software Version</span>
              <span className="font-code-md text-code-md text-on-surface">v4.8.2 (Release)</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-secondary uppercase">Active Envelope</span>
              <span className="font-code-md text-code-md text-on-surface">OTA-2026-041</span>
            </div>
            <div className="flex flex-col mt-space-sm">
              <span className="font-label-sm text-label-sm text-secondary uppercase">Dominant Bound</span>
              <span className="font-code-md text-code-md text-on-surface">CPU Utilization</span>
            </div>
            <div className="flex flex-col mt-space-sm">
              <span className="font-label-sm text-label-sm text-secondary uppercase">Current Margin</span>
              <span className="font-code-md text-code-md text-[#b91c1c] font-bold">3.0% (at 82.0%)</span>
            </div>
          </div>

          <div className="mt-space-md p-space-md bg-surface border border-outline-variant rounded-DEFAULT">
            <span className="font-label-sm text-label-sm text-secondary uppercase block mb-space-xs">Decision Engine Rationale</span>
            <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
              CPU margin is declining under elevated ADAS workload (camera multi-camera fusion pipeline). Verified temporal scheduling bound approaching SIL-4 limit.
            </p>
          </div>

          <div className="mt-auto pt-space-lg flex flex-col gap-space-sm">
            <div className="flex justify-between items-center">
              <span className="font-label-sm text-label-sm text-secondary uppercase">Recommended Graduated Action</span>
              <span className="font-code-md text-code-md bg-surface px-space-xs py-space-2xs border border-outline-variant rounded-DEFAULT">TIER-1 RESPONSE</span>
            </div>
            <h3 className="font-title-md text-title-md text-on-surface uppercase">REDUCE_NON_CRITICAL_WORKLOAD</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              De-prioritizes non-critical cabin telemetry & detailed point-cloud logging to reclaim 8-10% CPU headroom without vehicle disruption or rollback.
            </p>
            <button 
              onClick={async () => {
                await AssuranceService.triggerMitigation('RAVEN-017');
                const refreshed = await VehicleService.getVehicles();
                setVehicles(refreshed);
              }}
              className="mt-space-sm w-full py-space-md bg-primary hover:bg-tertiary-container text-on-primary font-title-sm text-title-sm rounded-DEFAULT transition-colors flex items-center justify-center gap-space-xs"
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Dispatch Simulated Mitigation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fleet Assurance Matrix */}
      <div className="w-full bg-surface-container-low rounded-DEFAULT p-space-lg shadow-sm mt-space-md flex flex-col gap-space-md">
        <div className="flex justify-between items-end">
          <h2 className="font-headline-md text-headline-md text-on-surface">Fleet Assurance Matrix</h2>
          <span className="font-code-md text-code-md text-secondary">Displaying active candidate subset (5 of 148)</span>
        </div>
        
        <div className="overflow-x-auto w-full border border-outline-variant rounded-DEFAULT bg-surface">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="p-space-md font-label-md text-label-md text-secondary tracking-widest uppercase">Vehicle ID</th>
                <th className="p-space-md font-label-md text-label-md text-secondary tracking-widest uppercase">Version</th>
                <th className="p-space-md font-label-md text-label-md text-secondary tracking-widest uppercase">Assurance State</th>
                <th className="p-space-md font-label-md text-label-md text-secondary tracking-widest uppercase">Safety Margin</th>
                <th className="p-space-md font-label-md text-label-md text-secondary tracking-widest uppercase">Dominant Constraint</th>
                <th className="p-space-md font-label-md text-label-md text-secondary tracking-widest uppercase">Operational Context</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-space-lg text-center text-secondary font-code-md">Loading fleet data...</td></tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group cursor-pointer">
                    <td className="p-space-md font-code-md text-code-md text-on-surface font-medium group-hover:text-primary">{v.id}</td>
                    <td className="p-space-md font-body-sm text-body-sm text-on-surface-variant">{v.softwareVersion}</td>
                    <td className="p-space-md font-label-sm text-label-sm uppercase">
                      <span className={`inline-flex items-center gap-1 ${
                        v.assuranceState === 'NORMAL' ? 'text-[#2d6a4f]' :
                        v.assuranceState === 'WARNING' ? 'text-[#b45309]' :
                        v.assuranceState === 'DEGRADED' ? 'text-[#c2410c]' : 'text-[#b91c1c]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          v.assuranceState === 'NORMAL' ? 'bg-[#2d6a4f]' :
                          v.assuranceState === 'WARNING' ? 'bg-[#b45309]' :
                          v.assuranceState === 'DEGRADED' ? 'bg-[#c2410c]' : 'bg-[#b91c1c]'
                        }`}></span>
                        {v.assuranceState}
                      </span>
                    </td>
                    <td className="p-space-md font-code-md text-code-md">
                      <span className={v.envelopeMargin < 5 ? 'text-[#b91c1c] font-bold' : 'text-[#2d6a4f]'}>
                        {v.envelopeMargin.toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-space-md font-body-sm text-body-sm text-on-surface-variant">{v.dominantConstraint || "Nominal Envelope"}</td>
                    <td className="p-space-md font-body-sm text-body-sm text-on-surface-variant">{v.context.dominantWorkload}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
