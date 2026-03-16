import { File, XIcon } from "lucide-react";
import React from "react";

interface TaskAttchmentProps {
  fileName: string;
  fileUrl: string;
  removable?: boolean;
  onRemove?: () => void;
}

const TaskAttchment = ({
  fileName,
  fileUrl,
  removable = false,
  onRemove,
}: TaskAttchmentProps) => {
  return (
    <a
      href={fileUrl}
      className="grid grid-cols-1 justify-start w-24 z-0"
      target="_blank"
    >
      <div className="relative w-full flex justify-center items-center rounded-xl bg-zinc-100 h-24">
        {removable && (
          <div
            className="absolute top-2 right-2 p-1 bg-white hover:text-red-600 rounded-full z-50 cursor-pointer transition-all duration-300"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove?.();
            }}
          >
            <XIcon size={18} />
          </div>
        )}
        <File size={48} className="opacity-35" />
      </div>
      <p className="opacity-80 truncate text-sm">{fileName}</p>
    </a>
  );
};

export default TaskAttchment;
