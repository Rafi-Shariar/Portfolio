"use client";

import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import {
  CONTACT_HREF,
  SITE,
  SOCIAL_LINKS,
  TAGLINE_LINES,
} from "./social-links";
import { TECH_STACK, type TechItem, TechLogo } from "./tech-icons";

type Placement = {
  item: TechItem;
  x: number;
  y: number;
  size: number;
  depth: number;
};

const rad = (deg: number) => (deg * Math.PI) / 180;

const PLACEMENTS: Placement[] = (() => {
  const list: Placement[] = [
    { item: TECH_STACK[0], x: 50, y: 50, size: 78, depth: 0.35 },
  ];

  TECH_STACK.slice(1, 7).forEach((item, index) => {
    const angle = rad(-90 + index * 60);
    list.push({
      item,
      x: 50 + 21 * Math.cos(angle),
      y: 50 + 21 * Math.sin(angle),
      size: 62,
      depth: 0.7,
    });
  });

  TECH_STACK.slice(7).forEach((item, index) => {
    const angle = rad(-90 + 16.36 + index * (360 / 11));
    list.push({
      item,
      x: 50 + 42 * Math.cos(angle),
      y: 50 + 42 * Math.sin(angle),
      size: index % 2 === 0 ? 48 : 56,
      depth: 1.15,
    });
  });

  return list;
})();

export function HeroBanner() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const query = <T extends Element>(selector: string) =>
        Array.from(section.querySelectorAll<T>(selector));

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const nameEl = section.querySelector<HTMLElement>("[data-hero-name]");
        const split = nameEl
          ? SplitText.create(nameEl, { type: "chars" })
          : null;

        const accent = query<HTMLElement>("[data-hero-accent]");
        const fade = query<HTMLElement>("[data-hero-fade]");
        const lines = query<HTMLElement>("[data-hero-line]");
        const contacts = query<HTMLElement>("[data-hero-contact]");
        const tech = query<HTMLElement>("[data-hero-tech]");
        const floaters = query<HTMLElement>("[data-hero-float]");
        const cue = query<HTMLElement>("[data-hero-cue]");

        gsap.set(accent, { scaleX: 0, transformOrigin: "0% 50%" });
        gsap.set(fade, { autoAlpha: 0, y: 18 });
        gsap.set(lines, { autoAlpha: 0, y: 16 });
        gsap.set(contacts, { autoAlpha: 0, y: 14 });
        gsap.set(cue, { autoAlpha: 0 });
        gsap.set(tech, {
          xPercent: -50,
          yPercent: -50,
          autoAlpha: 0,
          scale: 0.4,
        });
        if (split) {
          gsap.set(split.chars, {
            autoAlpha: 0,
            yPercent: 120,
            rotateX: -80,
            transformOrigin: "50% 100%",
            transformPerspective: 600,
          });
        }

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.to(
          split ? split.chars : [],
          {
            autoAlpha: 1,
            yPercent: 0,
            rotateX: 0,
            duration: 0.7,
            ease: "power4.out",
            stagger: 0.026,
          },
          0.15,
        )
          .to(accent, { scaleX: 1, duration: 0.6, ease: "power3.inOut" }, 0.55)
          .to(fade, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.65)
          .to(lines, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1 }, 0.75)
          .to(
            contacts,
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 },
            1.0,
          )
          .to(
            tech,
            {
              autoAlpha: 1,
              scale: 1,
              duration: 0.7,
              ease: "back.out(1.6)",
              stagger: { each: 0.045, from: "center" },
            },
            0.45,
          )
          .to(cue, { autoAlpha: 1, duration: 0.6 }, 1.35)
          .add(() => {
            floaters.forEach((el, index) => {
              gsap.to(el, {
                y: index % 2 === 0 ? -10 : 10,
                x: index % 3 === 0 ? 6 : -6,
                duration: 2.4 + (index % 5) * 0.25,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
              });
            });
          }, 1.5);

        const parallax = tech.map((el) => ({
          depth: Number(el.dataset.depth ?? 1),
          x: gsap.quickTo(el, "x", { duration: 0.7, ease: "power3" }),
          y: gsap.quickTo(el, "y", { duration: 0.7, ease: "power3" }),
        }));

        const onMove = (event: PointerEvent) => {
          const rect = section.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;
          for (const item of parallax) {
            item.x(px * 26 * item.depth);
            item.y(py * 26 * item.depth);
          }
        };
        section.addEventListener("pointermove", onMove);

        return () => {
          section.removeEventListener("pointermove", onMove);
          split?.revert();
        };
      });

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-label="Introduction"
      className="relative isolate flex min-h-svh w-full items-center overflow-hidden pt-24 pb-16 text-foreground sm:pt-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[oklch(0.99_0.012_75)]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(58% 55% at 86% 8%, oklch(0.87 0.09 58 / 0.62) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(52% 50% at 6% 96%, oklch(0.9 0.07 62 / 0.5) 0%, transparent 72%)",
          }}
        />
        <div className="hero-dots absolute inset-0" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
        <div className="flex flex-col items-start text-left">
          <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            <span data-hero-name className="inline-block">
              {SITE.name}
            </span>
          </h1>

          <span
            data-hero-accent
            aria-hidden
            className="mt-6 block h-px w-40 bg-gradient-to-r from-primary via-primary/50 to-transparent"
          />

          <p
            data-hero-fade
            className="mt-6 font-mono text-xs uppercase tracking-[0.32em] text-primary sm:text-sm"
          >
            {SITE.designation}
          </p>

          <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {TAGLINE_LINES.map((line) => (
              <span key={line} data-hero-line className="block">
                {line}
              </span>
            ))}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-5">
            <a
              data-hero-contact
              href={CONTACT_HREF}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm outline-none transition-transform duration-200 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/35 opacity-0 blur-md transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100 motion-reduce:hidden"
              />
              <span>Contact me</span>
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
            </a>

            <ul className="flex items-center gap-6">
              {SOCIAL_LINKS.map(({ id, label, href, Icon }) => (
                <li key={id} data-hero-contact>
                  <a
                    href={href}
                    className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-primary focus-visible:text-primary"
                  >
                    <Icon className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div
            data-hero-orbit
            className="relative aspect-square w-full max-w-[20rem] sm:max-w-[26rem] lg:max-w-[32rem]"
          >
            <div
              aria-hidden
              className="absolute inset-[12%] -z-10 rounded-full opacity-70 blur-3xl"
              style={{
                background:
                  "radial-gradient(60% 60% at 50% 50%, oklch(0.78 0.16 52 / 0.5), transparent 72%)",
              }}
            />
            {PLACEMENTS.map(({ item, x, y, size, depth }) => (
              <div
                key={item.id}
                data-hero-tech
                data-depth={depth}
                className="absolute"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div data-hero-float>
                  <span
                    title={item.label}
                    className="flex items-center justify-center rounded-2xl border border-border/70 shadow-sm backdrop-blur-sm"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      color: item.color,
                      backgroundColor: `${item.color}16`,
                    }}
                  >
                    <TechLogo
                      item={item}
                      className="size-[54%]"
                      style={{ color: item.color }}
                    />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        data-hero-cue
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          scroll
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-border">
          <span className="hero-cue-dot absolute inset-x-0 top-0 h-3 bg-primary" />
        </span>
      </div>
    </section>
  );
}
