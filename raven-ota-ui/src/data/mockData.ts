import type { Vehicle, OTAUpdate, Incident, SimulationScenario, SafetyEnvelope, VerificationArtifact, EvidenceRecord } from "../types";

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: "RAVEN-017",
    model: "Prototype Sedan Alpha",
    softwareVersion: "v4.8.2-rt-patch4",
    assuranceState: "WARNING",
    envelopeMargin: 3.0,
    dominantConstraint: "CPU Contention",
    context: {
      dominantWorkload: "High ADAS Perception Load",
      environmentalCondition: "Wet Urban Merge",
      roadType: "Urban",
    },
    currentTelemetry: {
      timestamp: new Date().toISOString(),
      cpuUtilization: 82.0,
      canBusLoad: 61.4,
      taskJitter: 1.12,
      ecuTemp: 68.5,
    },
    margins: [
      { metric: "CPU Core Load", value: 82.0, threshold: 85.0, marginPercent: 3.0, status: "WARNING" },
      { metric: "CAN 1 Bus Load", value: 61.4, threshold: 80.0, marginPercent: 18.6, status: "NORMAL" },
      { metric: "Task Jitter", value: 1.12, threshold: 2.50, marginPercent: 55.2, status: "NORMAL" },
      { metric: "SoC Thermal Temp", value: 68.5, threshold: 92.0, marginPercent: 25.5, status: "NORMAL" },
    ],
    prediction: {
      timeToBoundarySeconds: 42,
      confidence: 0.994,
      predictedConstraint: "inv_temporal_sched_bound",
    },
    activeMitigation: "REDUCE_NON_CRITICAL_WORKLOAD",
  },
  {
    id: "RAVEN-021",
    model: "Validation SUV Beta",
    softwareVersion: "v4.8.2",
    assuranceState: "NORMAL",
    envelopeMargin: 12.4,
    dominantConstraint: null,
    context: {
      dominantWorkload: "Normal Highway Cruising",
      environmentalCondition: "Clear",
      roadType: "Highway",
    },
    currentTelemetry: {
      timestamp: new Date().toISOString(),
      cpuUtilization: 45.2,
      canBusLoad: 32.1,
      taskJitter: 0.45,
      ecuTemp: 52.1,
    },
    margins: [
      { metric: "CPU Core Load", value: 45.2, threshold: 85.0, marginPercent: 46.8, status: "NORMAL" },
    ],
    prediction: null,
    activeMitigation: null,
  },
  {
    id: "RAVEN-009",
    model: "Fleet Mule IV",
    softwareVersion: "v4.8.0",
    assuranceState: "DEGRADED",
    envelopeMargin: 1.8,
    dominantConstraint: "CAN Bus Bandwidth",
    context: {
      dominantWorkload: "High Bandwidth Logging Active",
      environmentalCondition: "Clear",
      roadType: "Test Track",
    },
    currentTelemetry: {
      timestamp: new Date().toISOString(),
      cpuUtilization: 60.1,
      canBusLoad: 78.2,
      taskJitter: 1.8,
      ecuTemp: 58.0,
    },
    margins: [
      { metric: "CAN 1 Bus Load", value: 78.2, threshold: 80.0, marginPercent: 1.8, status: "DEGRADED" },
    ],
    prediction: {
      timeToBoundarySeconds: 15,
      confidence: 0.88,
      predictedConstraint: "inv_bus_saturation",
    },
    activeMitigation: "ISOLATE_FUNCTION",
  },
  {
    id: "RAVEN-034",
    model: "Autonomous Cab Gen2",
    softwareVersion: "v4.8.2",
    assuranceState: "UNSAFE",
    envelopeMargin: 0.0,
    dominantConstraint: "Task Jitter Exceeded",
    context: {
      dominantWorkload: "Thermal Soak / Low Speed Urban",
      environmentalCondition: "Hot",
      roadType: "Urban",
    },
    currentTelemetry: {
      timestamp: new Date().toISOString(),
      cpuUtilization: 72.0,
      canBusLoad: 55.0,
      taskJitter: 2.8,
      ecuTemp: 88.5,
    },
    margins: [
      { metric: "Task Jitter", value: 2.8, threshold: 2.5, marginPercent: -12.0, status: "UNSAFE" },
    ],
    prediction: {
      timeToBoundarySeconds: 0,
      confidence: 1.0,
      predictedConstraint: "inv_jitter_bound",
    },
    activeMitigation: "ENTER_DEGRADED_MODE",
  },
  {
    id: "RAVEN-102",
    model: "High-Mileage Mule II",
    softwareVersion: "v4.7.9",
    assuranceState: "NORMAL",
    envelopeMargin: 18.9,
    dominantConstraint: null,
    context: {
      dominantWorkload: "Proving Ground Low Dynamics",
      environmentalCondition: "Clear",
      roadType: "Test Track",
    },
    currentTelemetry: {
      timestamp: new Date().toISOString(),
      cpuUtilization: 35.0,
      canBusLoad: 25.0,
      taskJitter: 0.2,
      ecuTemp: 45.0,
    },
    margins: [
      { metric: "CPU Core Load", value: 35.0, threshold: 85.0, marginPercent: 58.8, status: "NORMAL" },
    ],
    prediction: null,
    activeMitigation: null,
  }
];

