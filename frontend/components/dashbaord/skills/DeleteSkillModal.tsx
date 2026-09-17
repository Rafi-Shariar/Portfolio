"use client";

import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteSkill } from "@/hooks/skill.hook";
import { ISkill } from "@/types/skill.type";

interface DeleteSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: ISkill | null;
}

export default function DeleteSkillModal({
  isOpen,
  onClose,
  skill,
}: DeleteSkillModalProps) {
  const { mutate: deleteSkill, isPending } = useDeleteSkill();

  const handleDelete = () => {
    if (!skill) return;

    deleteSkill(skill.id, {
      onSuccess: () => {
        toast.success(`"${skill.name}" has been deleted.`);
        onClose();
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to delete skill.");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[420px] rounded-[12px] border-orange-200/80 bg-white">
        <DialogHeader className="flex flex-col items-center text-center pt-2">
          <div className="w-12 h-12 rounded-full bg-red-100/80 text-red-600 flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <DialogTitle className="text-lg font-bold text-neutral-900">
            Delete Skill
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-500 mt-1">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-neutral-800">
              "{skill?.name}"
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 sm:justify-center pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-[10px] h-9 px-4 text-xs font-medium border-neutral-200 hover:bg-neutral-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className="rounded-[10px] h-9 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs"
          >
            {isPending ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting...
              </span>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
