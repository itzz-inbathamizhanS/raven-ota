import { useState, useEffect } from "react";
import { IncidentService } from "../services/api";
import type { Incident } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";

export const IncidentsPage = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    IncidentService.getIncidents().then(data => {
      setIncidents(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col w-full px-margin-desktop py-space-xl bg-surface min-h-full gap-space-xl">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-space-xs">
          <span className="font-code-md text-code-md text-secondary uppercase tracking-widest">
            HISTORICAL AUDIT & INVESTIGATION
          </span>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Incidents & Evidence</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mt-space-xs">
            Review past boundary violations, executed mitigations, and the full cryptographic evidence chain validating the runtime assurance response.
          </p>
        </div>
      </div>

      <div className="w-full bg-surface-container-low rounded-DEFAULT p-space-lg shadow-sm border border-outline-variant flex flex-col gap-space-md">
        <div className="flex justify-between items-end mb-space-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface">Incident Ledger</h2>
          <span className="font-code-md text-code-md text-secondary">{incidents.length} Records Found</span>
        </div>
        
        <div className="overflow-x-auto w-full bg-surface border border-outline-variant rounded-DEFAULT">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="p-space-md font-label-md text-label-md text-secondary tracking-widest uppercase">ID / Time</th>
                <th className="p-space-md font-label-md text-label-md text-secondary tracking-widest uppercase">Vehicle / OTA</th>
                <th className="p-space-md font-label-md text-label-md text-secondary tracking-widest uppercase">Severity</th>
                <th className="p-space-md font-label-md text-label-md text-secondary tracking-widest uppercase">Constraint Violated</th>
                <th className="p-space-md font-label-md text-label-md text-secondary tracking-widest uppercase">Mitigation Executed</th>
                <th className="p-space-md font-label-md text-label-md text-secondary tracking-widest uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-space-lg text-center text-secondary font-code-md">Loading ledger...</td></tr>
              ) : (
                incidents.map((inc) => (
                  <tr key={inc.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                    <td className="p-space-md">
                      <div className="flex flex-col">
                        <span className="font-code-md text-code-md text-on-surface font-medium">{inc.id}</span>
                        <span className="font-body-sm text-body-sm text-secondary">{new Date(inc.timestamp).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-space-md">
                      <div className="flex flex-col">
                        <span className="font-code-md text-code-md text-on-surface">{inc.vehicleId}</span>
                        <span className="font-body-sm text-body-sm text-secondary">{inc.otaVersion}</span>
                      </div>
                    </td>
                    <td className="p-space-md">
                      <StatusBadge status={inc.severity} />
                    </td>
                    <td className="p-space-md font-body-sm text-body-sm text-on-surface-variant max-w-xs">{inc.constraintViolated}</td>
                    <td className="p-space-md font-code-md text-code-md text-on-surface">{inc.mitigationAction}</td>
                    <td className="p-space-md">
                      <span className={`font-label-sm text-label-sm uppercase flex items-center gap-1 ${inc.resolved ? 'text-[#2d6a4f]' : 'text-[#b45309]'}`}>
                        <span className="material-symbols-outlined text-[16px]">{inc.resolved ? 'check_circle' : 'pending'}</span>
                        {inc.resolved ? 'RESOLVED' : 'ACTIVE'}
                      </span>
                    </td>
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