export const MOCK_OTA_CAMPAIGNS: OTAUpdate[] = [
  {
    id: "OTA-2026-041",
    version: "v4.8.2",
    releaseDate: "2026-08-15T00:00:00Z",
    type: "Critical Safety / ADAS Perception",
    status: "ROLLING_OUT",
    rolloutPercentage: 87.2,
    targetVehicles: 15420,
    verificationArtifactId: "VER-8821",
  },
  {
    id: "OTA-2026-042",
    version: "v4.8.3",
    releaseDate: "2026-09-01T00:00:00Z",
    type: "Thermal Management Tuning",
    status: "VERIFIED",
    rolloutPercentage: 0,
    targetVehicles: 15420,
    verificationArtifactId: "VER-8822",
  },
  {
    id: "OTA-2026-040",
    version: "v4.8.1",
    releaseDate: "2026-07-10T00:00:00Z",
    type: "Infotainment / Telematics",
    status: "COMPLETED",
    rolloutPercentage: 100,
    targetVehicles: 15200,
    verificationArtifactId: "VER-8810",
  }
];

export const MOCK_VERIFICATION_ARTIFACTS: Record<string, VerificationArtifact> = {
  "VER-8821": {
    id: "VER-8821",
    otaId: "OTA-2026-041",
    hashDigest: "f89d31-4891-a6ce...",
    signatureValidity: true,
    asilLevel: "ASIL-D",
    formalInvariant: "Signature Validity & Image Hash Digest Validated against Z3 Specification",
  }
};

export const MOCK_SAFETY_ENVELOPES: Record<string, SafetyEnvelope> = {
  "ENV-8821": {
    id: "ENV-8821",
    artifactRef: "VER-8821",
    maxCpuUtilization: 85.0,
    maxCanBusLoad: 80.0,
    maxTaskJitter: 2.5,
    maxEcuTemp: 92.0,
    temporalBoundaries: {
      "ADAS_CORE_HPC_8": 38.5,
    }
  }
};

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: "INC-2026-8941",
    timestamp: "2026-09-09T14:32:08Z",
    vehicleId: "RAVEN-034",
    otaVersion: "v4.8.2",
    severity: "UNSAFE",
    constraintViolated: "Task Jitter Exceeded (2.8ms > 2.5ms)",
    mitigationAction: "ENTER_DEGRADED_MODE",
    resolved: false,
  },
  {
    id: "INC-2026-8940",
    timestamp: "2026-09-08T10:15:00Z",
    vehicleId: "RAVEN-009",
    otaVersion: "v4.8.0",
    severity: "DEGRADED",
    constraintViolated: "CAN Bus Bandwidth (78.2% > 75.0% soft limit)",
    mitigationAction: "ISOLATE_FUNCTION",
    resolved: true,
  }
];

export const MOCK_SCENARIOS: SimulationScenario[] = [
  { id: "SCEN-01", name: "Normal Operation", description: "Nominal highway cruising with stable workloads.", category: "Nominal" },
  { id: "SCEN-02", name: "CPU Contention", description: "Heavy ADAS perception load competing with telematics.", category: "Stress" },
  { id: "SCEN-03", name: "Network Congestion", description: "CAN bus saturation from redundant sensor logging.", category: "Stress" },
  { id: "SCEN-04", name: "Timing Degradation", description: "Progressive task jitter increase due to RTOS scheduling.", category: "Anomaly" },
  { id: "SCEN-05", name: "Thermal Stress", description: "High SoC temperature causing thermal throttling.", category: "Stress" },
  { id: "SCEN-06", name: "ADAS Workload Surge", description: "Sudden dense urban pedestrian tracking requirements.", category: "Stress" },
  { id: "SCEN-07", name: "Combined Stress", description: "Thermal soak + CPU contention.", category: "Stress" },
  { id: "SCEN-08", name: "Benign Anomaly", description: "Brief spike in telemetry that self-corrects without intervention.", category: "Anomaly" },
  { id: "SCEN-09", name: "Persistent Critical", description: "Sustained constraint violation requiring hard mitigation.", category: "Anomaly" },
  { id: "SCEN-10", name: "Campaign-Wide Pattern", description: "Simulates fleet-wide correlation of a specific warning state.", category: "Anomaly" },
];

export const MOCK_EVIDENCE_RECORD: EvidenceRecord = {
  incidentId: "INC-2026-8941",
  vehicleId: "RAVEN-034",
  softwareVersion: "v4.8.2-rt-patch4",
  verificationArtifact: MOCK_VERIFICATION_ARTIFACTS["VER-8821"],
  safetyEnvelope: MOCK_SAFETY_ENVELOPES["ENV-8821"],
  telemetry: [MOCK_VEHICLES[3].currentTelemetry],
  context: MOCK_VEHICLES[3].context,
  margins: MOCK_VEHICLES[3].margins,
  prediction: MOCK_VEHICLES[3].prediction!,
  assuranceDecision: "UNSAFE",
  response: "ENTER_DEGRADED_MODE",
  postResponseVerification: {
    restored: true,
    margin: 15.2
  },
  evidenceChain: [
    "01. ARTIFACT SIGNED",
    "02. ENVELOPE BOUNDED",
    "03. TELEMETRY PERIODIC",
    "04. MARGIN CRITICAL",
    "05. PREDICTION BREACH",
    "06. RESPONSE EXECUTED",
    "07. RESTORATION VERIFIED"
  ]
};
