import { MOCK_SCENARIOS, MOCK_EVIDENCE_RECORD } from "../data/mockData";
import type { Vehicle, OTAUpdate, Incident, SimulationScenario, EvidenceRecord, VerificationArtifact, SafetyEnvelope } from "../types";

const API_BASE_URL = "http://localhost:8000/api/v1";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const VehicleService = {
  getVehicles: async (): Promise<Vehicle[]> => {
    const res = await fetch(`${API_BASE_URL}/vehicles`);
    return res.json();
  },
  getVehicleById: async (id: string): Promise<Vehicle | undefined> => {
    const res = await fetch(`${API_BASE_URL}/vehicles/${id}`);
    if (!res.ok) return undefined;
    return res.json();
  }
};

export const OTAService = {
  getCampaigns: async (): Promise<OTAUpdate[]> => {
    const res = await fetch(`${API_BASE_URL}/ota`);
    return res.json();
  },
  getCampaignById: async (id: string): Promise<OTAUpdate | undefined> => {
    const res = await fetch(`${API_BASE_URL}/ota/${id}`);
    if (!res.ok) return undefined;
    return res.json();
  },
  getVerificationArtifact: async (id: string): Promise<VerificationArtifact | undefined> => {
    const res = await fetch(`${API_BASE_URL}/verification/${id}`);
    if (!res.ok) return undefined;
    return res.json();
  },
  getSafetyEnvelope: async (id: string): Promise<SafetyEnvelope | undefined> => {
    const res = await fetch(`${API_BASE_URL}/envelopes/${id}`);
    if (!res.ok) return undefined;
    return res.json();
  }
};

export const IncidentService = {
  getIncidents: async (): Promise<Incident[]> => {
    const res = await fetch(`${API_BASE_URL}/incidents`);
    return res.json();
  },
  getEvidenceRecord: async (incidentId: string): Promise<EvidenceRecord> => {
    const res = await fetch(`${API_BASE_URL}/analytics/evidence/${incidentId}`);
    if (!res.ok) return MOCK_EVIDENCE_RECORD;
    return res.json();
  }
};

export const SimulatorService = {
  getScenarios: async (): Promise<SimulationScenario[]> => {
    await delay(200);
    return MOCK_SCENARIOS;
  },
  startSimulator: async (): Promise<void> => {
    await fetch(`${API_BASE_URL}/simulator/start`, { method: "POST" });
  },
  stopSimulator: async (): Promise<void> => {
    await fetch(`${API_BASE_URL}/simulator/stop`, { method: "POST" });
  }
};
