import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { ProjectOutletContext } from "@/pages/project/types/project-outlet-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { complexityList } from "@/utils/tools";
import TaskAttchment from "@/components/project-attachment";
import SkillSearch from "@/components/skill/skill-search";
import SkillLabel from "@/components/skill/skill-label";
import { apiClient } from "@/utils/api-client";
import { FIND_SKILL_BY_NAME, UPLOAD_FILE_URL } from "@/utils/constants";
import { FilePlus } from "lucide-react";
import { toast } from "sonner";
import type {
  AttachmentInterface,
  CreateTaskDto,
  SkillInterface,
} from "@flowit/shared";
import dayjs from "dayjs";

interface TaskFormProps {
  mode: "create" | "edit";
  initialValues?: {
    title: string;
    description: string;
    complexity: number;
    deadline: string;
    skills: SkillInterface[];
    attachments: AttachmentInterface[];
  };
  submitting?: boolean;
  onSubmit: (data: CreateTaskDto) => Promise<void> | void;
}

const getDefaultDeadline = () => {
  const date = new Date();
  date.setHours(date.getHours() + 1);

  const pad = (num: number) => String(num).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const TaskForm = ({
  mode,
  initialValues,
  submitting = false,
  onSubmit,
}: TaskFormProps) => {
  const { project } = useOutletContext<ProjectOutletContext>();

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [complexity, setComplexity] = useState(initialValues?.complexity ?? 1);
  const [deadline, setDeadline] = useState(
    initialValues?.deadline ?? getDefaultDeadline(),
  );
  const [skills, setSkills] = useState<SkillInterface[]>(
    initialValues?.skills ?? [],
  );
  const [attachments, setAttachments] = useState<AttachmentInterface[]>(
    initialValues?.attachments ?? [],
  );

  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!initialValues) return;

    setTitle(initialValues.title);
    setDescription(initialValues.description);
    setComplexity(initialValues.complexity);
    setDeadline(initialValues.deadline);
    setSkills(initialValues.skills);
    setAttachments(initialValues.attachments);
  }, [initialValues]);

  const addTaskSkill = async (skillName: string) => {
    await apiClient
      .post(FIND_SKILL_BY_NAME, { name: skillName })
      .then((res) => {
        const skill: SkillInterface = res.data.skill;

        setSkills((prev) => {
          if (prev.some((s) => s.id === skill.id)) return prev;
          return [...prev, skill];
        });
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.message || "Не вдалося додати навичку");
      });
  };

  const removeSkill = (skillName: string) => {
    setSkills((prev) => prev.filter((s) => s.name !== skillName));
  };

  const uploadFile = async () => {
    if (!file) return;

    setUploading(true);

    await apiClient
      .post(
        UPLOAD_FILE_URL,
        { file },
        { headers: { "Content-Type": "multipart/form-data" } },
      )
      .then((res) => {
        const attachment: AttachmentInterface = {
          fileName: res.data.name,
          fileUrl: res.data.url,
        };

        setAttachments((prev) => [...prev, attachment]);
        toast.success("Файл завантажено");
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.message || "Помилка завантаження");
      })
      .finally(() => {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
        setFile(null);
      });
  };

  useEffect(() => {
    if (!file) return;
    uploadFile();
  }, [file]);

  const removeAttachment = (attachment: AttachmentInterface) => {
    setAttachments((prev) => prev.filter((a) => a !== attachment));
  };

  const handleSubmit = async () => {
    const data: CreateTaskDto = {
      projectId: project.id,
      title,
      description,
      complexity,
      deadline: new Date(deadline),
      skills,
      attachments,
    };

    await onSubmit(data);
  };

  return (
    <div className="flex flex-col gap-2 p-2 w-full rounded-xl shadow-md">
      <p className="font-semibold text-lg tracking-wide text-center">
        {mode === "create" ? "Нова задача" : "Редагування задачі"}
      </p>

      <div className="flex flex-col gap-1 w-full">
        <p className="px-2 font-semibold">Назва</p>
        <input
          type="text"
          className="border-0 outline-0 w-full bg-zinc-100 rounded-xl p-2"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <p className="px-2 font-semibold">Опис</p>
        <textarea
          className="border-0 outline-0 w-full bg-zinc-100 rounded-xl p-2"
          maxLength={250}
          placeholder="Task description..."
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <p className="px-2 font-semibold">Складність</p>
        <Select
          value={String(complexity)}
          onValueChange={(value) => setComplexity(Number(value))}
        >
          <SelectTrigger className="border-0 outline-0 w-full bg-zinc-100 rounded-xl p-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(complexityList).map(([value, label]) => (
              <SelectItem value={value} key={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <p className="px-2 font-semibold">Дедлайн</p>
        <input
          type="datetime-local"
          className="border-0 outline-0 w-full bg-zinc-100 rounded-xl p-2"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </div>

      <div className="flex flex-col w-full gap-1">
        <p className="px-2 font-semibold">Навички</p>
        <div className="flex">
          <div className="w-full max-w-125 mb-2">
            <SkillSearch onSelect={addTaskSkill} skillsToFilter={skills} />
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {skills.length > 0 ? (
          skills.map((s) => (
            <SkillLabel
              key={s.id}
              id={s.id}
              name={s.name}
              editable={true}
              onRemove={() => removeSkill(s.name)}
            />
          ))
        ) : (
          <p className="px-2">Ще не додано жодної навички</p>
        )}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <p className="px-2 font-semibold">
          Вкладення {uploading && <span>(Завантаження...)</span>}
        </p>

        <button
          type="button"
          className="flex items-center gap-2 border-0 outline-0 w-fit bg-violet-600 text-white rounded-xl p-2 cursor-pointer hover:bg-violet-500 transition-all duration-300"
          onClick={() => fileRef.current?.click()}
        >
          <FilePlus size={18} />
          <p>Додати вкладення</p>
        </button>

        <input
          type="file"
          ref={fileRef}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
              return;
            }
            setFile(null);
          }}
        />
      </div>

      <div className="flex p-2 gap-2 flex-wrap">
        {attachments.length > 0 ? (
          attachments.map((a) => (
            <TaskAttchment
              key={a.fileUrl}
              fileName={a.fileName}
              fileUrl={a.fileUrl}
              removable={true}
              onRemove={() => removeAttachment(a)}
            />
          ))
        ) : (
          <p>Немає жодного вкладення</p>
        )}
      </div>

      <button
        disabled={uploading || submitting || !title || !description}
        className="w-full rounded-xl p-2 bg-violet-600 text-white hover:bg-violet-500 disabled:bg-violet-900 disabled:cursor-not-allowed font-semibold cursor-pointer transition-all duration-300"
        onClick={handleSubmit}
      >
        {mode === "create" ? "Створити завдання" : "Зберегти зміни"}
      </button>
    </div>
  );
};

export default TaskForm;
