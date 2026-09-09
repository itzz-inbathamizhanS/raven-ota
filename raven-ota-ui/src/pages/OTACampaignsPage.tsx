import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { OTAService } from "../services/api";
import type { OTAUpdate } from "../types";

export const OTACampaignsPage = () => {
  const [campaigns, setCampaigns] = useState<OTAUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    OTAService.getCampaigns().then(data => {
      setCampaigns(data);
      setLoading(false);
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case "VERIFIED": return "bg-[#eef6f2] text-[#2d6a4f] border-[#b7dec9]";
      case "ROLLING_OUT": return "bg-[#fdf7ed] text-[#b45309] border-[#f5d399]";
      case "COMPLETED": return "bg-surface-container text-on-surface border-outline-variant";
      default: return "bg-surface-container text-on-surface border-outline-variant";
    }
  };

  return (
    <div className="flex flex-col w-full px-margin-desktop py-space-xl bg-surface min-h-full gap-space-xl">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-space-xs">
          <span className="font-code-md text-code-md text-secondary uppercase tracking-widest">
            OTA DEPLOYMENT & FORMAL VERIFICATION
          </span>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">OTA Campaigns</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mt-space-xs">
            Manage over-the-air software updates, cryptographically signed verification artifacts, and runtime safety envelopes.
          </p>
        </div>
        <div className="flex flex-col items-end gap-space-sm">
          <button 
            onClick={() => window.alert('Deploying active OTA payload to selected fleet segments...')}
            className="px-space-md py-space-xs bg-primary hover:bg-tertiary-container transition-colors text-on-primary font-title-sm text-title-sm rounded-DEFAULT flex items-center gap-space-xs shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
            Deploy Update
          </button>
        </div>
      </div>

      <div className="flex gap-space-md items-center py-space-xs">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-secondary text-[18px]">search</span>
          <input 
            type="text" 
            placeholder="Search campaigns by ID, version, or artifact hash..." 
            className="w-full pl-10 pr-space-sm py-space-xs bg-surface border border-outline-variant rounded-DEFAULT font-body-sm text-body-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="w-full bg-surface-container-low rounded-DEFAULT p-space-lg shadow-sm border border-outline-variant flex flex-col gap-space-md">
        <div className="flex justify-between items-end mb-space-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface">Deployment Ledger</h2>
          <span className="font-code-md text-code-md text-secondary">3 Active Records</span>
        </div>
        
        <div className="overflow-x-auto w-full bg-surface border border-outline-variant rounded-DEFAULT">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="p-space-md font-label-md text-label-md text-secondary tracking-widest uppercase">Campaign ID</th>
                <th className="p-space-md font-label-md text-label-md text-secondary tracking-widest uppercase">Version</th>
                <th className="p-space-md font-label-md text-label-md text-secondary tracking-widest uppercase">Type</th>
                <th className="p-space-md font-label-md text-label-md text-secondary tracking-widest uppercase">Verification Status</th>
                <th className="p-space-md font-label-md text-label-md text-secondary tracking-widest uppercase">Rollout</th>
                <th className="p-space-md font-label-md text-label-md text-secondary tracking-widest uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-space-lg text-center text-secondary font-code-md">Loading ledger...</td></tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                    <td className="p-space-md font-code-md text-code-md text-on-surface font-medium">{c.id}</td>
                    <td className="p-space-md font-code-md text-code-md text-on-surface-variant">{c.version}</td>
                    <td className="p-space-md font-body-sm text-body-sm text-on-surface-variant">{c.type}</td>
                    <td className="p-space-md font-label-sm text-label-sm uppercase">
                      <span className={`inline-flex px-2 py-1 border rounded-[2px] ${getStatusColor(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-space-md">
                      <div className="flex items-center gap-space-sm w-32">
                        <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${c.rolloutPercentage}%` }}></div>
                        </div>
                        <span className="font-code-md text-code-md text-secondary min-w-[3ch] text-right">{c.rolloutPercentage}%</span>
                      </div>
                    </td>
                    <td className="p-space-md text-right">
                      <Link 
                        to={`/ota/${c.id}`}
                        className="font-title-sm text-title-sm text-on-surface hover:text-primary transition-colors inline-flex items-center gap-1"
                      >
                        Inspect Full Envelope <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
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
