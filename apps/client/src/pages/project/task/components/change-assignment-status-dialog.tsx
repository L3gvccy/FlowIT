import React, { useEffect, useRef, useState } from "react";
import { apiClient } from "@/utils/api-client";
import {
  GET_AVAILABLE_ASSIGNMENT_STATUSES_URL,
  UPDATE_ASSIGNMENT_STATUS_URL,
  UPLOAD_FILE_URL,
} from "@/utils/constants";
import type {
  AttachmentInterface,
  AssignmentStatus,
  UpdateAssignmentStatusDto,
  UpdateAssignmentStatusResponse,
} from "@flowit/shared";
import { assignmentStatusList } from "@/utils/tools";
import { toast } from "sonner";
import { FilePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TaskAttchment from "@/components/project-attachment";
import Loader from "@/components/loader";

interface ChangeAssignmentStatusDialogProps {
  assignmentId: string;
  currentStatus: AssignmentStatus;
  onUpdated?: (response: UpdateAssignmentStatusResponse) => void;
}

const ChangeAssignmentStatusDialog = ({
  assignmentId,
  currentStatus,
  onUpdated,
}: ChangeAssignmentStatusDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loadingStatuses, setLoadingStatuses] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [availableStatuses, setAvailableStatuses] = useState<
    AssignmentStatus[]
  >([]);
  const [selectedStatus, setSelectedStatus] = useState<AssignmentStatus | "">(
    "",
  );
  const [message, setMessage] = useState("");

  const [attachments, setAttachments] = useState<AttachmentInterface[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchAvailableStatuses = async () => {
    try {
      setLoadingStatuses(true);

      const res = await apiClient.get(
        GET_AVAILABLE_ASSIGNMENT_STATUSES_URL(assignmentId),
        { withCredentials: true },
      );

      const statuses = res.data.availableStatuses as AssignmentStatus[];
      setAvailableStatuses(statuses);
      setSelectedStatus(statuses[0] ?? "");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Не вдалося отримати доступні статуси",
      );
    } finally {
      setLoadingStatuses(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchAvailableStatuses();
    } else {
      setAvailableStatuses([]);
      setSelectedStatus("");
      setMessage("");
      setAttachments([]);
      setFile(null);
    }
  }, [open]);

  const uploadFile = async () => {
    if (!file) return;

    try {
      setUploading(true);

      const res = await apiClient.post(
        UPLOAD_FILE_URL,
        { file },
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      const attachment: AttachmentInterface = {
        id: crypto.randomUUID(),
        fileName: res.data.name,
        fileUrl: res.data.url,
      };

      setAttachments((prev) => [...prev, attachment]);
      toast.success("Файл завантажено");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Не вдалося завантажити файл",
      );
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
      setFile(null);
    }
  };

  useEffect(() => {
    if (!file) return;
    uploadFile();
  }, [file]);

  const removeAttachment = (attachment: AttachmentInterface) => {
    setAttachments((prev) => prev.filter((a) => a !== attachment));
  };

  const handleSubmit = async () => {
    if (!selectedStatus) return;

    try {
      setSubmitting(true);

      const dto: UpdateAssignmentStatusDto = {
        newStatus: selectedStatus,
        message: message.trim() || undefined,
        attachments,
      };

      const res = await apiClient.patch<UpdateAssignmentStatusResponse>(
        UPDATE_ASSIGNMENT_STATUS_URL(assignmentId),
        dto,
        { withCredentials: true },
      );

      toast.success("Статус успішно змінено");
      onUpdated?.(res.data);
      setOpen(false);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Не вдалося змінити статус",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex px-3 py-2 gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-all duration-300 cursor-pointer">
          Змінити статус
        </button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-2xl">
        <DialogHeader>
          <DialogTitle>Зміна статусу задачі</DialogTitle>
        </DialogHeader>

        {loadingStatuses ? (
          <div className="py-10 flex justify-center">
            <Loader size={18} />
          </div>
        ) : availableStatuses.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            Немає доступних дій для поточного статусу:{" "}
            {assignmentStatusList[currentStatus] ?? currentStatus}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="px-1 font-semibold">Новий статус</p>
              <Select
                value={selectedStatus}
                onValueChange={(value) =>
                  setSelectedStatus(value as AssignmentStatus)
                }
              >
                <SelectTrigger className="bg-zinc-100 border-0">
                  <SelectValue placeholder="Оберіть статус" />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {assignmentStatusList[status] ?? status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <p className="px-1 font-semibold">Повідомлення</p>
              <textarea
                className="border-0 outline-0 w-full bg-zinc-100 rounded-xl p-3"
                rows={5}
                placeholder="Додайте повідомлення або коментар..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="px-1 font-semibold">
                Файли {uploading && <span>(Завантаження...)</span>}
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

            <div className="flex gap-2 flex-wrap">
              {attachments.length > 0 ? (
                attachments.map((attachment) => (
                  <TaskAttchment
                    key={attachment.id || attachment.fileUrl}
                    fileName={attachment.fileName}
                    fileUrl={attachment.fileUrl}
                    removable={true}
                    onRemove={() => removeAttachment(attachment)}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Немає доданих вкладень
                </p>
              )}
            </div>

            <button
              disabled={!selectedStatus || uploading || submitting}
              onClick={handleSubmit}
              className="flex justify-center px-3 py-2 gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-all duration-300 cursor-pointer"
            >
              {submitting ? "Збереження..." : "Підтвердити зміну статусу"}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChangeAssignmentStatusDialog;
