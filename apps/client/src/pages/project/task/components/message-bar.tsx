import { apiClient } from "@/utils/api-client";
import { SEND_TASK_MESSAGE_URL, UPLOAD_FILE_URL } from "@/utils/constants";
import type { SendMessageDto, TaskMessageInterface } from "@flowit/shared";
import { FileIcon, FilePlusCorner, SendHorizonal, XIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
  taskId: string;
  projectId: string;
  onMessageSent: (message: TaskMessageInterface) => void;
}

const MessageBar = ({ taskId, projectId, onMessageSent }: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);

  const sendMessage = async () => {
    if ((!message && !file) || uploading) return;
    console.log("Message sent");

    try {
      const data: SendMessageDto = {
        content: message,
        fileName,
        fileUrl,
      };
      const res = await apiClient.post(
        SEND_TASK_MESSAGE_URL(taskId, projectId),
        data,
      );
      const messageRes = res.data.message;
      onMessageSent(messageRes);
      setMessage("");
      setFileUrl("");
      setFileName("");
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    try {
      setUploading(true);

      const res = await apiClient.post(
        UPLOAD_FILE_URL,
        { file },
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      setFileUrl(res.data.url);
      setFileName(res.data.name);

      toast.success("Файл завантажено");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Не вдалося завантажити файл",
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFile(null);
    }
  };

  useEffect(() => {
    if (!file) return;
    uploadFile();
  }, [file]);

  return (
    <div className="flex flex-col gap-2">
      {uploading && (
        <div className="flex items-center gap-2 px-4">
          <FileIcon size={18} />
          <p className="opacity-75">Завантаження...</p>
        </div>
      )}
      {!uploading && fileName && fileUrl && (
        <div className="flex items-center gap-2 px-4">
          <FileIcon size={18} />
          <a href={fileUrl} target="_blank" rel="nonreferrer">
            {fileName}
          </a>
          <button
            className="opacity-65 hover:opacity-90 transition-all duration-300 cursor-pointer"
            onClick={() => {
              setFile(null);
              setFileName("");
              setFileUrl("");
              toast.success("Файл вилучено успішно");
            }}
          >
            <XIcon size={18} />
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <div className="flex flex-1 items-center rounded-full bg-zinc-100">
          <input
            type="text"
            placeholder="Введіть повідомлення"
            className="border-0 outline-0 py-2 px-4 flex-1"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              sendMessage();
            }}
          />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setFile(e.target.files[0]);
                return;
              }
              setFile(null);
            }}
          />
          <button
            className="mr-4 cursor-pointer text-zinc-600"
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            <FilePlusCorner size={20} />
          </button>
        </div>
        <button
          disabled={(!message && !file) || uploading}
          onClick={() => {
            sendMessage();
          }}
          className="flex items-center justify-center rounded-full h-full aspect-square text-white bg-violet-600 hover:bg-violet-500 disabled:bg-violet-900 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
        >
          <SendHorizonal size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageBar;
