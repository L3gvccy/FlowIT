import type { AttachmentInterface } from "./attachment";
import type { TaskSkillInterface } from "./task-skill";
import type { AssignmentInterface } from "./assignments";
import type { TaskMessageInterface } from "./task-message";
import { ProjectInterface } from "./project";

export interface TaskInterface {
  id: string;
  projectId: string;
  title: string;
  description: string;
  complexity: number;
  deadline: string;
  taskSkills: TaskSkillInterface[];
  attachments: AttachmentInterface[];
  assignment: AssignmentInterface | null;
  messages: TaskMessageInterface[];
  project?: ProjectInterface;
  createdAt: string;
  updatedAt: string;
}
