"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import { SiNextdotjs, SiReact, SiNodedotjs, SiPrisma } from "react-icons/si";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useGetProfile } from "@/hooks/profile.hook";
import IMG from "../../assets/ME3.png";

export default function HeroBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const { data: profileResponse } = useGetProfile();

  const profile = profileResponse?.data;

  // ডাইনামিক সোশ্যাল লিঙ্কস
  const socialLinks = [
    {
      name: "GitHub",
      href: profile?.github || "https://github.com/Rafi-Shariar",
      icon: FaGithub,
      show: Boolean(profile?.github),
    },
    {
      name: "LinkedIn",
      href: profile?.linkedin || "https://www.linkedin.com/in/rafi-shariar/",
      icon: FaLinkedinIn,
      show: Boolean(profile?.linkedin),
    },
    {
      name: "Email",
      href: `mailto:${profile?.email || "rafi.shariar619@gmail.com"}`,
      icon: Mail,
      show: Boolean(profile?.email),
    },
    {
      name: "Facebook",
      href:
        profile?.facebook || "https://www.facebook.com/rafi.shariar.630040/",
      icon: FaFacebookF,
      show: Boolean(profile?.facebook),
    },
  ].filter((item) => item.show);

  // নাম এবং হেডলাইন
  const displayName = profile?.name || "Rafi Shariar";
  const nameParts = displayName.split(" ");
  const firstName = nameParts[0] || "RAFI";
  const lastName = nameParts.slice(1).join(" ") || "SHARIAR";
  const headline = profile?.headline || "Full-Stack Developer";

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".banner-bg-script", {
        opacity: 0,
        y: -25,
        duration: 0.9,
      })
        .from(
          ".banner-text-top",
          {
            opacity: 0,
            y: -20,
            duration: 0.8,
          },
          "-=0.5",
        )
        .from(
          ".banner-subject",
          {
            opacity: 0,
            y: 35,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.6",
        )
        .from(
          ".floating-tech-badge",
          {
            opacity: 0,
            scale: 0.6,
            y: 20,
            stagger: 0.1,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.5",
        )
        .from(
          ".banner-text-bottom",
          {
            opacity: 0,
            y: 25,
            stagger: 0.1,
            duration: 0.6,
          },
          "-=0.4",
        )
        .from(
          ".banner-bottom-dock",
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "back.out(1.4)",
          },
          "-=0.3",
        );

      // ফ্লোটিং ব্যাজ মোশন
      gsap.to(".floating-tech-1", {
        y: "-=8",
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".floating-tech-2", {
        y: "+=8",
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.3,
      });
      gsap.to(".floating-tech-3", {
        y: "-=6",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });
      gsap.to(".floating-tech-4", {
        y: "+=7",
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.2,
      });
    },
    { scope: bannerRef },
  );

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-4">
      <div
        ref={bannerRef}
        className="relative overflow-hidden rounded-[14px] bg-gradient-to-b from-[#FFFDF9] via-[#FFF5EA] to-[#FDBA74] min-h-[580px] sm:min-h-[660px] lg:h-[680px] flex flex-col justify-between select-none"
      >
        {/* Background Script Text */}
        <div className="banner-bg-script absolute top-6 sm:top-12 inset-x-0 flex items-center justify-center pointer-events-none z-0">
          <span className="italic text-5xl sm:text-8xl md:text-9xl lg:text-[135px] text-neutral-800/10 sm:text-neutral-800/12 tracking-wide whitespace-nowrap ">
            Hey, there
          </span>
        </div>

        {/* 1. MOBILE ONLY: মাথার ওপর টেক্সট সেন্ট্রাল লেআউট */}
        <div className="banner-text-top sm:hidden relative z-20 w-full pt-16 px-4 text-center pointer-events-none flex flex-col items-center">
          <span className="block text-base font-extrabold tracking-widest text-neutral-700/80 uppercase mb-1 mt-10">
            I AM
          </span>
          <h1 className="text-5xl font-black tracking-tighter text-neutral-950 uppercase leading-none">
            {firstName} {lastName}
            <span className="text-orange-600">.</span>
          </h1>
          <p className="mt-2 text-lg font-black tracking-wider text-orange-600 uppercase">
            {headline}
          </p>
        </div>

        {/* Scaled & Centered Subject Image */}
        <div className="banner-subject absolute inset-x-0 bottom-0 h-full flex items-end justify-center pointer-events-none z-10 overflow-hidden">
          <div className="relative w-full max-w-[290px] sm:max-w-[520px] lg:max-w-[660px] h-[58%] sm:h-[84%] lg:h-[94%] flex items-end justify-center origin-bottom translate-y-3 sm:translate-y-1">
            <Image
              src={IMG}
              alt={displayName}
              fill
              priority
              sizes="(max-width: 640px) 290px, (max-width: 1024px) 520px, 660px"
              className="object-contain object-bottom filter grayscale contrast-125 brightness-95"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 72%, transparent 96%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 72%, transparent 96%)",
              }}
            />
          </div>
        </div>

        {/* Floating Minimal Tech Badges (Desktop & Tablets Only) */}
        <div className="hidden sm:block absolute inset-x-0 top-1/3 z-20 pointer-events-none max-w-5xl mx-auto px-6">
          <div className="relative w-full h-40">
            <div className="floating-tech-badge floating-tech-1 absolute -left-2 lg:left-4 top-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-orange-200/80 shadow-md text-xs font-semibold text-neutral-800">
              <SiNextdotjs className="w-3.5 h-3.5 text-black" />
              <span>Next.js</span>
            </div>

            <div className="floating-tech-badge floating-tech-2 absolute left-4 lg:left-14 bottom-2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-orange-200/80 shadow-md text-xs font-semibold text-neutral-800">
              <SiReact className="w-3.5 h-3.5 text-sky-500" />
              <span>React 19</span>
            </div>

            <div className="floating-tech-badge floating-tech-3 absolute -right-2 lg:right-4 top-2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-orange-200/80 shadow-md text-xs font-semibold text-neutral-800">
              <SiNodedotjs className="w-3.5 h-3.5 text-emerald-600" />
              <span>Node.js</span>
            </div>

            <div className="floating-tech-badge floating-tech-4 absolute right-4 lg:right-14 bottom-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-orange-200/80 shadow-md text-xs font-semibold text-neutral-800">
              <SiPrisma className="w-3.5 h-3.5 text-neutral-900" />
              <span>Prisma</span>
            </div>
          </div>
        </div>

        {/* Empty Spacer */}
        <div className="hidden sm:block relative z-20 w-full flex-1 pointer-events-none" />

        {/* 2. TABLET & DESKTOP: দুই পাশে দুই সাইডের লেখা (মোবাইলে hidden থাকবে) */}
        <div className="banner-text-bottom hidden sm:block relative z-20 w-full px-6 lg:px-12 pb-20 lg:pb-16 pointer-events-none">
          <div className="flex justify-between items-end gap-6">
            {/* Name (Left) */}
            <div>
              <span className="block text-sm lg:text-base font-extrabold tracking-widest text-neutral-800/80 uppercase leading-none mb-1">
                I AM
              </span>
              <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-neutral-950 uppercase leading-[0.92]">
                {firstName}
                <br />
                {lastName}
                <span className="text-orange-600">.</span>
              </h1>
            </div>

            {/* Headline (Right) */}
            <div className="text-right max-w-[320px] lg:max-w-[420px]">
              <h2 className="text-3xl lg:text-6xl font-black tracking-tighter text-neutral-950 uppercase leading-[0.95] text-balance">
                {headline}
              </h2>
            </div>
          </div>
        </div>

        {/* Bottom Dock: Action CTA & Social Icons */}
        <div className="absolute inset-x-0 bottom-0 z-30 pt-16 pb-4 sm:pb-6 px-3 bg-gradient-to-t from-orange-400 via-orange-300/80 to-transparent flex justify-center items-center pointer-events-none">
          <div className="banner-bottom-dock pointer-events-auto flex items-center gap-2 sm:gap-4 p-1.5 sm:p-2.5 rounded-[12px] bg-white/95 backdrop-blur-md border border-white/80 shadow-xl shadow-orange-950/15 max-w-full overflow-x-auto">
            <Link
              href="#contact"
              className="inline-flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-[9px] sm:rounded-[10px] bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-orange-600/30 active:scale-95 transition-all whitespace-nowrap"
            >
              <span>Contact Me</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {socialLinks.length > 0 && (
              <>
                <div className="h-5 sm:h-6 w-[1px] bg-neutral-200 shrink-0" />

                <div className="flex items-center gap-0.5 sm:gap-1">
                  {socialLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.name}
                        className="p-2 sm:p-2.5 rounded-[8px] text-neutral-700 hover:text-orange-600 hover:bg-orange-50 active:scale-95 transition-all shrink-0"
                      >
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
