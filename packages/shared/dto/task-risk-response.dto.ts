import type { employeeRole } from "../types/employee-role";

export type TaskRiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface TaskRiskFactorDto {
  key: "workload" | "skillMismatch" | "complexity" | "deadline" | "lowKpi";
  name: string;
  value: number;
  weight: number;
  contribution: number;
}

export interface TaskRiskMetricsDto {
  activeAssignments: number;
  busyHours: number;
  availableHours: number;
  daysUntilDeadline: number;
  matchedSkills: number;
  requiredSkills: number;
  kpi: number;
}

export interface TaskRiskCandidateDto {
  employeeId: string;
  userId: string;
  fullName: string;
  email: string;
  role: employeeRole;
  kpi: number;
  riskScore: number;
  riskValue: number;
  riskLevel: TaskRiskLevel;
  factors: TaskRiskFactorDto[];
  metrics: TaskRiskMetricsDto;
  reasons: string[];
}

export interface TaskRiskResponseDto {
  taskId: string;
  taskTitle: string;
  assignedEmployeeId: string | null;
  assignedRisk: TaskRiskCandidateDto | null;
  candidates: TaskRiskCandidateDto[];
}
