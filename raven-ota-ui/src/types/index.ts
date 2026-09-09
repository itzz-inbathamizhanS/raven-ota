export type AssuranceState = "NORMAL" | "WARNING" | "DEGRADED" | "UNSAFE";

export type ResponseAction = 
  | "CONTINUE" 
  | "MONITOR" 
  | "REDUCE_NON_CRITICAL_WORKLOAD" 
  | "ISOLATE_FUNCTION" 
  | "ENTER_DEGRADED_MODE" 
  | "DELAY_OTA" 
  | "ROLLBACK";

export interface VehicleContext {
  dominantWorkload: string;
  environmentalCondition: string;
  roadType: string;
}

export interface TelemetrySample {
  timestamp: string;
  cpuUtilization: number;
  canBusLoad: number;
  taskJitter: number;
  ecuTemp: number;
}

export interface SafetyMargin {
  metric: string;
  value: number;
  threshold: number;
  marginPercent: number;
  status: AssuranceState;
}

export interface Prediction {
  timeToBoundarySeconds: number;
  confidence: number;
  predictedConstraint: string;
}

export interface Vehicle {
  id: string;
  model: string;
  softwareVersion: string;
  assuranceState: AssuranceState;
  envelopeMargin: number;
  dominantConstraint: string | null;
  context: VehicleContext;
  currentTelemetry: TelemetrySample;
  margins: SafetyMargin[];
  prediction: Prediction | null;
  activeMitigation: ResponseAction | null;
}

export interface OTAUpdate {
  id: string;
  version: string;
  releaseDate: string;
  type: string;
  status: "DRAFT" | "VERIFYING" | "VERIFIED" | "ROLLING_OUT" | "COMPLETED" | "HALTED";
  rolloutPercentage: number;
  targetVehicles: number;
  verificationArtifactId: string;
}

export interface VerificationArtifact {
  id: string;
  otaId: string;
  hashDigest: string;
  signatureValidity: boolean;
  asilLevel: string;
  formalInvariant: string;
}

export interface SafetyEnvelope {
  id: string;
  artifactRef: string;
  maxCpuUtilization: number;
  maxCanBusLoad: number;
  maxTaskJitter: number;
  maxEcuTemp: number;
  temporalBoundaries: Record<string, number>;
}

export interface Incident {
  id: string;
  timestamp: string;
  vehicleId: string;
  otaVersion: string;
  severity: AssuranceState;
  constraintViolated: string;
  mitigationAction: ResponseAction;
  resolved: boolean;
}

export interface EvidenceRecord {
  incidentId: string;
  vehicleId: string;
  softwareVersion: string;
  verificationArtifact: VerificationArtifact;
  safetyEnvelope: SafetyEnvelope;
  telemetry: TelemetrySample[];
  context: VehicleContext;
  margins: SafetyMargin[];
  prediction: Prediction;
  assuranceDecision: AssuranceState;
  response: ResponseAction;
  postResponseVerification: {
    restored: boolean;
    margin: number;
  };
  evidenceChain: string[];
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  category: "Nominal" | "Stress" | "Anomaly";
}
