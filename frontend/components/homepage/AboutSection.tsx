"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  FileDown,
  MapPin,
  Mail,
  Phone,
  Code2,
  Sparkles,
  ExternalLink,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { FaGithub, FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useGetProfile } from "@/hooks/profile.hook";
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { data: profileResponse, isLoading } = useGetProfile();

  const profile = profileResponse?.data;

  // aboutMe টেক্সটের ডাবল নিউলাইনগুলোকে আলাদা প্যারাগ্রাফে রূপান্তর
  const paragraphs = profile?.aboutMe
    ? profile.aboutMe.split("\n\n").filter(Boolean)
    : [
        "I'm a passionate full-stack developer dedicated to crafting modern, scalable web applications.",
        "Experienced in developing end-to-end architectures with performance, security, and responsive UI in mind.",
      ];

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "power3.out", duration: 0.8 },
      });

      tl.from(".about-badge", {
        opacity: 0,
        y: 20,
      })
        .from(
          ".about-heading",
          {
            opacity: 0,
            y: 30,
          },
          "-=0.5"
        )
        .from(
          ".about-card-left",
          {
            opacity: 0,
            x: -30,
          },
          "-=0.4"
        )
        .from(
          ".about-card-right",
          {
            opacity: 0,
            x: 30,
          },
          "-=0.6"
        );
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24"
    >
      {/* Section Header */}
      <div className="flex flex-col items-center text-center space-y-2 mb-12 sm:mb-16">
       
        <h2 className="about-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-950">
          Crafting Digital Solutions with Logic & Design
          <span className="text-orange-600">.</span>
        </h2>
      </div>

      {/* Grid Layout */}
      {/* Grid Layout - items-stretch ensure equal height on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        
        {/* Left Column: Narrative Storytelling (7 cols) */}
        <div className="about-card-left lg:col-span-7 bg-white rounded-[16px] border border-orange-200/80 p-6 sm:p-8 shadow-xs flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Corner Glow */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-orange-100/50 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-[10px] bg-orange-500 text-white shadow-md shadow-orange-500/20">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
                  Behind The Code
                </h3>
                <p className="text-xs text-neutral-500 font-medium">
                  {profile?.headline || "Full-Stack Software Engineer"}
                </p>
              </div>
            </div>

            {/* Dynamic Content - Natural Flow */}
            <div className="space-y-4 text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
              {paragraphs.map((para, idx) => (
                <p key={idx} className="text-pretty">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Profile Cards Stack (5 cols) */}
        <div className="about-card-right lg:col-span-5 flex flex-col gap-5 justify-between">
          
          {/* Quick Details Card (Flex-1 expands to match left height perfectly) */}
         <div className="bg-[#FFFDF9] rounded-[16px] border border-orange-200/80 p-6 sm:p-7 shadow-xs flex flex-col justify-between flex-1">
            <div>
              <h4 className="text-base font-bold text-neutral-900 border-b border-orange-100/80 pb-3">
                Quick Details
              </h4>

              <div className="space-y-4 pt-4">
                {profile?.location && (
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-[8px] bg-orange-100/70 text-orange-600 shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        Location
                      </span>
                      <span className="text-sm font-semibold text-neutral-800">
                        {profile.location}
                      </span>
                    </div>
                  </div>
                )}

                {profile?.email && (
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-[8px] bg-orange-100/70 text-orange-600 shrink-0 mt-0.5">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        Email
                      </span>
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-sm font-semibold text-neutral-800 hover:text-orange-600 transition-colors truncate block"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                )}

                {profile?.phone && (
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-[8px] bg-orange-100/70 text-orange-600 shrink-0 mt-0.5">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        Phone
                      </span>
                      <a
                        href={`tel:${profile.phone}`}
                        className="text-sm font-semibold text-neutral-800 hover:text-orange-600 transition-colors"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* WhatsApp with Direct Chat Link */}
                {profile?.phone && (
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-[8px] bg-emerald-100/70 text-emerald-600 shrink-0 mt-0.5">
                      <FaWhatsapp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        WhatsApp
                      </span>
                      <a
                        href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, "").replace(/^0/, "880")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-neutral-800 hover:text-emerald-600 transition-colors"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Resume CTA - Pushed cleanly to bottom */}
            {profile?.resumeUrl && (
              <div className="pt-6 mt-4 border-t border-orange-100/60">
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 active:scale-98 transition-all"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download Resume / CV</span>
                </a>
              </div>
            )}
          </div>
          {/* Social Profiles Card */}
          <div className="bg-white rounded-[14px] border border-orange-200/80 px-6 py-4 shadow-xs flex items-center justify-between shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Connect Online
            </span>
            <div className="flex items-center gap-2">
              {profile?.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-[9px] bg-neutral-100/80 hover:bg-orange-600 hover:text-white text-neutral-700 transition-all active:scale-95"
                  title="GitHub"
                >
                  <FaGithub className="w-4 h-4" />
                </a>
              )}
              {profile?.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-[9px] bg-neutral-100/80 hover:bg-[#0A66C2] hover:text-white text-neutral-700 transition-all active:scale-95"
                  title="LinkedIn"
                >
                  <FaLinkedinIn className="w-4 h-4" />
                </a>
              )}
              {profile?.facebook && (
                <a
                  href={profile.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-[9px] bg-neutral-100/80 hover:bg-[#1877F2] hover:text-white text-neutral-700 transition-all active:scale-95"
                  title="Facebook"
                >
                  <FaFacebookF className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}