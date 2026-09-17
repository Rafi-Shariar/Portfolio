"use client";

import { useState, useRef } from "react";
import { Sparkles, Layers, Terminal } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useGetSkills } from "@/hooks/skill.hook";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SkillItem {
  id: string;
  name: string;
  category: string;
  order: number;
}

type SkillsData = Record<string, SkillItem[]>;

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { data: response, isLoading } = useGetSkills();

  const skillsGroup: SkillsData = response?.data || {};
  const categories = Object.keys(skillsGroup);

  const totalSkillsCount = Object.values(skillsGroup).reduce(
    (acc, list) => acc + list.length,
    0
  );

  const filteredCategories =
    selectedCategory === "All"
      ? categories
      : categories.filter((cat) => cat === selectedCategory);

  // হেডার এলিমেন্টের নিরাপদ স্ক্রোল অ্যানিমেশন
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

      tl.from(".skills-header-anim", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="w-full py-20 sm:py-28 bg-[#FDFBF7] border-y border-orange-100/70 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-12 sm:mb-14">
         
          
          <h2 className="skills-header-anim text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900">
            Skills & Core Competencies<span className="text-orange-600">.</span>
          </h2>
          
          <p className="skills-header-anim text-xs sm:text-sm text-neutral-500  font-medium leading-relaxed">
            Languages, frameworks, databases, and developer tooling I utilize
            to build robust, end-to-end web applications.
          </p>
        </div>

        {/* Tab Filter */}
        <div className="skills-header-anim flex items-center justify-center gap-2 flex-wrap mb-10 sm:mb-12">
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded-[10px] text-xs font-bold tracking-wide transition-all shadow-2xs select-none ${
              selectedCategory === "All"
                ? "bg-orange-600 text-white shadow-orange-600/20"
                : "bg-white text-neutral-600 border border-orange-200/60 hover:border-orange-400 hover:text-orange-600"
            }`}
          >
            All Skills
            <span
              className={`ml-2 px-1.5 py-0.5 text-[10px] font-mono rounded-[5px] ${
                selectedCategory === "All"
                  ? "bg-white/20 text-white"
                  : "bg-orange-50 text-orange-700"
              }`}
            >
              {totalSkillsCount}
            </span>
          </button>

          {categories.map((cat) => {
            const count = skillsGroup[cat]?.length || 0;
            const isActive = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-[10px] text-xs font-bold tracking-wide transition-all shadow-2xs select-none ${
                  isActive
                    ? "bg-orange-600 text-white shadow-orange-600/20"
                    : "bg-white text-neutral-600 border border-orange-200/60 hover:border-orange-400 hover:text-orange-600"
                }`}
              >
                {cat}
                <span
                  className={`ml-2 px-1.5 py-0.5 text-[10px] font-mono rounded-[5px] ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-orange-50 text-orange-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-52 rounded-[16px] border border-orange-200/50 bg-white/70 p-6 space-y-4 animate-pulse"
              >
                <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
                  <div className="h-4 w-28 bg-neutral-200 rounded" />
                  <div className="h-4 w-12 bg-neutral-200 rounded" />
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <div className="h-7 w-20 bg-neutral-200 rounded-[8px]" />
                  <div className="h-7 w-24 bg-neutral-200 rounded-[8px]" />
                  <div className="h-7 w-16 bg-neutral-200 rounded-[8px]" />
                  <div className="h-7 w-28 bg-neutral-200 rounded-[8px]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Unified Equal-Height Card Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredCategories.map((categoryKey) => {
              const skillsList = skillsGroup[categoryKey] || [];

              return (
                <div
                  key={categoryKey}
                  className="h-full bg-white rounded-[16px] border border-orange-200/80 hover:border-orange-400 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Top content */}
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-orange-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-600 ring-4 ring-orange-100" />
                        <h3 className="text-sm font-extrabold uppercase tracking-wider text-neutral-900">
                          {categoryKey}
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-[6px] bg-orange-50/80 text-orange-700 border border-orange-200/60">
                        {skillsList.length} items
                      </span>
                    </div>

                    {/* Skill Badges */}
                    <div className="flex flex-wrap gap-2">
                      {skillsList.map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-flex items-center px-3 py-1.5 rounded-[8px] bg-[#FAF8F5] border border-neutral-200/80 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-950 text-xs font-semibold text-neutral-800 transition-all cursor-default select-none shadow-2xs"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Footer to guarantee balanced looks */}
                  {/* <div className="mt-8 pt-3 border-t border-neutral-100/80 flex items-center justify-between text-[11px] text-neutral-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3 h-3 text-orange-500" />
                      Production Stack
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                      Clean Code
                    </span>
                  </div> */}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}