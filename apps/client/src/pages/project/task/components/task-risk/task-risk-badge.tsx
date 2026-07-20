import type { TaskRiskLevel } from "@flowit/shared";

interface TaskRiskBadgeProps {
  level: TaskRiskLevel;
  value: number;
}

const riskLevelConfig: Record<
  TaskRiskLevel,
  { label: string; className: string }
> = {
  LOW: {
    label: "Низький",
    className: "bg-green-100 text-green-700",
  },
  MEDIUM: {
    label: "Середній",
    className: "bg-amber-100 text-amber-700",
  },
  HIGH: {
    label: "Високий",
    className: "bg-red-100 text-red-700",
  },
};

const TaskRiskBadge = ({ level, value }: TaskRiskBadgeProps) => {
  const config = riskLevelConfig[level];

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${config.className}`}
    >
      {config.label} · {value}/100
    </span>
  );
};

export default TaskRiskBadge;
