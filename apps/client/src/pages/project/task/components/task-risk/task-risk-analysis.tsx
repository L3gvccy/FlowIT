import { useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { apiClient } from "@/utils/api-client";
import { GET_TASK_RISK_URL } from "@/utils/constants";
import TaskRiskChart from "./task-risk-chart";
import type { TaskRiskLevel, TaskRiskResponse } from "./task-risk.types";
import TaskRiskBadge from "./task-risk-badge";

interface TaskRiskAnalysisProps {
  projectId: string;
  taskId: string;
}

const riskLevelConfig: Record<
  TaskRiskLevel,
  { label: string; className: string }
> = {
  LOW: {
    label: "Низький ризик",
    className: "bg-green-100 text-green-700",
  },
  MEDIUM: {
    label: "Середній ризик",
    className: "bg-amber-100 text-amber-700",
  },
  HIGH: {
    label: "Високий ризик",
    className: "bg-red-100 text-red-700",
  },
};

const TaskRiskAnalysis = ({ projectId, taskId }: TaskRiskAnalysisProps) => {
  const [risk, setRisk] = useState<TaskRiskResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;

    const getTaskRisk = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await apiClient.get<TaskRiskResponse>(
          GET_TASK_RISK_URL(projectId, taskId),
        );

        if (!ignore) {
          setRisk(response.data);
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

  const level = riskLevelConfig[risk.riskLevel];

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
