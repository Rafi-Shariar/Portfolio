"use client";

import React from "react";
import { GraduationCap, Calendar, Award, Sparkles } from "lucide-react";

interface EducationItem {
  degree: string;
  institution: string;
  timeline: string;
  gradeLabel: string;
  gradeValue: string;
  scale: string;
  isCurrent?: boolean;
  theme: {
    cardBg: string;
    border: string;
    hoverBorder: string;
    pillBg: string;
    pillText: string;
    accent: string;
  };
}

const educationData: EducationItem[] = [
  {
    degree: "B.Sc in CSE",
    institution: "Daffodil International University, Dhaka.",
    timeline: "2023 - 2026",
    gradeLabel: "CGPA",
    gradeValue: "3.57",
    scale: "4.00",
    isCurrent: true,
    theme: {
      cardBg: "bg-[#F3EBF9]",
      border: "border-[#E5D7F0]",
      hoverBorder: "hover:border-[#C4A9E2]",
      pillBg: "bg-[#E8DCF3]",
      pillText: "text-[#5E3287]",
      accent: "text-[#5E3287]",
    },
  },
  {
    degree: "HSC (Science)",
    institution: "Govt. Shundarban Adarsha College, Khulna",
    timeline: "2022",
    gradeLabel: "GPA",
    gradeValue: "5.00",
    scale: "5.00",
    theme: {
      cardBg: "bg-[#EAF3EA]",
      border: "border-[#D6E6D6]",
      hoverBorder: "hover:border-[#ACCCAC]",
      pillBg: "bg-[#DAEADA]",
      pillText: "text-[#28572D]",
      accent: "text-[#28572D]",
    },
  },
  {
    degree: "SSC (Science)",
    institution: "Sristy Central School and College, Khulna",
    timeline: "2019",
    gradeLabel: "GPA",
    gradeValue: "5.00",
    scale: "5.00",
    theme: {
      cardBg: "bg-[#F7EFE4]",
      border: "border-[#EDE0D0]",
      hoverBorder: "hover:border-[#D9C4AC]",
      pillBg: "bg-[#EFE2D2]",
      pillText: "text-[#6E4B25]",
      accent: "text-[#6E4B25]",
    },
  },
];

export default function EducationSection() {
  return (
    <section id="education" className="w-full py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-10 lg:mb-12">
         

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">
            Educational Qualifications<span className="text-orange-600">.</span>
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed">
            Core foundations in Computer Science, engineering coursework, and standardized academic achievements.
          </p>
        </div>

        {/* 3 Pastel Tinted Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3  max-w-5xl mx-auto">
          {educationData.map((item, index) => (
            <div
              key={index}
              className={`relative  ${item.theme.cardBg} ${item.theme.border} ${item.theme.hoverBorder} p-7 sm:p-8 border shadow-xs transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between`}
            >
              <div className="space-y-4">
                {/* Meta Top Tag */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">
                    0{index + 1}
                  </span>

                  <div className="flex items-center gap-2">
                    
                    <div className="p-2 rounded-full bg-white/80 shadow-2xs text-neutral-700">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Degree Info */}
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-neutral-900 leading-snug">
                    {item.degree}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-700 font-medium leading-relaxed mt-1.5">
                    {item.institution}
                  </p>
                </div>

                {/* Timeline Tag */}
                <div className="inline-flex items-center gap-1.5 text-xs text-neutral-600 font-medium pt-1">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span>{item.timeline}</span>
                </div>
              </div>

              {/* White Result Chip (Floating Bottom Card) */}
              <div className="mt-8 pt-4">
                <div className="p-4 rounded-[18px] bg-white border border-black/5 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${item.theme.pillBg} ${item.theme.pillText}`}>
                      <Award className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                      {item.gradeLabel}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className={`text-2xl font-black tracking-tight leading-none block ${item.theme.accent}`}>
                      {item.gradeValue}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 font-bold block mt-0.5">
                      Scale {item.scale}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}