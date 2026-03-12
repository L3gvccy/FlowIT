import { X } from "lucide-react";

interface SkillLabelProps {
  id: string;
  name: string;
  editable: boolean;
  onRemove?: (name: string) => any;
}

const SkillLabel = ({ id, name, editable, onRemove }: SkillLabelProps) => {
  return (
    <div
      key={id}
      className="flex items-center gap-2 px-2 py-1 bg-violet-600 border-2 border-violet-500 text-white rounded-xl"
    >
      <p>{name}</p>
      {editable && (
        <X
          size={18}
          className="opacity-65 hover:opacity-90 transition cursor-pointer"
          onClick={() => {
            if (onRemove) onRemove(name);
          }}
        />
      )}
    </div>
  );
};

export default SkillLabel;
