import { useState, useEffect } from "react";
import { SimulatorService } from "../services/api";
import type { SimulationScenario } from "../types";

export const SimulatorPage = () => {
  const [scenarios, setScenarios] = useState<SimulationScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  useEffect(() => {
    SimulatorService.getScenarios().then(data => {
      setScenarios(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col w-full px-margin-desktop py-space-xl bg-surface min-h-full gap-space-xl">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-space-xs">
          <span className="font-code-md text-code-md text-secondary uppercase tracking-widest">
            SYNTHETIC TELEMETRY & BOUNDARY TESTING
          </span>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Scenario Simulator</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mt-space-xs">
            Inject synthetic faults, workload surges, and environmental stressors into the testbed to evaluate the runtime assurance envelope logic and response latency.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
        {loading ? (
          <div className="col-span-full p-space-lg font-code-md text-secondary">Loading simulator profiles...</div>
        ) : (
          scenarios.map(scen => (
            <div key={scen.id} className={`p-space-md border rounded-DEFAULT flex flex-col justify-between transition-colors ${activeScenario === scen.id ? 'bg-surface-container-high border-primary' : 'bg-surface border-outline-variant hover:border-primary/50'}`}>
              <div className="flex justify-between items-start mb-space-sm">
                <span className={`font-label-sm text-label-sm px-2 py-0.5 rounded-[2px] uppercase ${
                  scen.category === 'Nominal' ? 'bg-[#eef6f2] text-[#2d6a4f]' :
                  scen.category === 'Stress' ? 'bg-[#fdf7ed] text-[#b45309]' : 'bg-[#fdf2f2] text-[#b91c1c]'
                }`}>
                  {scen.category}
                </span>
                <span className="font-code-md text-code-md text-secondary">{scen.id}</span>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface mb-1">{scen.name}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md min-h-[40px]">{scen.description}</p>
              
              <button 
                onClick={async () => {
                  if (activeScenario === scen.id) {
                    await SimulatorService.stopSimulator();
                    setActiveScenario(null);
                  } else {
                    await SimulatorService.startSimulator();
                    setActiveScenario(scen.id);
                  }
                }}
                className={`w-full py-space-xs font-title-sm text-title-sm rounded-DEFAULT transition-colors flex items-center justify-center gap-space-xs ${
                  activeScenario === scen.id 
                    ? 'bg-error text-white hover:bg-red-700' 
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                {activeScenario === scen.id ? (
                  <><span className="material-symbols-outlined text-[16px] animate-pulse">stop</span> Stop Simulation</>
                ) : (
                  <><span className="material-symbols-outlined text-[16px]">play_arrow</span> Dispatch Scenario</>
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
