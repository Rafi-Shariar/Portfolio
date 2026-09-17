"use client";

import { useRef } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, FolderGit2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useGetFeaturedProjects } from "@/hooks/project.hook";
import { FeaturedProjectCard } from "./FeaturedProjectCard";
import { IProject } from "@/types/project.type";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FeaturedProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { data: response, isLoading } = useGetFeaturedProjects();

  const featuredProjects: IProject[] = (response?.data || []).slice(0, 3);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out", duration: 0.6 },
      });

      tl.from(".featured-header-anim", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-16 sm:mb-20">
        <div className="space-y-2">
          
          <h2 className="featured-header-anim text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-950">
            Projects I Have Engineered<span className="text-orange-600">.</span>
          </h2>
          <p className="featured-header-anim text-xs sm:text-sm text-neutral-500  font-normal">
            A showcase of full-stack web applications featuring scalable backends,
            real-time communications, and secure integrations.
          </p>
        </div>

        <Link
          href="/projects"
          className="featured-header-anim inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-white border border-neutral-200/80 text-xs font-bold text-neutral-800 hover:border-orange-500 hover:text-orange-600 shadow-2xs transition-all active:scale-95"
        >
          <span>Explore All Projects</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-12">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="relative w-full h-[460px] rounded-[12px] bg-neutral-100/70 animate-pulse flex items-center p-6"
            >
              <div className="w-[50%] h-[320px] rounded-[12px] bg-neutral-200/80" />
            </div>
          ))}
        </div>
      )}

      {/* Projects List Container */}
      {!isLoading && (
        <div className="space-y-4">
          {featuredProjects.map((project, index) => (
            <FeaturedProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
}