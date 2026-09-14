"use client";

import { Download, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { NAV_LINKS, RESUME_URL } from "./nav-config";

export function Navbar() {
  const containerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-navbar-item]", {
          y: -14,
          autoAlpha: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.07,
        });
      });
    },
    { scope: containerRef },
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    setOpen(false);

    const hash = href.includes("#") ? href.slice(href.indexOf("#") + 1) : "";
    const target = hash ? document.getElementById(hash) : null;

    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
    window.history.replaceState(null, "", `#${hash}`);
  };

  return (
    <header
      ref={containerRef}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4"
    >
      <nav
        aria-label="Primary"
        className={cn(
          "w-full max-w-5xl border transition-[background-color,border-color,box-shadow] duration-300",
          "rounded-none",
          scrolled
            ? "border-border/70 bg-background/85 shadow-lg shadow-black/5 backdrop-blur-xl"
            : "border-border/40 bg-background/60 backdrop-blur-md",
        )}
      >
        <div className="flex h-14 items-center justify-between gap-3 px-3 sm:h-16 sm:px-4 md:grid md:grid-cols-[1fr_auto_1fr]">
          <Link
            data-navbar-item
            href="/"
            className="justify-self-start rounded-none text-base font-semibold tracking-tight outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Rafi Shariar<span className="text-primary">.</span>
          </Link>

          <ul
            data-navbar-item
            className="hidden items-center gap-1 md:flex md:justify-self-center"
          >
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={(event) => handleNavClick(event, link.href)}
                  className="group relative flex items-center rounded-none px-3 py-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {link.label}
                  <span
                    aria-hidden
                    className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 scale-0 rounded-none bg-primary transition-transform duration-300 group-hover:scale-100 motion-reduce:transition-none"
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div
            data-navbar-item
            className="flex items-center gap-2 md:justify-self-end"
          >
            <ResumeButton className="hidden sm:inline-flex" />
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex size-10 items-center justify-center rounded-none text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <div
          id="mobile-nav"
          inert={!open}
          className={cn(
            "overflow-hidden transition-all duration-300 ease-out md:hidden",
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <ul className="flex flex-col gap-1 px-3 pb-3 sm:px-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={(event) => handleNavClick(event, link.href)}
                  className="block rounded-none px-3 py-2.5 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-1 sm:hidden">
              <ResumeButton full />
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

function ResumeButton({
  className,
  full = false,
  ...props
}: React.ComponentProps<"a"> & { full?: boolean }) {
  return (
    <a
      href={RESUME_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-none bg-primary text-sm font-semibold text-primary-foreground shadow-sm outline-none transition-transform duration-200 animate-glow hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 motion-reduce:animate-none motion-reduce:transition-none motion-reduce:hover:scale-100",
        full ? "w-full px-4 py-2.5" : "px-4 py-2",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/35 opacity-0 blur-md transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100 motion-reduce:hidden"
      />
      <Download className="size-4 transition-transform duration-300 group-hover:translate-y-0.5 motion-reduce:transition-none" />
      <span>Download Resume</span>
    </a>
  );
}
