import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

const TaskBoardColumn = ({ title, children }: Props) => {
  return (
    <div className="flex flex-col gap-3 min-w-72 w-full rounded-xl bg-zinc-50 p-3">
      <p className="font-semibold">{title}</p>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
};

export default TaskBoardColumn;
