import { useEffect, useState } from "react";
import { apiClient } from "@/utils/api-client";
import { ASSIGN_TASK_URL, GET_TASK_CANDIDATES_URL } from "@/utils/constants";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";
import Loader from "@/components/loader";
import type {
  IAssignTaskResponse,
  ITaskCandidate,
  ITaskCandidatesResponse,
} from "@flowit/shared";
import { BookCheck } from "lucide-react";

interface AssignTaskDialogProps {
  taskId: string;
  onAssigned?: (response: IAssignTaskResponse) => void;
}

const AssignTaskDialog = ({ taskId, onAssigned }: AssignTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const [candidates, setCandidates] = useState<ITaskCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] =
    useState<ITaskCandidate | null>(null);

  const fetchCandidates = async () => {
    try {
      setLoading(true);

      const res = await apiClient.get<ITaskCandidatesResponse>(
        GET_TASK_CANDIDATES_URL(taskId),
        { withCredentials: true },
      );

      setCandidates(res.data.candidates);
    } catch (error) {
      toast.error("Не вдалося отримати список кандидатів");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCandidates();
    }
  }, [open]);

  const handleSelectCandidate = (candidate: ITaskCandidate) => {
    setSelectedCandidate(candidate);
    setConfirmOpen(true);
  };

  const handleConfirmAssign = async () => {
    if (!selectedCandidate) return;

    try {
      setAssigning(true);

      const res = await apiClient.post<IAssignTaskResponse>(
        ASSIGN_TASK_URL(taskId, selectedCandidate.employeeId),
        {},
        { withCredentials: true },
      );

      toast.success(`Задачу призначено: ${selectedCandidate.fullName}`);

      setConfirmOpen(false);
      setOpen(false);
      setSelectedCandidate(null);

      onAssigned?.(res.data);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Не вдалося призначити виконавця",
      );
    } finally {
      setAssigning(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="flex px-3 py-2 gap-2 items-center text-white rounded-xl bg-violet-600 hover:bg-violet-500 transition-all duration-300 cursor-pointer">
            <BookCheck size={16} />
            <p>Призначити</p>
          </button>
        </DialogTrigger>

        <DialogContent className="w-[95vw] max-w-4xl">
          <DialogHeader>
            <DialogTitle>Підбір кандидатів</DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="py-10 flex justify-center">
              <Loader size={18} />
            </div>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto overflow-x-auto rounded-xl border border-zinc-200 w-full">
              {candidates.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  Кандидатів не знайдено
                </div>
              ) : (
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="border-b bg-zinc-50">
                      <th className="px-4 py-3 text-left font-semibold">
                        Співробітник
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Score
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Навички
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Досвід
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">KPI</th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Штраф
                      </th>
                      <th className="px-4 py-3 text-right font-semibold"></th>
                    </tr>
                  </thead>

                  <tbody>
                    {candidates.map((candidate, index) => (
                      <tr
                        key={candidate.employeeId}
                        className="border-b last:border-b-0 hover:bg-violet-50/40 transition-colors"
                      >
                        <td className="px-4 py-3 align-top">
                          <div className="font-medium">
                            <span className="text-violet-600">
                              {index + 1}.
                            </span>{" "}
                            {candidate.fullName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {candidate.email}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Роль: {candidate.role}
                          </div>
                        </td>

                        <td className="px-4 py-3 align-top">
                          <div className="font-semibold text-violet-600">
                            {candidate.score.toFixed(4)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            LF: {candidate.loadFactor.toFixed(2)}
                          </div>
                        </td>

                        <td className="px-4 py-3 align-top">
                          <div>
                            {candidate.matchedSkillsCount}/
                            {candidate.totalRequiredSkillsCount}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {candidate.skillMatch.toFixed(2)}
                          </div>
                        </td>

                        <td className="px-4 py-3 align-top">
                          <div>
                            {candidate.completedSimilarTasks}/
                            {candidate.maxCompletedTasks}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {candidate.experienceScore.toFixed(2)}
                          </div>
                        </td>

                        <td className="px-4 py-3 align-top">
                          <div>{candidate.kpi}</div>
                          <div className="text-xs text-muted-foreground">
                            {candidate.performanceScore.toFixed(2)}
                          </div>
                        </td>

                        <td className="px-4 py-3 align-top">
                          <div>{candidate.penalty.toFixed(4)}</div>
                          <div className="text-xs text-muted-foreground">
                            Busy: {candidate.busyTimeWindow}h
                          </div>
                        </td>

                        <td className="px-4 py-3 align-top text-right">
                          <Button
                            onClick={() => handleSelectCandidate(candidate)}
                            className="bg-violet-600 hover:bg-violet-500 text-white transition-all duration-300 cursor-pointer"
                          >
                            Обрати
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Підтвердити призначення?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedCandidate && (
                <>
                  Призначити{" "}
                  <span className="font-medium">
                    {selectedCandidate.fullName}
                  </span>
                  ?
                  <br />
                  <br />
                  Score: {selectedCandidate.score.toFixed(4)}
                  <br />
                  SkillMatch: {selectedCandidate.skillMatch.toFixed(2)}
                  <br />
                  ExperienceScore:{" "}
                  {selectedCandidate.experienceScore.toFixed(2)}
                  <br />
                  PerformanceScore:{" "}
                  {selectedCandidate.performanceScore.toFixed(2)}
                  <br />
                  Penalty: {selectedCandidate.penalty.toFixed(4)}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={assigning}
              className="transition-all duration-300 cursor-pointer"
            >
              Скасувати
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAssign}
              disabled={assigning}
              className="bg-violet-600 hover:bg-violet-500 text-white transition-all duration-300 cursor-pointer"
            >
              {assigning ? "Призначення..." : "Підтвердити"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AssignTaskDialog;
