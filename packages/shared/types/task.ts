import type { AttachmentInterface } from "./attachment";
import type { TaskSkillInterface } from "./task-skill";
import type { AssignmentInterface } from "./assignments";
import type { TaskMessageInterface } from "./task-message";

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
  createdAt: string;
  updatedAt: string;
}
