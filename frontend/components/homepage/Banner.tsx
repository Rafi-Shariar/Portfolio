"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import IMG from "../../assets/ME3.png";

const socialLinks = [
  { name: "GitHub", href: "https://github.com/your-username", icon: FaGithub },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/your-username",
    icon: FaLinkedinIn,
  },
  { name: "Email", href: "mailto:your-email@example.com", icon: Mail },
  {
    name: "Facebook",
    href: "https://facebook.com/your-username",
    icon: FaFacebookF,
  },
];

export default function HeroBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".banner-bg-script", {
        opacity: 0,
        y: -20,
        duration: 0.9,
      })
        .from(
          ".banner-subject",
          {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.6"
        )
        .from(
          ".banner-side-element",
          {
            opacity: 0,
            y: 20,
            stagger: 0.08,
            duration: 0.6,
          },
          "-=0.5"
        )
        .from(
          ".banner-bottom-dock",
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "back.out(1.4)",
          },
          "-=0.4"
        );
    },
    { scope: bannerRef }
  );

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-4">
      <div
        ref={bannerRef}
        className="relative overflow-hidden rounded-[12px] bg-gradient-to-b from-[#FFFDF9] via-[#FFF5EA] to-[#FDBA74] min-h-[640px] sm:min-h-[660px] lg:h-[680px] flex flex-col justify-between select-none"
      >
        {/* Centered Script Text: Responsive Font Size */}
        <div className="banner-bg-script absolute top-6 sm:top-10 inset-x-0 flex items-center justify-center pointer-events-none z-0">
          <span className="font-serif italic text-5xl sm:text-8xl md:text-9xl lg:text-[135px] text-neutral-800/10 sm:text-neutral-800/12 tracking-wide whitespace-nowrap">
            Hey, there
          </span>
        </div>

        {/* Scaled & Centered Image */}
        <div className="banner-subject absolute inset-x-0 bottom-0 h-full flex items-end justify-center pointer-events-none z-10 overflow-hidden">
          <div className="relative w-full max-w-[340px] sm:max-w-[540px] lg:max-w-[680px] h-[68%] sm:h-[84%] lg:h-[95%] flex items-end justify-center origin-bottom translate-y-2 sm:translate-y-1">
            <Image
              src={IMG}
              alt="Rafi Shariar"
              fill
              priority
              sizes="(max-width: 640px) 340px, (max-width: 1024px) 540px, 680px"
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

        {/* Foreground Content */}
        <div className="relative z-20 w-full h-full flex flex-col justify-between p-4 sm:p-8 lg:p-12 pointer-events-none">
          {/* Top Row: Availability Pill & Short Description */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
            <div className="banner-side-element inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/95 border border-orange-200/80 shadow-xs pointer-events-auto backdrop-blur-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-neutral-700">
                Available for new opportunities
              </span>
            </div>

            <p className="banner-side-element text-[11px] sm:text-xs md:text-sm font-medium text-neutral-700 sm:text-neutral-600 max-w-[260px] sm:text-right leading-relaxed drop-shadow-xs sm:drop-shadow-none">
              Specialized in modern full-stack architectures, scalable cloud
              backends, and responsive user experiences.
            </p>
          </div>

          {/* Bottom Row Typography: Stacks cleanly on mobile without overlapping */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-0 pb-28 sm:pb-20 lg:pb-16">
            <div className="banner-side-element">
              <span className="block text-xs sm:text-base lg:text-xl font-extrabold tracking-tight text-neutral-900 uppercase leading-none mb-0.5">
                I AM
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-neutral-950 uppercase leading-[0.92]">
                RAFI
                <br />
                SHARIAR<span className="text-orange-600">.</span>
              </h1>
            </div>

            <div className="banner-side-element text-left sm:text-right">
              <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black tracking-tighter text-neutral-950 uppercase leading-[0.92]">
                FULL STACK
                <br />
                DEVELOPER
              </h2>
            </div>
          </div>
        </div>

        {/* Bottom Dock: Compact & Centered on mobile */}
        <div className="absolute inset-x-0 bottom-0 z-30 pt-20 pb-4 sm:pb-6 px-3 bg-gradient-to-t from-orange-400 via-orange-300/80 to-transparent flex justify-center items-center pointer-events-none">
          <div className="banner-bottom-dock pointer-events-auto flex items-center gap-2 sm:gap-4 p-1.5 sm:p-2.5 rounded-[12px] bg-white/95 backdrop-blur-md border border-white/80 shadow-xl shadow-orange-950/15 max-w-full overflow-x-auto">
            <Link
              href="#contact"
              className="inline-flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-[9px] sm:rounded-[10px] bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-orange-600/30 active:scale-95 transition-all whitespace-nowrap"
            >
              <span>Contact Me</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

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
          </div>
        </div>
      </div>
    </section>
  );
}