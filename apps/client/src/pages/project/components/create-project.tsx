import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/utils/api-client";
import { CREATE_PROJECT_URL, UPLOAD_FILE_URL } from "@/utils/constants";
import type { CreateProjectDto } from "@flowit/shared";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateProject = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);

  const uploadFile = async () => {
    setUploading(true);
    await apiClient
      .post(
        UPLOAD_FILE_URL,
        { file },
        { headers: { "Content-Type": "multipart/form-data" } },
      )
      .then((res) => {
        setFileUrl(res.data.url);
        toast.success("Файл завантажено");
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const createProject = async () => {
    setCreating(true);
    const data: CreateProjectDto = { name, description, image: fileUrl };

    await apiClient
      .post(CREATE_PROJECT_URL, data)
      .then((res) => {
        const project = res.data.project;
        navigate(`/projects/${project.id}`);
        toast.success("Проект успішно створено!");
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setCreating(false);
      });
  };

  useEffect(() => {
    if (!file) return;

    console.log(file);
    uploadFile();
  }, [file]);

  useEffect(() => {
    setFile(null);
  }, [open]);

  return (
    <>
      <button
        className="flex w-fit gap-2 py-2 px-4 rounded-xl bg-violet-600 text-white hover:bg-violet-500 font-semibold cursor-pointer transition-all duration-300"
        onClick={() => {
          setOpen(true);
        }}
      >
        <Plus />
        <p>Новий проект</p>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] max-w-4xl">
          <DialogHeader>
            <DialogTitle>Новий проект</DialogTitle>
            <DialogDescription>Створення нового проекту</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 w-full">
              <p className="px-2">
                Логотип{" "}
                {uploading && (
                  <span className="text-sm">(Завантаження...)</span>
                )}
              </p>
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                className="border-0 outline-0 bg-zinc-100 rounded-xl p-2"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                    return;
                  }
                  setFile(null);
                }}
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <p className="px-2">Назва</p>
              <input
                type="text"
                className="border-0 outline-0 w-full bg-zinc-100 rounded-xl p-2"
                placeholder="ProjectTitle"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <p className="px-2">Опис</p>
              <textarea
                className="border-0 outline-0 w-full bg-zinc-100 rounded-xl p-2"
                name="description"
                id="description"
                maxLength={250}
                placeholder="Project description..."
                rows={6}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              ></textarea>
            </div>

            <button
              className="w-full rounded-xl p-2 bg-violet-600 text-white hover:bg-violet-500 disabled:bg-violet-900 disabled:cursor-not-allowed font-semibold cursor-pointer transition-all duration-300"
              disabled={!name || !description || creating || uploading}
              onClick={createProject}
            >
              {creating ? "Створення..." : "Створити"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateProject;
