import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { OTAService } from "../services/api";
import type { OTAUpdate, VerificationArtifact, SafetyEnvelope } from "../types";

export const OTADetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<OTAUpdate | null>(null);
  const [artifact, setArtifact] = useState<VerificationArtifact | null>(null);
  const [envelope, setEnvelope] = useState<SafetyEnvelope | null>(null);

  useEffect(() => {
    if (id) {
      OTAService.getCampaignById(id).then(c => {
        if (c) {
          setCampaign(c);
          OTAService.getVerificationArtifact(c.verificationArtifactId).then(a => setArtifact(a || null));
          OTAService.getSafetyEnvelope(`ENV-${c.verificationArtifactId.split('-')[1]}`).then(e => setEnvelope(e || null));
        }
      });
    }
  }, [id]);

  if (!campaign) return <div className="p-space-xl font-code-md">Loading OTA details...</div>;

  return (
    <div className="flex flex-col w-full px-margin-desktop py-space-xl bg-surface min-h-full gap-space-xl">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-space-xs">
          <span className="font-code-md text-code-md text-secondary uppercase tracking-widest flex items-center gap-space-sm">
            PIPELINE STAGE 01 OF 10 <span className="text-outline-variant">|</span> DOMAIN: CLOUD / VEHICLE GATEWAY
          </span>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">OTA Update Payload Composition</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mt-space-xs">
            Deployment bundle packaging delta differential firmware updates, AUTOSAR task priority tables, and execution constraint contracts targeting the heterogeneous vehicle HPC compute partition.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
        {/* Left: Verification Evidence */}
        <div className="p-space-xl bg-surface-container-low rounded-DEFAULT border border-outline-variant shadow-sm flex flex-col gap-space-lg">
          <div>
            <h2 className="font-headline-lg text-headline-lg">Verification Artifact</h2>
            <p className="font-code-md text-code-md text-secondary mt-1">ID: {artifact?.id} • ISO-26262 ASIL-D Validated</p>
          </div>

          <div className="flex flex-col gap-space-sm">
            <div className="flex justify-between border-b border-outline-variant pb-space-xs">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Formal Invariant</span>
              <span className="font-body-sm text-body-sm text-on-surface">{artifact?.formalInvariant}</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant pb-space-xs">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Image Hash Digest</span>
              <span className="font-code-md text-code-md text-on-surface">{artifact?.hashDigest}</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant pb-space-xs">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Execution Latency Valid</span>
              <span className="font-code-md text-code-md text-[#2d6a4f] flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check_circle</span> Verified</span>
            </div>
          </div>

          <div className="mt-auto pt-space-md">
            <button 
              onClick={() => window.alert('Z3 SMT Theorem Proof visualization is currently active in terminal only.')}
              className="w-full py-space-sm bg-surface-container hover:bg-surface-container-high text-on-surface font-title-sm text-title-sm rounded-DEFAULT transition-colors border border-outline-variant flex items-center justify-center gap-space-xs"
            >
              <span>View Z3 SMT Theorem Proof</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </button>
            <p className="font-label-sm text-label-sm text-center text-secondary mt-space-sm">Verified against UNECE WP.29 R156</p>
          </div>
        </div>

        {/* Right: Runtime Data Contract Schema */}
        <div className="p-space-xl bg-surface rounded-DEFAULT border border-outline-variant shadow-sm flex flex-col gap-space-md">
          <div className="flex justify-between items-center">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Runtime Data Contract Schema</span>
            <span className="font-code-md text-code-md text-secondary">JSON-LD / ASN.1</span>
          </div>

          <div className="flex-1 bg-[#eaeae6] p-space-md rounded-DEFAULT font-code-md text-code-md text-on-surface-variant whitespace-pre overflow-x-auto border border-outline-variant">
{`{
  "update_uuid": "${artifact?.hashDigest.split('-')[0] || 'f89d31-4891-a6ce'}",
  "target_ecu": "ADAS_CORE_HPC_8",
  "partition": "SLOT_B_INACTIVE",
  "signature": "ECDSA_P384_SHA384",
  "declared_wcet_ms": 38.5,
  "max_memory_kb": 262144,
  "bus_bandwidth_cap_mbps": ${envelope?.maxCanBusLoad || 40.0},
  "fallback_target": "SLOT_A_REVERT"
}`}
          </div>

          <div className="pt-space-sm border-t border-outline-variant flex justify-between items-center text-[#2d6a4f] font-code-md text-code-md">
            <span className="text-[11px] leading-tight text-secondary">Deterministic formal parser validation status:</span>
            <span>VALIDATED AGAINST Z3 SPECIFICATION</span>
          </div>
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="mt-space-lg text-center">
        <span className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
          RAVEN-OTA is a research prototype. Formal verification evidence shown is deterministic mock data.
        </span>
      </div>
    </div>
  );
};
