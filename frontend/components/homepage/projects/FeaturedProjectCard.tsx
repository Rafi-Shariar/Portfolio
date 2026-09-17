"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ExternalLink, Play, ArrowUpRight, Server } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { IProject } from "@/types/project.type";

interface FeaturedProjectCardProps {
  project: IProject;
  index: number;
}

export function FeaturedProjectCard({
  project,
  index,
}: FeaturedProjectCardProps) {
  const router = useRouter();

  const combinedTech = [
    ...(project.frontendTech || []),
    ...(project.backendTech || []),
    ...(project.tools || []),
  ].slice(0, 8);

  const heroImage = project.images?.[0]?.imageUrl || "/placeholder-project.png";

  return (
    <div className="w-full flex justify-center py-6 sm:py-10 lg:py-14">
      {/* মেইন কম্পোজিশন বক্স */}
      <div className="relative w-full max-w-[980px] flex flex-col items-center lg:block lg:min-h-[440px]">
        {/* 
          🔥 সুস্পষ্ট এবং ভাইব্রেন্ট অরেঞ্জ গ্লো (Center Junction Glow) 🔥
          সাদা ব্যাকগ্রাউন্ডেও স্পষ্ট দেখতে অপাসিটি এবং কালার তীব্রতা বাড়ানো হয়েছে
        */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-[45%] lg:top-[50%] w-[320px] sm:w-[500px] lg:w-[620px] h-[220px] sm:h-[300px] bg-gradient-to-r from-orange-500/50 via-amber-500/40 to-orange-600/45 rounded-full blur-[65px] sm:blur-[80px] pointer-events-none -z-10"
        />

        {/* ১. পেছনের ইমেজ কার্ড */}
        <div className="w-full sm:w-[92%] lg:w-[72%] lg:ml-auto aspect-[16/10] sm:aspect-[16/9] lg:h-[390px] rounded-[10px] overflow-hidden shadow-lg shadow-neutral-950/5 relative select-none border border-neutral-200/70 bg-neutral-100 z-0">
          <Image
            src={heroImage}
            alt={project.name}
            fill
            priority={index === 0}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 700px"
            className="object-cover object-top filter contrast-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* ২. সামনের কন্টেন্ট কার্ড */}
        <div
          onClick={() => router.push(`/projects/${project.slug || project.id}`)}
          className="cursor-pointer relative z-10 w-[94%] sm:w-[86%] lg:w-[470px] -mt-12 sm:-mt-16 lg:mt-0 lg:absolute lg:left-0 lg:bottom-0 rounded-[10px] bg-white/95 backdrop-blur-md p-5 sm:p-7 shadow-xl shadow-orange-950/10 border border-orange-200/80 hover:border-orange-400 transition-all duration-300 group hover:-translate-y-1"
        >
          {/* Top Meta */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-[11px] font-mono font-bold tracking-widest text-orange-600 uppercase">
              Featured 0{index + 1}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-[6px] bg-orange-50 text-orange-700">
              {project.type}
            </span>
          </div>

          {/* Title */}
          <div className="flex items-center justify-between group-hover:text-orange-600 transition-colors mb-2">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 group-hover:text-orange-600 transition-colors">
              {project.name}
            </h3>
            <div className="p-1.5 rounded-full bg-neutral-50 group-hover:bg-orange-600 group-hover:text-white transition-all text-neutral-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal mb-4 line-clamp-3">
            {project.shortDescription}
          </p>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {combinedTech.map((tech, idx) => (
              <span
                key={idx}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-[6px] bg-[#FAF8F5] border border-neutral-200/70 text-neutral-700 select-none shadow-2xs"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="pt-3.5 border-t border-neutral-100 flex items-center gap-2 flex-wrap"
          >
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Live Demo</span>
              </a>
            )}

            {project.githubClient && (
              <a
                href={project.githubClient}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-all active:scale-95"
                title="Client Repository"
              >
                <FaGithub className="w-3 h-3" />
                <span>Client</span>
              </a>
            )}

            {project.githubServer && (
              <a
                href={project.githubServer}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-all active:scale-95"
                title="Server Repository"
              >
                <Server className="w-3 h-3" />
                <span>Server</span>
              </a>
            )}

            {project.walkthroughVideoUrl && (
              <a
                href={project.walkthroughVideoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-all active:scale-95"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Video</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
