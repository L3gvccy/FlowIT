import { AssignmentStatus } from "src/generated/prisma/enums";

export const TASK_RISK_WEIGHTS = {
  workload: 0.25,
  skillMismatch: 0.25,
  complexity: 0.2,
  deadline: 0.2,
  lowKpi: 0.1,
} as const;

export const TASK_RISK_THRESHOLDS = {
  medium: 0.35,
  high: 0.65,
} as const;

export const TASK_RISK_CONFIG = {
  workingHoursPerDay: 8,
  estimatedHoursPerComplexityPoint: 4,
  deadlineHorizonDays: 14,
} as const;

export const ACTIVE_ASSIGNMENT_STATUSES: AssignmentStatus[] = [
  AssignmentStatus.CREATED,
  AssignmentStatus.IN_PROGRESS,
  AssignmentStatus.SUBMITTED,
  AssignmentStatus.REJECTED,
];
