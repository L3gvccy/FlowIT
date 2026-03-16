import type { TaskSkillInterface } from "./task-skill";

export interface TaskInterface {
  id: string;
  projectId: string;
  title: string;
  description: string;
  complexity: number;
  deadline: Date;

  taskSkills: TaskSkillInterface[];
}
