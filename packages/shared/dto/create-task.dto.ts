import type { AttachmentInterface } from "../types/attachment";
import type { SkillInterface } from "../types/skill";

export interface CreateTaskDto {
  projectId: string;
  title: string;
  description: string;
  complexity: number;
  deadline: Date;

  skills: SkillInterface[];
  attachments: AttachmentInterface[];
}

export interface UpdateTaskDto {
  projectId: string;
  title: string;
  description: string;
  complexity: number;
  deadline: Date;
  skills: SkillInterface[];
  attachments: AttachmentInterface[];
}
