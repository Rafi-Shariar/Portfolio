"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Download, Menu, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const containerRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Replace with your Google Drive resume link
  const resumeDriveLink = "https://drive.google.com/file/d/1cCUKSrsh9I3wO036vwgAPpUeq7iiou_C/view?usp=sharing";

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".nav-brand", {
        y: -20,
        opacity: 0,
        duration: 0.6,
      })
        .from(
          ".nav-item",
          {
            y: -15,
            opacity: 0,
            duration: 0.5,
            stagger: 0.06,
          },
          "-=0.3"
        )
        // .from(
        //   ".nav-resume-btn",
        //   {
        //     scale: 0.9,
        //     opacity: 0,
        //     duration: 0.5,
        //     ease: "back.out(1.5)",
        //   },
        //   "-=0.2"
        // );
    },
    { scope: containerRef }
  );

  return (
    <header
      ref={containerRef}
      className="sticky top-0 z-50 w-full bg-[#FFFDF9]/90 backdrop-blur-md border-b border-orange-100/70"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="nav-brand flex items-center gap-2.5 text-xl font-bold tracking-tight text-neutral-900"
        >
          <span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50" />
          <span>
            RAFI SHARIAR
          </span>
        </Link>

        {/* Desktop Navigation & Resume Button */}
        <div className="hidden md:flex items-center gap-8">
          <nav>
            <ul className="flex items-center gap-8 text-[15px] font-medium text-neutral-700">
              {navLinks.map((link) => (
                <li key={link.name} className="nav-item">
                  <Link
                    href={link.href}
                    className="relative py-1 transition-colors hover:text-orange-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-orange-500 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Eye-catching Resume Button for Google Drive */}
          <a
            href={resumeDriveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-resume-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-[5px] bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-md shadow-orange-500/25 active:scale-95 transition-all duration-200"
          >
            <Download className="w-4 h-4 stroke-[2.2]" />
            <span>Resume</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg text-neutral-800 hover:bg-orange-50 transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6 text-orange-600" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-orange-100 bg-[#FFFDF9] px-6 py-5 space-y-4 shadow-lg min-h-screen">
          <ul className="flex flex-col gap-3 text-base font-medium text-neutral-800">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-1 hover:text-orange-600"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="pt-2 border-t border-orange-100">
            <a
              href={resumeDriveLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-md shadow-orange-500/20 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Resume</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}