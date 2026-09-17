"use client";

import Link from "next/link";
import { Plus, Star, FolderGit2, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  useGetAllAdminProjects,
  useToggleProjectFeatured,
} from "@/hooks/project.hook";
import { IProject } from "@/types/project.type";
import ProjectTable from "@/components/dashbaord/project/ProjectTable";
import { FaGithub, FaLinkedinIn, FaFacebookF } from "react-icons/fa";

export default function AdminProjectsPage() {
  const { data: response, isLoading } = useGetAllAdminProjects();
  const { mutate: toggleFeatured, isPending: isToggling } =
    useToggleProjectFeatured();

  const allProjects: IProject[] = Array.isArray(response?.data)
    ? response.data
    : [];

  const featuredProjects = allProjects.filter((p) => p.isFeatured);
  const regularProjects = allProjects.filter((p) => !p.isFeatured);

  const handleToggleFeatured = (project: IProject) => {
    // যদি প্রজেক্টটি আগে থেকেই featured না থাকে এবং অলরেডি ৩টি প্রজেক্ট featured অবস্থায় থাকে
    if (!project.isFeatured && featuredProjects.length >= 3) {
      toast.error("Featured Limit Reached", {
        description:
          "You can only feature up to 3 projects. Please unfeature one first to add a new one.",
      });
      return;
    }

    toggleFeatured(project.id, {
      onSuccess: () => {
        toast.success(
          project.isFeatured
            ? `"${project.name}" removed from featured.`
            : `"${project.name}" marked as featured.`,
        );
      },
      onError: (err: any) => {
        toast.error("Action Failed", {
          description:
            err?.message || "Could not update featured status. Try again.",
        });
      },
    });
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-orange-600 uppercase mb-1">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Portfolio Works</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            Projects Management<span className="text-orange-600">.</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Manage showcase projects, assign home featured slots, and review
            links.
          </p>
        </div>

        {/* Add Project Action (Details page will be implemented later) */}
        <Button
          asChild
          className="rounded-[12px] h-10 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-orange-600/25 active:scale-95 transition-all gap-1.5"
        >
          <Link href="/dashboard/projects/create">
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-[12px] border border-orange-100 bg-white">
          <div className="flex items-center gap-2 text-orange-600 font-medium text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading projects...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* 1ST TABLE: FEATURED PROJECTS (MAX 3) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-[8px] bg-amber-100/80 text-amber-600">
                  <Star className="w-4 h-4" fill="currentColor" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-neutral-900">
                    Featured Projects
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Displayed prominently on your portfolio homepage.
                  </p>
                </div>
              </div>

              {/* Counter Badge */}
              <div className="px-3 py-1 rounded-[10px] bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-semibold">
                {featuredProjects.length} / 3 Selected
              </div>
            </div>

            <ProjectTable
              projects={featuredProjects}
              onToggleFeatured={handleToggleFeatured}
              isTogglingFeatured={isToggling}
            />
          </section>

          {/* 2ND TABLE: REGULAR / NON-FEATURED PROJECTS */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-[8px] bg-neutral-100 text-neutral-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Other Projects
                </h2>
                <p className="text-xs text-neutral-500">
                  All remaining live and archived portfolio entries (
                  {regularProjects.length}).
                </p>
              </div>
            </div>

            <ProjectTable
              projects={regularProjects}
              onToggleFeatured={handleToggleFeatured}
              isTogglingFeatured={isToggling}
            />
          </section>
        </div>
      )}
    </div>
  );
}
