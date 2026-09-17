"use client";

import { useState } from "react";
import { Plus, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetSkills } from "@/hooks/skill.hook";
import { ISkill } from "@/types/skill.type";
import SkillTable from "@/components/dashbaord/skills/SkillsTable";
import SkillFormModal from "@/components/dashbaord/skills/SkillFormModal";
import DeleteSkillModal from "@/components/dashbaord/skills/DeleteSkillModal";



export default function SkillPage() {
  const { data: response, isLoading } = useGetSkills();

  // Modals state management
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<ISkill | null>(null);

  // Grouped object থেকে ফ্ল্যাট অ্যারে তৈরি
  const skills: ISkill[] = response?.data
    ? (Object.values(response.data).flat() as ISkill[])
    : [];

  const handleOpenAdd = () => {
    setSelectedSkill(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (skill: ISkill) => {
    setSelectedSkill(skill);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (skill: ISkill) => {
    setSelectedSkill(skill);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Right Add Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-orange-600 uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tech Stack</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            Skills Management<span className="text-orange-600">.</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Organize and classify all technologies displayed on your portfolio.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="rounded-[12px] h-10 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-orange-600/25 active:scale-95 transition-all gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </Button>
      </div>

      {/* Content Body */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-[12px] border border-orange-100 bg-white">
          <div className="flex items-center gap-2 text-orange-600 font-medium text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading skills...</span>
          </div>
        </div>
      ) : (
        <SkillTable
          skills={skills}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      )}

      {/* Add / Edit Modal */}
      <SkillFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialData={selectedSkill}
      />

      {/* Delete Confirmation Modal */}
      <DeleteSkillModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        skill={selectedSkill}
      />
    </div>
  );
}