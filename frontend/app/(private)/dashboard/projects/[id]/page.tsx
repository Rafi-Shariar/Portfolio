"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useGetAdminProjectById } from "@/hooks/project.hook";

import { Button } from "@/components/ui/button";
import { ProjectEditForm } from "@/components/dashbaord/project/ProjectEditForm";

export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: response, isLoading, isError } = useGetAdminProjectById(id);

  const project = response?.data;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        <p className="text-xs font-medium text-neutral-500">
          Loading project details...
        </p>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="p-3 rounded-full bg-red-100 text-red-600">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-neutral-900">
            Project Not Found
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            The project you are looking for might have been deleted or doesn't
            exist.
          </p>
        </div>
        <Link href="/dashboard/projects">
          <Button variant="outline" className="rounded-[10px] text-xs">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to projects
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to projects list
      </Link>

      <ProjectEditForm initialProject={project} />
    </div>
  );
}
