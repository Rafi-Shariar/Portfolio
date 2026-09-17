"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, FolderX } from "lucide-react";

import { useGetAllPublishedProjects } from "@/hooks/project.hook";

import { IProject } from "@/types/project.type";
import { FeaturedProjectCard } from "@/components/homepage/projects/FeaturedProjectCard";

export default function ProjectsPage() {
  const { data: response, isLoading } = useGetAllPublishedProjects();

  const projects: IProject[] = response?.data || [];

  return (
    <main className="w-full min-h-screen bg-[#FFFDF9] py-12 ">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-orange-600 transition-colors p-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-orange-100 mb-12 sm:mb-16">
          <div className="space-y-2.5 max-w-2xl">
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950">
              All Engineered Works<span className="text-orange-600">.</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-normal leading-relaxed">
              A comprehensive showcase of production systems, full-stack web applications, 
              scalable APIs, and robust frontend architectures.
            </p>
          </div>

          <div className="text-sm font-semibold text-neutral-400">
            Total Projects:{" "}
            <span className="text-neutral-900 font-bold">{projects.length}</span>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-12 sm:space-y-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full flex justify-center py-4">
                <div className="relative w-full max-w-[980px] flex flex-col items-center lg:block lg:min-h-[440px]">
                  {/* Image Card Skeleton */}
                  <div className="w-full sm:w-[92%] lg:w-[72%] lg:ml-auto aspect-[16/10] sm:aspect-[16/9] lg:h-[390px] rounded-[10px] bg-neutral-200/70 animate-pulse" />
                  
                  {/* Content Card Skeleton */}
                  <div className="w-[94%] sm:w-[86%] lg:w-[470px] -mt-12 sm:-mt-16 lg:mt-0 lg:absolute lg:left-0 lg:bottom-0 rounded-[10px] bg-white p-6 shadow-xl border border-neutral-100 space-y-3.5 animate-pulse">
                    <div className="flex justify-between items-center">
                      <div className="h-3.5 w-20 bg-neutral-200 rounded" />
                      <div className="h-4 w-24 bg-neutral-200 rounded" />
                    </div>
                    <div className="h-6 w-44 bg-neutral-200 rounded" />
                    <div className="space-y-2 pt-1">
                      <div className="h-3 w-full bg-neutral-200 rounded" />
                      <div className="h-3 w-4/5 bg-neutral-200 rounded" />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <div className="h-6 w-16 bg-neutral-200 rounded" />
                      <div className="h-6 w-16 bg-neutral-200 rounded" />
                      <div className="h-6 w-16 bg-neutral-200 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-24 px-4 bg-white/60 border border-dashed border-orange-200 rounded-[16px] max-w-md mx-auto">
            <div className="p-3 bg-orange-50 rounded-full text-orange-600 mb-3">
              <FolderX className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-1">
              No projects available
            </h3>
            <p className="text-xs text-neutral-500">
              There are currently no published projects in the showcase.
            </p>
          </div>
        )}

        {/* Projects 1-by-1 List */}
        {!isLoading && projects.length > 0 && (
          <div className="space-y-6 sm:space-y-10">
            {projects.map((project, index) => (
              <FeaturedProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}