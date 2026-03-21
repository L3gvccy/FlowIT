import UserAvatar from "@/components/user-avatar";
import { getFullName } from "@/utils/tools";
import type { TaskMessageInterface } from "@flowit/shared";
import dayjs from "dayjs";
import React from "react";

interface Props {
  employeeId: string;
  message: TaskMessageInterface;
}

const TaskMessage = ({ employeeId, message }: Props) => {
  return (
    <div
      key={message.id}
      className={`p-3 flex flex-col gap-2 rounded-t-xl ${employeeId === message.employee.id ? "bg-violet-200 rounded-bl-xl" : " bg-zinc-100 rounded-br-xl"}`}
    >
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <UserAvatar size="xs" image={message.employee.user.image} />
          <p className="font-medium">
            {getFullName(
              message.employee.user.name,
              message.employee.user.surname,
            )}
          </p>
        </div>

        <p className="opacity-60">{dayjs(message.timestamp).format("L LT")}</p>
      </div>

      {message.content && (
        <p className="whitespace-pre-wrap">{message.content}</p>
      )}

      {message.fileUrl && (
        <a
          href={message.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm underline opacity-80"
        >
          {message.fileName || "Файл"}
        </a>
      )}
    </div>
  );
};

export default TaskMessage;
