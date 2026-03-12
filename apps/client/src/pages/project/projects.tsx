import React from "react";
import CreateProject from "./components/create-project";

const Projects = () => {
  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col max-w-342 w-full gap-4 p-4">
        <div className="flex flex-col gap-2 w-full p-4 rounded-xl shadow-md">
          <p className="text-center text-2xl font-semibold tracking-wide">
            Проекти
          </p>
        </div>

        <CreateProject />
      </div>
    </div>
  );
};

export default Projects;
