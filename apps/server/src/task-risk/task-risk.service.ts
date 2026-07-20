import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  ACTIVE_ASSIGNMENT_STATUSES,
  TASK_RISK_CONFIG,
  TASK_RISK_THRESHOLDS,
  TASK_RISK_WEIGHTS,
} from "./task-risk.constants";
import type {
  TaskRiskFactorDto,
  TaskRiskLevel,
  TaskRiskResponseDto,
} from "@flowit/shared";

@Injectable()
export class TaskRiskService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateTaskRisk(
    userId: string,
    projectId: string,
    taskId: string,
  ): Promise<TaskRiskResponseDto> {
    const projectEmployee = await this.prisma.employee.findUnique({
      where: { userId_projectId: { userId, projectId } },
      select: { id: true },
    });

    if (!projectEmployee) {
      throw new ForbiddenException("Дія заборонена");
    }

    const task = await this.prisma.task.findFirst({
      where: { id: taskId, projectId },
      include: {
        taskSkills: {
          select: { skillId: true },
        },
        assignment: {
          include: {
            employee: {
              include: {
                user: {
                  include: {
                    userSkills: {
                      select: { skillId: true },
                    },
                  },
                },
                assignments: {
                  where: {
                    taskId: { not: taskId },
                    status: { in: ACTIVE_ASSIGNMENT_STATUSES },
                  },
                  include: {
                    task: {
                      select: {
                        complexity: true,
                        deadline: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException("Задача не знайдена");
    }

    if (!task.assignment) {
      throw new BadRequestException(
        "Неможливо оцінити ризик задачі без призначеного виконавця",
      );
    }

    const employee = task.assignment.employee;
    const requiredSkillIds = task.taskSkills.map(({ skillId }) => skillId);
    const userSkillIds = employee.user.userSkills.map(({ skillId }) => skillId);
    const matchedSkills = this.countMatchedSkills(
      requiredSkillIds,
      userSkillIds,
    );

    const skillMatch = requiredSkillIds.length
      ? matchedSkills / requiredSkillIds.length
      : 1;
    const skillMismatch = 1 - skillMatch;

    const overlappingAssignments = employee.assignments.filter(
      (assignment) => assignment.task.deadline <= task.deadline,
    );
    const busyHours = overlappingAssignments.reduce(
      (sum, assignment) =>
        sum + this.estimateTaskHours(assignment.task.complexity),
      0,
    );
    const estimatedTaskHours = this.estimateTaskHours(task.complexity);
    const daysUntilDeadline = this.calculateDaysUntilDeadline(task.deadline);
    const availableHours =
      Math.max(daysUntilDeadline, 1) * TASK_RISK_CONFIG.workingHoursPerDay;
    const workload = this.clamp(
      (busyHours + estimatedTaskHours) / availableHours,
    );

    const complexity = this.clamp((task.complexity - 1) / 4);
    const deadline = this.calculateDeadlineRisk(daysUntilDeadline);
    const kpi = this.clamp(Number(employee.kpi) / 100);
    const lowKpi = 1 - kpi;

    const factors = this.createFactors({
      workload,
      skillMismatch,
      complexity,
      deadline,
      lowKpi,
    });
    const riskScore =
      workload * TASK_RISK_WEIGHTS.workload +
      skillMismatch * TASK_RISK_WEIGHTS.skillMismatch +
      complexity * TASK_RISK_WEIGHTS.complexity +
      deadline * TASK_RISK_WEIGHTS.deadline +
      lowKpi * TASK_RISK_WEIGHTS.lowKpi;
    const roundedRiskScore = Number(riskScore.toFixed(4));

    return {
      taskId: task.id,
      employeeId: employee.id,
      riskScore: roundedRiskScore,
      riskValue: Math.round(roundedRiskScore * 100),
      riskLevel: this.getRiskLevel(roundedRiskScore),
      factors,
      metrics: {
        activeAssignments: overlappingAssignments.length,
        busyHours,
        availableHours,
        daysUntilDeadline,
        matchedSkills,
        requiredSkills: requiredSkillIds.length,
        kpi: Number(employee.kpi),
      },
      reasons: this.createReasons({
        workload,
        skillMismatch,
        complexity,
        deadline,
        lowKpi,
      }),
    };
  }

  private createFactors(values: {
    workload: number;
    skillMismatch: number;
    complexity: number;
    deadline: number;
    lowKpi: number;
  }): TaskRiskFactorDto[] {
    return [
      this.createFactor(
        "workload",
        "Навантаження",
        values.workload,
        TASK_RISK_WEIGHTS.workload,
      ),
      this.createFactor(
        "skillMismatch",
        "Невідповідність навичок",
        values.skillMismatch,
        TASK_RISK_WEIGHTS.skillMismatch,
      ),
      this.createFactor(
        "complexity",
        "Складність",
        values.complexity,
        TASK_RISK_WEIGHTS.complexity,
      ),
      this.createFactor(
        "deadline",
        "Терміновість",
        values.deadline,
        TASK_RISK_WEIGHTS.deadline,
      ),
      this.createFactor(
        "lowKpi",
        "Низький KPI",
        values.lowKpi,
        TASK_RISK_WEIGHTS.lowKpi,
      ),
    ];
  }

  private createFactor(
    key: TaskRiskFactorDto["key"],
    name: string,
    normalizedValue: number,
    weight: number,
  ): TaskRiskFactorDto {
    return {
      key,
      name,
      value: Math.round(normalizedValue * 100),
      weight,
      contribution: Number((normalizedValue * weight * 100).toFixed(2)),
    };
  }

  private createReasons(values: {
    workload: number;
    skillMismatch: number;
    complexity: number;
    deadline: number;
    lowKpi: number;
  }): string[] {
    const reasons: string[] = [];

    if (values.workload >= 0.65) {
      reasons.push("Високе поточне навантаження виконавця");
    }
    if (values.skillMismatch >= 0.3) {
      reasons.push("Навички виконавця не повністю відповідають вимогам задачі");
    }
    if (values.complexity >= 0.75) {
      reasons.push("Задача має високу складність");
    }
    if (values.deadline >= 0.65) {
      reasons.push("До завершення задачі залишилося мало часу");
    }
    if (values.lowKpi >= 0.4) {
      reasons.push("Поточний KPI виконавця є нижчим за рекомендований рівень");
    }

    return reasons;
  }

  private getRiskLevel(riskScore: number): TaskRiskLevel {
    if (riskScore >= TASK_RISK_THRESHOLDS.high) {
      return "HIGH";
    }
    if (riskScore >= TASK_RISK_THRESHOLDS.medium) {
      return "MEDIUM";
    }
    return "LOW";
  }

  private countMatchedSkills(
    requiredSkillIds: string[],
    userSkillIds: string[],
  ): number {
    const userSkillSet = new Set(userSkillIds);
    return requiredSkillIds.filter((skillId) => userSkillSet.has(skillId))
      .length;
  }

  private estimateTaskHours(complexity: number): number {
    return complexity * TASK_RISK_CONFIG.estimatedHoursPerComplexityPoint;
  }

  private calculateDaysUntilDeadline(deadline: Date): number {
    return Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  }

  private calculateDeadlineRisk(daysUntilDeadline: number): number {
    if (daysUntilDeadline <= 0) return 1;

    return this.clamp(
      1 - daysUntilDeadline / TASK_RISK_CONFIG.deadlineHorizonDays,
    );
  }

  private clamp(value: number): number {
    return Math.min(1, Math.max(0, value));
  }
}
