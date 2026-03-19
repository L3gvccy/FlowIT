import TaskAttchment from "@/components/project-attachment";
import { assignmentStatusList } from "@/utils/tools";
import type { AssignmentStatusUpdateInterface } from "@flowit/shared";
import dayjs from "dayjs";
import React from "react";

interface Props {
  update: AssignmentStatusUpdateInterface;
}

const AssignmentUpdate = ({ update }: Props) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex flex-1 items-center gap-2">
        <div className="h-4 w-4 rounded-full bg-violet-600"></div>

        <div className="flex flex-1 w-full justify-between text-sm">
          <p className="font-medium text-lg">
            {assignmentStatusList[update.newStatus]}
          </p>
          <p className="opacity-60">{dayjs(update.timestamp).format("LLL")}</p>
        </div>
      </div>

      <div className="flex gap-2 h-fit">
        <div className="self-stretch w-1 rounded-full bg-violet-600 mx-1.5"></div>

        <div className="flex flex-col gap-1">
          {update.message ? <p>{update.message}</p> : <p>Без повідомлення</p>}

          {update.attachments?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {update.attachments.map((a) => (
                <TaskAttchment
                  key={a.id}
                  fileName={a.fileName}
                  fileUrl={a.fileUrl}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentUpdate;
