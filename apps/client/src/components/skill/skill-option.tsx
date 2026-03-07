import React from "react";

interface SkillOptionProps {
  id: string;
  name: string;
}

const SkillOption = ({ id, name }: SkillOptionProps) => {
  return (
    <div className="w-full p-2 bg-zinc-100 hover:bg-white transition-all duration-300 cursor-pointer rounded-xl">
      <p className="select-none">{name}</p>
    </div>
  );
};

export default SkillOption;
