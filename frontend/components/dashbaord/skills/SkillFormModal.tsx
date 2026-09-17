"use client";

import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useCreateSkill, useUpdateSkill } from "@/hooks/skill.hook";
import { ISkill } from "@/types/skill.type";
import { FieldError } from "@/components/shared/Field-Error";

const skillSchema = z.object({
  name: z.string().min(2, "Skill name must be at least 2 characters"),
  category: z.string().min(2, "Category is required"),
});

interface SkillFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ISkill | null;
}

export default function SkillFormModal({
  isOpen,
  onClose,
  initialData,
}: SkillFormModalProps) {
  const isEditing = Boolean(initialData);
  const { mutate: createSkill, isPending: isCreating } = useCreateSkill();
  const { mutate: updateSkill, isPending: isUpdating } = useUpdateSkill();
  const isPending = isCreating || isUpdating;

  const form = useForm({
    defaultValues: {
      name: initialData?.name || "",
      category: initialData?.category || "",
    },
    validators: {
      onChange: skillSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEditing && initialData) {
        updateSkill(
          { id: initialData.id, payload: value },
          {
            onSuccess: () => {
              toast.success("Skill updated successfully!");
              onClose();
            },
            onError: (err: any) => {
              toast.error(err?.message || "Failed to update skill.");
            },
          },
        );
      } else {
        createSkill(value, {
          onSuccess: () => {
            toast.success("Skill created successfully!");
            onClose();
          },
          onError: (err: any) => {
            toast.error(err?.message || "Failed to create skill.");
          },
        });
      }
    },
  });

  // Reset/populate fields when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      form.setFieldValue("name", initialData?.name || "");
      form.setFieldValue("category", initialData?.category || "");
    }
  }, [isOpen, initialData]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-[12px] border-orange-200/80 bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-neutral-900">
            {isEditing ? "Edit Skill" : "Add New Skill"}
            <span className="text-orange-600">.</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-500">
            {isEditing
              ? "Update the title or classification for this technical skill."
              : "Enter the technical skill and its corresponding stack category."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4 pt-2"
        >
          {/* Skill Name Field */}
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <div className="space-y-1.5">
                  <Label
                    htmlFor={field.name}
                    className="text-xs font-semibold uppercase tracking-wider text-neutral-700"
                  >
                    Skill Name
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="e.g. Next.js, PostgreSQL, Docker"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={`rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border transition-all ${
                      isInvalid
                        ? "border-red-400 focus-visible:ring-red-400"
                        : "border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                    }`}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
              );
            }}
          </form.Field>

          {/* Category Field */}
          <form.Field name="category">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <div className="space-y-1.5">
                  <Label
                    htmlFor={field.name}
                    className="text-xs font-semibold uppercase tracking-wider text-neutral-700"
                  >
                    Category
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="e.g. Frontend, Backend, Database, DevOps"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={`rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border transition-all ${
                      isInvalid
                        ? "border-red-400 focus-visible:ring-red-400"
                        : "border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                    }`}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
              );
            }}
          </form.Field>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-[10px] h-10 px-4 text-xs font-medium border-neutral-200 hover:bg-neutral-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-[10px] h-10 px-5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              {isPending ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                </span>
              ) : isEditing ? (
                "Update Skill"
              ) : (
                "Create Skill"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
