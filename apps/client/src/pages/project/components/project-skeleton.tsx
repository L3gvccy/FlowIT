import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ProjectSkeleton = () => {
  return (
    <div className="flex w-full p-4 rounded-xl shadow-md">
      <div className="flex flex-col w-full md:flex-row gap-2">
        <div className="flex items-center justify-center w-full md:w-fit">
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>
        <div className="flex flex-col flex-1 justify-between h-full p-2 gap-1">
          <Skeleton className="h-7 max-w-50 w-full" />
          <Skeleton className="h-6 max-w-80 w-full" />
          <Skeleton className="mt-auto h-6 max-w-20 w-full" />
        </div>
      </div>
    </div>
  );
};

export default ProjectSkeleton;
