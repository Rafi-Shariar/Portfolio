"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectName?: string;
  isPending: boolean;
}

export function DeleteProjectModal({
  isOpen,
  onClose,
  onConfirm,
  projectName,
  isPending,
}: DeleteProjectModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[420px] rounded-[12px] border-orange-200/80 bg-white">
        <DialogHeader className="flex flex-col items-center text-center pt-2">
          <div className="w-12 h-12 rounded-full bg-red-100/80 text-red-600 flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <DialogTitle className="text-lg font-bold text-neutral-900">
            Delete Project
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-500 mt-1">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-neutral-800">
              "{projectName || "this project"}"
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 sm:justify-center pt-4">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onClose}
            className="rounded-[10px] h-9 px-4 text-xs font-medium border-neutral-200 hover:bg-neutral-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
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