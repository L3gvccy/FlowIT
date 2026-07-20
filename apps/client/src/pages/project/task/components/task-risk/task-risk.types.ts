export type TaskRiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface TaskRiskFactor {
  key: "workload" | "skillMismatch" | "complexity" | "deadline" | "lowKpi";
  name: string;
  value: number;
  weight: number;
  contribution: number;
}

export interface TaskRiskMetrics {
  activeAssignments: number;
  busyHours: number;
  availableHours: number;
  daysUntilDeadline: number;
  matchedSkills: number;
  requiredSkills: number;
  kpi: number;
}

export interface TaskRiskResponse {
  taskId: string;
  employeeId: string;
  riskScore: number;
  riskValue: number;
  riskLevel: TaskRiskLevel;
  factors: TaskRiskFactor[];
  metrics: TaskRiskMetrics;
  reasons: string[];
}
