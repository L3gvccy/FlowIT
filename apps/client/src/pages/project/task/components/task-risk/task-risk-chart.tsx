import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TaskRiskFactor } from "./task-risk.types";

interface TaskRiskChartProps {
  factors: TaskRiskFactor[];
}

const TaskRiskChart = ({ factors }: TaskRiskChartProps) => {
  return (
    <div className="h-80 w-full" aria-label="Діаграма факторів ризику">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={factors}
          layout="vertical"
          margin={{ top: 8, right: 24, bottom: 8, left: 12 }}
          accessibilityLayer
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis type="category" dataKey="name" width={180} />
          <Tooltip />
          <Bar
            dataKey="value"
            name="Значення фактора, %"
            fill="#7c3aed"
            radius={[0, 6, 6, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskRiskChart;
