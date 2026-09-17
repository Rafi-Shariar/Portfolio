"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Server,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Layers,
  Calendar,
  Play,
  Terminal,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { useGetProjectBySlug } from "@/hooks/project.hook";
import { IProject } from "@/types/project.type";

// Google Drive ও YouTube এর লিংককে এম্বেডযোগ্য iframe সোর্সে কনভার্ট করার হেল্পার
const getEmbedVideoUrl = (url: string | null | undefined): { isIframe: boolean; src: string } | null => {
  if (!url) return null;

  // Google Drive Link
  if (url.includes("drive.google.com")) {
    const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      return {
        isIframe: true,
        src: `https://drive.google.com/file/d/d/${driveMatch[1]}/preview`.replace("/d/d/", "/d/"),
      };
    }
  }

  // YouTube Link
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1]?.split("&")[0];
    }
    return {
      isIframe: true,
      src: `https://www.youtube.com/embed/${videoId}?rel=0`,
    };
  }

  // Regular MP4/Direct video stream
  return { isIframe: false, src: url };
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { data: response, isLoading } = useGetProjectBySlug(slug);
  const project: IProject | undefined = response?.data;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Banner Auto-slide
  useEffect(() => {
    if (!project?.images || project.images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % project.images.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [project?.images]);

  const handlePrevSlide = () => {
    if (!project?.images) return;
    setActiveImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    if (!project?.images) return;
    setActiveImageIndex((prev) => (prev + 1) % project.images.length);
  };

  if (isLoading) {
    return (
      <main className="w-full min-h-screen bg-[#FFFDF9] py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
          <div className="h-4 w-28 bg-neutral-200 rounded" />
          <div className="w-full h-[520px] bg-neutral-200/80 rounded-[16px]" />
          <div className="space-y-4">
            <div className="h-9 w-72 bg-neutral-200 rounded" />
            <div className="h-4 w-full bg-neutral-200 rounded" />
            <div className="h-4 w-3/4 bg-neutral-200 rounded" />
          </div>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="w-full min-h-screen bg-[#FFFDF9] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black text-neutral-900 mb-2">Project Not Found</h2>
        <p className="text-sm text-neutral-500 mb-6">The project you are looking for is unavailable or unpublished.</p>
        <Link
          href="/projects"
          className="px-5 py-2.5 rounded-[10px] bg-orange-600 text-white text-xs font-bold shadow-md hover:bg-orange-700 transition-all"
        >
          Return to Projects
        </Link>
      </main>
    );
  }

  const images = project.images || [];
  const videoData = getEmbedVideoUrl(project.walkthroughVideoUrl);

  return (
    <main className="w-full min-h-screen bg-[#FFFDF9] py-10 sm:py-16 selection:bg-orange-500 selection:text-white">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-orange-600 transition-colors py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Projects</span>
          </Link>
        </div>

        {/* 1. LARGE HERO BANNER WITH AMBIENT GLOW */}
        <div className="relative mb-12">
          {/* Ambient Glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/20 via-amber-500/15 to-orange-600/20 rounded-[20px] blur-2xl pointer-events-none -z-10" />

          <section className="relative w-full h-[360px] sm:h-[480px] lg:h-[600px] rounded-[16px] overflow-hidden border border-orange-200/80 bg-neutral-950 shadow-2xl group">
            {images.length > 0 ? (
              images.map((img, idx) => (
                <div
                  key={img.id || idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    idx === activeImageIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <Image
                    src={img.imageUrl}
                    alt={project.name}
                    fill
                    priority={idx === 0}
                    sizes="(max-width: 1024px) 100vw, 1100px"
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-black/10 pointer-events-none" />
                </div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                No Preview Images Available
              </div>
            )}

            {/* Slider Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-orange-600 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all active:scale-95 shadow-lg"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-orange-600 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all active:scale-95 shadow-lg"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === activeImageIndex
                          ? "w-7 bg-orange-500"
                          : "w-2 bg-white/40 hover:bg-white"
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </section>

          {/* Mini Thumbnail Strip below the banner */}
          {images.length > 1 && (
            <div className="flex items-center gap-2.5 mt-3.5 overflow-x-auto pb-1 no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 sm:w-24 h-12 sm:h-14 rounded-[8px] overflow-hidden border-2 transition-all shrink-0 ${
                    idx === activeImageIndex
                      ? "border-orange-600 scale-102 shadow-xs"
                      : "border-neutral-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.imageUrl}
                    alt="thumbnail"
                    fill
                    className="object-cover object-top"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. PROJECT TITLE & ACTIONS HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-orange-200/80 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-orange-100/90 text-orange-800 border border-orange-200">
                {project.type}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 bg-white px-3 py-1 rounded-full border border-neutral-200">
                <Calendar className="w-3.5 h-3.5 text-orange-600" />
                {new Date(project.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950">
              {project.name}<span className="text-orange-600">.</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed">
              {project.shortDescription}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[12px] bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/25 active:scale-95 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Preview</span>
              </a>
            )}

            {project.githubClient && (
              <a
                href={project.githubClient}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-[12px] bg-white border border-orange-200/80 hover:border-orange-500 hover:text-orange-600 text-neutral-800 text-xs font-bold transition-all shadow-2xs active:scale-95"
              >
                <FaGithub className="w-4 h-4 text-neutral-800" />
                <span>Client Repo</span>
              </a>
            )}

            {project.githubServer && (
              <a
                href={project.githubServer}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-[12px] bg-white border border-orange-200/80 hover:border-orange-500 hover:text-orange-600 text-neutral-800 text-xs font-bold transition-all shadow-2xs active:scale-95"
              >
                <Server className="w-4 h-4 text-neutral-800" />
                <span>Server Repo</span>
              </a>
            )}
          </div>
        </div>

        {/* 3. WALKTHROUGH VIDEO (YOUTUBE, GOOGLE DRIVE OR MP4) */}
        {videoData && (
          <section className="mb-14">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 ring-4 ring-red-100" />
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <Play className="w-4 h-4 text-red-600 fill-current" />
                Walkthrough Video Showcase
              </h2>
            </div>
            
            <div className="w-full aspect-video rounded-[16px] overflow-hidden border border-orange-200/80 shadow-xl bg-black">
              {videoData.isIframe ? (
                <iframe
                  src={videoData.src}
                  title={`${project.name} Walkthrough`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <video
                  src={videoData.src}
                  controls
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </section>
        )}

        {/* 4. 1-BY-1 STACKED FLOW (NO SIDE-BY-SIDE MISALIGNMENT) */}
        <div className="space-y-8 mb-14">
          
          {/* A. Project Architecture & Overview (Full Width) */}
          <div className="bg-white rounded-[16px] border border-orange-200/80 p-6 sm:p-8 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-orange-100/40 rounded-full blur-2xl pointer-events-none" />
            <h2 className="text-base font-extrabold text-neutral-900 flex items-center gap-2 pb-3 mb-5 border-b border-orange-100">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>Project Architecture & Overview</span>
            </h2>
            <div className="text-neutral-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal space-y-4">
              {project.description}
            </div>
          </div>

          {/* B. Categorized Technology Stack (Full Width) */}
          <div className="bg-white rounded-[16px] border border-orange-200/80 p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-extrabold text-neutral-900 flex items-center gap-2 pb-3 mb-6 border-b border-orange-100">
              <Layers className="w-4 h-4 text-orange-600" />
              <span>Comprehensive Technology Stack</span>
            </h2>

            <div className="space-y-6">
              {/* Frontend */}
              {project.frontendTech?.length > 0 && (
                <div>
                  <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-orange-700 mb-2.5">
                    Frontend Architecture
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.frontendTech.map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold px-3 py-1.5 rounded-[8px] bg-[#FAF8F5] border border-neutral-200/80 text-neutral-800 shadow-2xs hover:border-orange-300 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Backend */}
              {project.backendTech?.length > 0 && (
                <div className="pt-2">
                  <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-orange-700 mb-2.5">
                    Backend, Database & Security
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.backendTech.map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold px-3 py-1.5 rounded-[8px] bg-[#FAF8F5] border border-neutral-200/80 text-neutral-800 shadow-2xs hover:border-orange-300 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools */}
              {project.tools?.length > 0 && (
                <div className="pt-2">
                  <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-orange-700 mb-2.5">
                    Tooling, State & Integration
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold px-3 py-1.5 rounded-[8px] bg-[#FAF8F5] border border-neutral-200/80 text-neutral-800 shadow-2xs hover:border-orange-300 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* C. Key Engineering Features (Full Width) */}
          {project.keyFeatures?.length > 0 && (
            <div className="bg-white rounded-[16px] border border-orange-200/80 p-6 sm:p-8 shadow-xs">
              <h2 className="text-base font-extrabold text-neutral-900 flex items-center gap-2 pb-3 mb-6 border-b border-orange-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Key Features & Engineering Highlights</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.keyFeatures.map((feat, i) => {
                  const [headline, ...rest] = feat.split(" - ");
                  const detail = rest.join(" - ");

                  return (
                    <div
                      key={i}
                      className="p-4 rounded-[12px] bg-[#FAF8F5] border border-neutral-200/70 flex items-start gap-3 hover:border-orange-300 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-orange-600 mt-2 shrink-0" />
                      <div className="text-xs sm:text-sm leading-relaxed">
                        <strong className="text-neutral-900 font-bold block mb-0.5">
                          {headline}
                        </strong>
                        {detail && <span className="text-neutral-600">{detail}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* D. Technical Challenges (Full Width) */}
          {project.challengesFaced?.length > 0 && (
            <div className="bg-white rounded-[16px] border border-orange-200/80 p-6 sm:p-8 shadow-xs">
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 mb-5 flex items-center gap-2 pb-3 border-b border-orange-100">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Engineering Obstacles & Solutions</span>
              </h2>
              <ul className="space-y-3.5">
                {project.challengesFaced.map((challenge, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-700 leading-relaxed bg-[#FAF8F5] p-3.5 rounded-[10px] border border-neutral-200/70">
                    <span className="font-mono text-orange-600 font-bold shrink-0 mt-0.5">
                      0{idx + 1}.
                    </span>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* E. Future Roadmap (Full Width) */}
          {project.futurePlans?.length > 0 && (
            <div className="bg-white rounded-[16px] border border-orange-200/80 p-6 sm:p-8 shadow-xs">
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 mb-5 flex items-center gap-2 pb-3 border-b border-orange-100">
                <Compass className="w-4 h-4 text-orange-600" />
                <span>Future Plans & Roadmap</span>
              </h2>
              <ul className="space-y-3.5">
                {project.futurePlans.map((plan, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-700 leading-relaxed bg-[#FAF8F5] p-3.5 rounded-[10px] border border-neutral-200/70">
                    <span className="font-mono text-neutral-400 font-bold shrink-0 mt-0.5">
                      0{idx + 1}.
                    </span>
                    <span>{plan}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Minimal Footer Signature */}
        <div className="pt-6 border-t border-orange-100 flex items-center justify-between text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-orange-500" />
            Designed & Engineered with Next.js
          </span>
          <Link href="/projects" className="text-orange-600 font-bold hover:underline">
            ← Explore other projects
          </Link>
        </div>

      </div>
    </main>
  );
}