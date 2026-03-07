import { Plus } from "lucide-react";
import React, { useState } from "react";
import SkillOption from "./skill-option";
import { ScrollArea } from "../ui/scroll-area";

const SkillSearch = () => {
  const [search, setSearch] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  return (
    <div className="relative border-0 outline-0 w-full bg-zinc-100 rounded-xl">
      <div className="flex w-full">
        <input
          type="text"
          className="flex-1 border-0 outline-0 bg-zinc-100 rounded-xl p-2"
          placeholder="Введіть вашу навичку"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          onFocus={() => {
            setShowOptions(true);
          }}
          onBlur={() => setShowOptions(false)}
        />
        <button className="flex justify-center items-center h-10 w-10 bg-violet-600 hover:bg-violet-500 text-white rounded-xl cursor-pointer transition-all duration-300">
          <Plus />
        </button>
      </div>
      {showOptions && (
        <div className="absolute top-full mt-2 w-full  z-50">
          <ScrollArea className="*:data-radix-scroll-area-viewport:max-h-30 w-full rounded-xl border border-zinc-200 bg-zinc-100">
            <div className="flex flex-col">
              <SkillOption id="1" name="ReactJS" />
              <SkillOption id="2" name="NextJS" />
              <SkillOption id="3" name="NestJS" />
              <SkillOption id="4" name="ReactJS" />
              <SkillOption id="5" name="NextJS" />
              <SkillOption id="6" name="NestJS" />
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default SkillSearch;
