import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import SkillOption from "./skill-option";
import { ScrollArea } from "../ui/scroll-area";
import useDebounce from "@/hooks/debounce";
import { apiClient } from "@/utils/api-client";
import { SEARCH_SKILLS_URL } from "@/utils/constants";

const SkillSearch = ({
  onSelect,
  skillsToFilter = [],
}: {
  onSelect: (name: string) => void;
  skillsToFilter?: any[];
}) => {
  const [search, setSearch] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [skills, setSkills] = useState([]);
  const [pending, setPending] = useState(false);
  const query = useDebounce(search, 300);

  const searchSkills = async () => {
    if (query === "") return;
    await apiClient
      .post(SEARCH_SKILLS_URL, { query })
      .then((res) => {
        const skills = res.data.skills.filter(
          (skill: any) =>
            !skillsToFilter.some((filter: any) => skill.id === filter.id),
        );
        setSkills(skills);
      })
      .finally(() => {
        setPending(false);
      });
  };

  useEffect(() => {
    setPending(true);
    setSkills([]);
    searchSkills();
  }, [query]);

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
        <button
          disabled={!search}
          className="flex justify-center items-center h-10 w-10 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-900 disabled:cursor-not-allowed text-white rounded-xl cursor-pointer transition-all duration-300"
          onClick={() => {
            onSelect(search);
            setSearch("");
          }}
        >
          <Plus />
        </button>
      </div>
      {(showOptions || skills[0]) && (
        <div className="absolute top-full mt-2 w-full  z-50">
          <ScrollArea className="*:data-radix-scroll-area-viewport:max-h-30 w-full rounded-xl border border-zinc-200 bg-zinc-100">
            <div className="flex flex-col">
              {query === "" ? (
                <p className="p-2">Почніть шукати навичку.</p>
              ) : pending ? (
                <p className="p-2">Пошук...</p>
              ) : skills.length > 0 ? (
                skills.map((s: any) => (
                  <SkillOption
                    key={s.id}
                    id={s.id}
                    name={s.name}
                    onClick={() => {
                      onSelect(s.name);
                      setSearch("");
                    }}
                  />
                ))
              ) : (
                <p className="p-2">
                  Нічого не знайдено. Ви можете додати навичку натиснувши кнопку
                  "+".
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default SkillSearch;
