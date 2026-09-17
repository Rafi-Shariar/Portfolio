"use client";

import Link from "next/link";
import { ArrowUp, Mail, MapPin } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaFacebookF, FaWhatsapp } from "react-icons/fa";

import { useGetProfile } from "@/hooks/profile.hook";

export default function Footer() {
  const { data: response } = useGetProfile();
  const profile = response?.data;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0F1117] text-neutral-300 border-t border-neutral-800/80 pt-16 pb-12 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[180px] bg-orange-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-800/80">
          
          {/* Brand & Narrative (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block group">
              <span className="text-2xl font-black tracking-tight text-white group-hover:text-orange-400 transition-colors">
                {profile?.name || "Portfolio"}<span className="text-orange-500">.</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-neutral-400 font-normal leading-relaxed max-w-sm">
              Full-Stack Software Engineer focused on crafting high-performance,
              scalable web architectures, clean design systems, and resilient cloud backends.
            </p>
          </div>

          {/* Navigation Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-200 block">
              Quick Navigation
            </span>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-neutral-400">
              <li>
                <Link href="/" className="hover:text-orange-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-orange-400 transition-colors">
                  About Journey
                </Link>
              </li>
              <li>
                <Link href="/#skills" className="hover:text-orange-400 transition-colors">
                  Skills & Tools
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-orange-400 transition-colors">
                  Engineered Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Contact & Socials (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-200 block">
              Direct Channels
            </span>

            <div className="space-y-2 text-xs sm:text-sm text-neutral-400 font-medium">
              {profile?.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>{profile.location}</span>
                </div>
              )}

              {profile?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <a
                    href={`mailto:${profile.email}`}
                    className="hover:text-orange-400 transition-colors truncate"
                  >
                    {profile.email}
                  </a>
                </div>
              )}
            </div>

            {/* Social Network Chips */}
            <div className="flex items-center gap-2 pt-1">
              {profile?.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-[10px] bg-[#1A1D26] border border-neutral-800 hover:border-orange-500 hover:text-orange-400 text-neutral-300 shadow-2xs transition-all active:scale-95"
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
                  className="p-2.5 rounded-[10px] bg-[#1A1D26] border border-neutral-800 hover:border-[#0A66C2] hover:text-[#0A66C2] text-neutral-300 shadow-2xs transition-all active:scale-95"
                  title="LinkedIn"
                >
                  <FaLinkedinIn className="w-4 h-4" />
                </a>
              )}
              {profile?.phone && (
                <a
                  href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, "").replace(/^0/, "880")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-[10px] bg-[#1A1D26] border border-neutral-800 hover:border-emerald-500 hover:text-emerald-400 text-neutral-300 shadow-2xs transition-all active:scale-95"
                  title="WhatsApp"
                >
                  <FaWhatsapp className="w-4 h-4" />
                </a>
              )}
              {profile?.facebook && (
                <a
                  href={profile.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-[10px] bg-[#1A1D26] border border-neutral-800 hover:border-[#1877F2] hover:text-[#1877F2] text-neutral-300 shadow-2xs transition-all active:scale-95"
                  title="Facebook"
                >
                  <FaFacebookF className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-medium">
          <p className="flex items-center gap-1 text-center sm:text-left">
            © {currentYear} {profile?.name || "Rafi Shariar"}. Built with Next.js, Tailwind CSS & GSAP.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#1A1D26] border border-neutral-800 hover:border-orange-500 hover:text-orange-400 text-neutral-300 shadow-2xs transition-all active:scale-95 text-xs font-semibold cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}