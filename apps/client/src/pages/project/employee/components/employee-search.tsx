import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import useDebounce from "@/hooks/debounce";
import { apiClient } from "@/utils/api-client";
import { EMPLOYEE_URL } from "@/utils/constants";
import { Plus, X } from "lucide-react";
import { getFullName } from "@/utils/tools";
import UserAvatar from "@/components/user-avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FoundUser {
  id: string;
  email: string;
  name: string | null;
  surname: string | null;
  image: string | null;
}

const EmployeeOption = ({
  user,
  onClick,
}: {
  user: FoundUser;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="flex w-full items-center gap-3 p-2 hover:bg-zinc-200 transition-all duration-300"
    >
      <UserAvatar size="xs" image={user.image || undefined} />

      <div className="flex flex-col items-start">
        <p className="font-medium">
          {getFullName(user.name, user.surname) || "Без імені"}
        </p>
        <p className="text-sm opacity-70">{user.email}</p>
      </div>
    </button>
  );
};

const EmployeeSearch = ({
  projectId,
  usersToFilter = [],
  onAdd,
}: {
  projectId: string;
  usersToFilter?: { userId: string }[];
  onAdd: (user: FoundUser, role: string) => void;
}) => {
  const [search, setSearch] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [users, setUsers] = useState<FoundUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<FoundUser | null>(null);
  const [selectedRole, setSelectedRole] = useState("EMPLOYEE");
  const [pending, setPending] = useState(false);

  const query = useDebounce(search, 300);

  const searchUsers = async () => {
    if (query.trim() === "") return;

    try {
      const res = await apiClient.post(
        `${EMPLOYEE_URL}/search-users/${projectId}`,
        { query },
      );

      const filteredUsers = res.data.users.filter(
        (user: FoundUser) =>
          !usersToFilter.some((filter) => filter.userId === user.id),
      );

      setUsers(filteredUsers);
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    setPending(true);
    setUsers([]);

    if (query.trim() === "" || selectedUser) {
      setPending(false);
      return;
    }

    searchUsers();
  }, [query, selectedUser]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2 w-full">
        <div className="relative flex-1">
          <input
            type="text"
            className="h-10 w-full border-0 outline-0 bg-zinc-100 rounded-xl px-3"
            placeholder="Пошук нового працівника"
            value={search}
            onChange={(e) => {
              setSelectedUser(null);
              setSearch(e.target.value);
            }}
            onFocus={() => {
              if (!selectedUser) setShowOptions(true);
            }}
            onBlur={() => setShowOptions(false)}
          />

          {(showOptions || users[0]) && !selectedUser && (
            <div className="absolute top-full mt-2 w-full z-50">
              <ScrollArea className="*:data-radix-scroll-area-viewport:max-h-40 w-full rounded-xl border border-zinc-200 bg-zinc-100">
                <div className="flex flex-col">
                  {query.trim() === "" ? (
                    <p className="p-2">Почніть шукати працівника.</p>
                  ) : pending ? (
                    <p className="p-2">Пошук...</p>
                  ) : users.length > 0 ? (
                    users.map((user) => (
                      <EmployeeOption
                        key={user.id}
                        user={user}
                        onClick={() => {
                          setSelectedUser(user);
                          setSearch("");
                          setShowOptions(false);
                          setUsers([]);
                        }}
                      />
                    ))
                  ) : (
                    <p className="p-2">Нічого не знайдено.</p>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-40 h-10 border-0 outline-0 bg-zinc-100 rounded-xl">
            <SelectValue placeholder="Роль" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EMPLOYEE">EMPLOYEE</SelectItem>
            <SelectItem value="MANAGER">MANAGER</SelectItem>
            <SelectItem value="OWNER">OWNER</SelectItem>
          </SelectContent>
        </Select>

        <button
          type="button"
          disabled={!selectedUser}
          className="flex shrink-0 justify-center items-center h-10 w-10 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-900 disabled:cursor-not-allowed text-white rounded-xl cursor-pointer transition-all duration-300"
          onClick={() => {
            if (!selectedUser) return;

            onAdd(selectedUser, selectedRole);
            setSelectedUser(null);
            setSearch("");
            setUsers([]);
            setSelectedRole("EMPLOYEE");
          }}
        >
          <Plus />
        </button>
      </div>

      <div className="mt-2 flex items-start justify-between gap-3 rounded-xl bg-zinc-100 p-3 min-h-16 w-full">
        {selectedUser ? (
          <>
            <div className="flex items-center gap-3">
              <UserAvatar size="xs" image={selectedUser.image || undefined} />

              <div className="flex flex-col gap-1">
                <p className="font-medium">
                  {getFullName(selectedUser.name, selectedUser.surname) ||
                    "Без імені"}
                </p>
                <p className="text-sm opacity-70">{selectedUser.email}</p>
              </div>
            </div>

            <button
              type="button"
              className="flex justify-center items-center h-8 w-8 rounded-xl bg-white hover:text-red-600 transition-all duration-300"
              onClick={() => {
                setSelectedUser(null);
                setSearch("");
              }}
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <p className="text-sm opacity-70">Працівника не обрано</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeSearch;
