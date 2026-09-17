"use client";

import { Edit3, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ISkill } from "@/types/skill.type";

interface SkillTableProps {
  skills: ISkill[];
  onEdit: (skill: ISkill) => void;
  onDelete: (skill: ISkill) => void;
}

export default function SkillTable({
  skills,
  onEdit,
  onDelete,
}: SkillTableProps) {
  return (
    <div className="rounded-[12px] border border-orange-200/80 bg-white overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-[#FFFDF9] border-b border-orange-100/80">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[30%] text-xs font-bold uppercase tracking-wider text-neutral-600">
              Name
            </TableHead>
            <TableHead className="w-[30%] text-xs font-bold uppercase tracking-wider text-neutral-600">
              Category
            </TableHead>
            <TableHead className="w-[25%] text-xs font-bold uppercase tracking-wider text-neutral-600">
              Created At
            </TableHead>
            <TableHead className="w-[15%] text-right text-xs font-bold uppercase tracking-wider text-neutral-600">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {skills.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-32 text-center text-xs sm:text-sm text-neutral-400"
              >
                No skills added yet. Click "Add Skill" above to create one.
              </TableCell>
            </TableRow>
          ) : (
            skills.map((skill) => (
              <TableRow
                key={skill.id}
                className="hover:bg-orange-50/40 transition-colors border-b border-neutral-100"
              >
                {/* Skill Name */}
                <TableCell className="font-semibold text-sm text-neutral-900">
                  {skill.name}
                </TableCell>

                {/* Category Badge */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className="rounded-[8px] px-2.5 py-0.5 border-orange-200 text-orange-700 bg-orange-50/70 font-medium text-xs tracking-wide"
                  >
                    {skill.category}
                  </Badge>
                </TableCell>

                {/* Created At Date */}
                <TableCell className="text-xs text-neutral-500">
                  {skill.createdAt
                    ? new Date(skill.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </TableCell>

                {/* Action Buttons */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(skill)}
                      className="h-8 w-8 p-0 rounded-[8px] text-neutral-500 hover:text-orange-600 hover:bg-orange-100/60"
                      aria-label="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(skill)}
                      className="h-8 w-8 p-0 rounded-[8px] text-neutral-500 hover:text-red-600 hover:bg-red-50"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}