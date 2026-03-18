import { Injectable } from "@nestjs/common";

interface IScoreInput {
  requiredSkillIds: string[];
  userSkillIds: string[];

  completedSimilarTasks: number;
  maxCompletedTasks: number;

  kpi: number;
  maxKpi: number;

  estimatedTime: number;
  busyTimeWindow: number;
  availableTimeWindow: number;
}

@Injectable()
export class TaskScoreService {
  private readonly w1 = 0.5;
  private readonly w2 = 0.2;
  private readonly w3 = 0.3;
  private readonly lambda = 0.4;

  calculateCandidateScore(input: IScoreInput) {
    const {
      requiredSkillIds,
      userSkillIds,
      completedSimilarTasks,
      maxCompletedTasks,
      kpi,
      maxKpi,
      estimatedTime,
      busyTimeWindow,
      availableTimeWindow,
    } = input;

    const skillMatchData = this.calculateSkillMatch(
      requiredSkillIds,
      userSkillIds,
    );
    const experienceScore = this.calculateExperienceScore(
      completedSimilarTasks,
      maxCompletedTasks,
    );
    const performanceScore = this.calculatePerformanceScore(kpi, maxKpi);
    const loadFactor = this.calculateLoadFactor(
      estimatedTime,
      busyTimeWindow,
      availableTimeWindow,
    );
    const penalty = this.calculatePenalty(loadFactor);

    const score =
      this.w1 * skillMatchData.value +
      this.w2 * experienceScore +
      this.w3 * performanceScore -
      penalty;

    return {
      score: Number(score.toFixed(4)),
      skillMatch: Number(skillMatchData.value.toFixed(4)),
      experienceScore: Number(experienceScore.toFixed(4)),
      performanceScore: Number(performanceScore.toFixed(4)),
      loadFactor: Number(loadFactor.toFixed(4)),
      penalty: Number(penalty.toFixed(4)),
      matchedSkillsCount: skillMatchData.matchedSkillsCount,
      totalRequiredSkillsCount: skillMatchData.totalRequiredSkillsCount,
    };
  }

  private calculateSkillMatch(
    requiredSkillIds: string[],
    userSkillIds: string[],
  ) {
    if (!requiredSkillIds.length) {
      return {
        value: 1,
        matchedSkillsCount: 0,
        totalRequiredSkillsCount: 0,
      };
    }

    const userSkillSet = new Set(userSkillIds);

    const matchedSkillsCount = requiredSkillIds.filter((skillId) =>
      userSkillSet.has(skillId),
    ).length;

    return {
      value: matchedSkillsCount / requiredSkillIds.length,
      matchedSkillsCount,
      totalRequiredSkillsCount: requiredSkillIds.length,
    };
  }

  private calculateExperienceScore(
    completedSimilarTasks: number,
    maxCompletedTasks: number,
  ) {
    if (maxCompletedTasks <= 0) return 0;
    return completedSimilarTasks / maxCompletedTasks;
  }

  private calculatePerformanceScore(kpi: number, maxKpi: number) {
    if (maxKpi <= 0) return 0;
    return kpi / maxKpi;
  }

  private calculateLoadFactor(
    estimatedTime: number,
    busyTimeWindow: number,
    availableTimeWindow: number,
  ) {
    if (availableTimeWindow <= 0) return Number.POSITIVE_INFINITY;
    return (busyTimeWindow + estimatedTime) / availableTimeWindow;
  }

  private calculatePenalty(loadFactor: number) {
    return this.lambda * Math.pow(Math.max(0, loadFactor - 1), 2);
  }
}
