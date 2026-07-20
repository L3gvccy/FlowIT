import { useEffect, useState } from "react";
import { UsersRound } from "lucide-react";
import type { TaskRiskCandidateDto, TaskRiskResponseDto } from "@flowit/shared";
import { apiClient } from "@/utils/api-client";
import { GET_TASK_RISK_URL } from "@/utils/constants";
import Loader from "@/components/loader";
import TaskRiskBadge from "./task-risk-badge";
import TaskRiskChart from "./task-risk-chart";

interface TaskCandidateRisksProps {
  projectId: string;
  taskId: string;
}

const TaskCandidateRisks = ({ projectId, taskId }: TaskCandidateRisksProps) => {
  const [candidates, setCandidates] = useState<TaskRiskCandidateDto[]>([]);
  const [selectedCandidate, setSelectedCandidate] =
    useState<TaskRiskCandidateDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;

    const getCandidateRisks = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await apiClient.get<TaskRiskResponseDto>(
          GET_TASK_RISK_URL(projectId, taskId),
        );

        if (ignore) return;

        setCandidates(response.data.candidates);
        setSelectedCandidate(response.data.candidates[0] ?? null);
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

    getCandidateRisks();

    return () => {
      ignore = true;
    };
  }, [projectId, taskId]);

  if (loading) {
    return (
      <section className="flex min-h-40 items-center justify-center border-b pb-4">
        <Loader size={18} />
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col gap-1 border-b pb-4">
        <p className="font-semibold">Ризики кандидатів</p>
        <p className="text-sm text-red-600">
          Не вдалося завантажити оцінки ризику.
        </p>
      </section>
    );
  }

  if (!candidates.length) {
    return (
      <section className="flex flex-col gap-1 border-b pb-4">
        <p className="font-semibold">Ризики кандидатів</p>
        <p className="text-sm opacity-70">
          У проєкті немає кандидатів для оцінювання.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-5 border-b pb-4">
      <div className="flex items-center gap-2">
        <UsersRound size={20} className="text-violet-600" />
        <div>
          <h2 className="font-semibold">Порівняння ризиків кандидатів</h2>
          <p className="text-sm opacity-70">
            Кандидати впорядковані від найменшого ризику
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full min-w-190 border-collapse text-sm">
          <thead className="bg-zinc-50">
            <tr className="border-b">
              <th className="px-4 py-3 text-left font-semibold">Кандидат</th>
              <th className="px-4 py-3 text-left font-semibold">KPI</th>
              <th className="px-4 py-3 text-left font-semibold">Навички</th>
              <th className="px-4 py-3 text-left font-semibold">
                Активні задачі
              </th>
              <th className="px-4 py-3 text-left font-semibold">Ризик</th>
              <th className="px-4 py-3 text-right font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, index) => {
              const isSelected =
                selectedCandidate?.employeeId === candidate.employeeId;

              return (
                <tr
                  key={candidate.employeeId}
                  className={`border-b last:border-b-0 transition-colors ${
                    isSelected ? "bg-violet-50" : "hover:bg-zinc-50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">
                      <span className="text-violet-600">{index + 1}.</span>{" "}
                      {candidate.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {candidate.email}
                    </p>
                  </td>
                  <td className="px-4 py-3">{candidate.kpi}%</td>
                  <td className="px-4 py-3">
                    {candidate.metrics.matchedSkills}/
                    {candidate.metrics.requiredSkills}
                  </td>
                  <td className="px-4 py-3">
                    {candidate.metrics.activeAssignments}
                  </td>
                  <td className="px-4 py-3">
                    <TaskRiskBadge
                      level={candidate.riskLevel}
                      value={candidate.riskValue}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedCandidate(candidate)}
                      className="cursor-pointer rounded-xl bg-zinc-100 px-3 py-2 font-medium transition-colors hover:bg-zinc-200"
                    >
                      Детальніше
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedCandidate && (
        <CandidateRiskDetails candidate={selectedCandidate} />
      )}
    </section>
  );
};

interface CandidateRiskDetailsProps {
  candidate: TaskRiskCandidateDto;
}

const CandidateRiskDetails = ({ candidate }: CandidateRiskDetailsProps) => (
  <div className="flex flex-col gap-4 rounded-xl bg-zinc-50 p-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 className="font-semibold">Детальний аналіз</h3>
        <p className="text-sm opacity-70">{candidate.fullName}</p>
      </div>
      <TaskRiskBadge level={candidate.riskLevel} value={candidate.riskValue} />
    </div>

    <TaskRiskChart factors={candidate.factors} />

    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <MetricCard
        label="Завантаженість"
        value={`${candidate.factors.find(({ key }) => key === "workload")?.value ?? 0}%`}
      />
      <MetricCard
        label="Вільні години до дедлайну"
        value={Math.max(
          candidate.metrics.availableHours - candidate.metrics.busyHours,
          0,
        )}
      />
      <MetricCard
        label="Відповідність навичок"
        value={`${candidate.metrics.matchedSkills}/${candidate.metrics.requiredSkills}`}
      />
      <MetricCard label="KPI" value={`${candidate.kpi}%`} />
    </div>

    <div className="rounded-xl bg-white p-4">
      <p className="mb-2 font-semibold">Основні фактори</p>
      {candidate.reasons.length ? (
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm">
          {candidate.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm opacity-70">
          Суттєвих факторів ризику не виявлено.
        </p>
      )}
    </div>
  </div>
);

interface MetricCardProps {
  label: string;
  value: string | number;
}

const MetricCard = ({ label, value }: MetricCardProps) => (
  <div className="rounded-xl bg-white p-3">
    <p className="text-xs opacity-65">{label}</p>
    <p className="mt-1 font-semibold">{value}</p>
  </div>
);

export default TaskCandidateRisks;
