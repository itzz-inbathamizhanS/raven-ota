import type { Vehicle, OTAUpdate, Incident, SimulationScenario, EvidenceRecord, VerificationArtifact, SafetyEnvelope } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  return response.json() as Promise<T>;
}

export const VehicleService = {
  getVehicles: async (): Promise<Vehicle[]> => {
    try { return await request<Vehicle[]>("/vehicles"); } catch { return []; }
  },
  getVehicleById: async (id: string): Promise<Vehicle | undefined> => {
    try { return await request<Vehicle>(`/vehicles/${id}`); } catch { return undefined; }
  }
};

export const OTAService = {
  getCampaigns: async (): Promise<OTAUpdate[]> => {
    try { return await request<OTAUpdate[]>("/ota"); } catch { return []; }
  },
  getCampaignById: async (id: string): Promise<OTAUpdate | undefined> => {
    try { return await request<OTAUpdate>(`/ota/${id}`); } catch { return undefined; }
  },
  getVerificationArtifact: async (id: string): Promise<VerificationArtifact | undefined> => {
    try { return await request<VerificationArtifact>(`/verification/${id}`); } catch { return undefined; }
  },
  getSafetyEnvelope: async (id: string): Promise<SafetyEnvelope | undefined> => {
    try { return await request<SafetyEnvelope>(`/envelopes/${id}`); } catch { return undefined; }
  }
};

export const IncidentService = {
  getIncidents: async (): Promise<Incident[]> => {
    try { return await request<Incident[]>("/incidents"); } catch { return []; }
  },
  getEvidenceRecord: async (incidentId: string): Promise<EvidenceRecord> => {
    return request<EvidenceRecord>(`/analytics/evidence/${incidentId}`);
  }
};

export const SimulatorService = {
  getScenarios: async (): Promise<SimulationScenario[]> => {
    return request<SimulationScenario[]>("/simulator/scenarios");
  },
  startSimulator: async (scenarioId: string): Promise<void> => {
    await request("/simulator/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenarioId }),
    });
  },
  stopSimulator: async (): Promise<void> => {
    await request("/simulator/stop", { method: "POST" });
  }
};

export const AssuranceService = {
  triggerMitigation: (vehicleId: string) => request(`/mitigation/${vehicleId}`, { method: "POST" }),
};
