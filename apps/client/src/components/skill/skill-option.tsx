import React from "react";

interface SkillOptionProps {
  id: string;
  name: string;
  onClick: (name: string) => void;
}

const SkillOption = ({ id, name, onClick }: SkillOptionProps) => {
  return (
    <div
      className="w-full p-2 bg-zinc-100 hover:bg-white transition-all duration-300 cursor-pointer rounded-xl"
      key={id}
      onClick={() => {
        onClick(name);
      }}
    >
      <p className="select-none">{name}</p>
    </div>
  );
};

export default SkillOption;
