import { useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";
import type {
  TaskRiskCandidateDto,
  TaskRiskResponseDto,
} from "@flowit/shared";
import { apiClient } from "@/utils/api-client";
import { GET_TASK_RISK_URL } from "@/utils/constants";
import TaskRiskChart from "./task-risk-chart";
import TaskRiskBadge from "./task-risk-badge";

interface TaskRiskAnalysisProps {
  projectId: string;
  taskId: string;
}

const TaskRiskAnalysis = ({ projectId, taskId }: TaskRiskAnalysisProps) => {
  const [risk, setRisk] = useState<TaskRiskCandidateDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;

    const getTaskRisk = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await apiClient.get<TaskRiskResponseDto>(
          GET_TASK_RISK_URL(projectId, taskId),
        );

        if (!ignore) {
          setRisk(response.data.assignedRisk);
        }
      } catch (requestError) {
        console.error(requestError);
        if (!ignore) {
          setError(true);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    getTaskRisk();

    return () => {
      ignore = true;
    };
  }, [projectId, taskId]);

  if (loading)
    return (
      <div className="w-full rounded-xl shadow-md p-4">
        <p className="text-center font-semibold">Завдання не знайдено</p>
      </div>
    );

  if (error || !risk) {
    return (
      <div className="flex flex-col gap-1 border-b pb-4">
        <p className="font-semibold">Аналіз ризику виконання</p>
        <p className="text-sm text-red-600">
          Не вдалося завантажити оцінку ризику.
        </p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-4 border-b pb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TriangleAlert size={20} className="text-violet-600" />
          <div>
            <h2 className="font-semibold">Аналіз ризику виконання</h2>
            <p className="text-sm opacity-70">
              Інтегральна оцінка за п’ятьма факторами
            </p>
          </div>
        </div>

        <TaskRiskBadge level={risk.riskLevel} value={risk.riskValue} />
      </div>

      <TaskRiskChart factors={risk.factors} />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard
          label="Активні задачі"
          value={risk.metrics.activeAssignments}
        />
        <MetricCard
          label="Відповідність навичок"
          value={`${risk.metrics.matchedSkills}/${risk.metrics.requiredSkills}`}
        />
        <MetricCard label="KPI виконавця" value={`${risk.metrics.kpi}%`} />
        <MetricCard
          label="До дедлайну"
          value={formatDaysUntilDeadline(risk.metrics.daysUntilDeadline)}
        />
      </div>

      <div className="rounded-xl bg-zinc-100 p-4">
        <p className="mb-2 font-semibold">Основні фактори</p>
        {risk.reasons.length ? (
          <ul className="flex list-disc flex-col gap-1 pl-5 text-sm">
            {risk.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm opacity-70">
            Суттєвих факторів ризику не виявлено.
          </p>
        )}
      </div>
    </section>
  );
};

interface MetricCardProps {
  label: string;
  value: string | number;
}

const MetricCard = ({ label, value }: MetricCardProps) => (
  <div className="rounded-xl bg-zinc-100 p-3">
    <p className="text-xs opacity-65">{label}</p>
    <p className="mt-1 font-semibold">{value}</p>
  </div>
);

const formatDaysUntilDeadline = (days: number) => {
  if (days < 0) return `Прострочено на ${Math.abs(days)} дн.`;
  if (days === 0) return "Сьогодні";
  return `${days} дн.`;
};

export default TaskRiskAnalysis;
