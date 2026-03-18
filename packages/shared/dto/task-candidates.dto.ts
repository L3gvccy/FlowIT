export interface ITaskCandidate {
  employeeId: string;
  userId: string;
  fullName: string;
  email: string;
  role: "OWNER" | "MANAGER" | "EMPLOYEE";
  kpi: number;

  score: number;

  skillMatch: number;
  experienceScore: number;
  performanceScore: number;

  loadFactor: number;
  penalty: number;

  matchedSkillsCount: number;
  totalRequiredSkillsCount: number;

  completedSimilarTasks: number;
  maxCompletedTasks: number;

  busyTimeWindow: number;
  estimatedTime: number;
  availableTimeWindow: number;
  daysUntilDeadline: number;
}

export interface ITaskCandidatesResponse {
  taskId: string;
  taskTitle: string;
  candidates: ITaskCandidate[];
}
