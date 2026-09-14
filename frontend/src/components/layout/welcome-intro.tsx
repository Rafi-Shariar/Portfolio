"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { GATE_INTRO_ONCE, markIntroSeen } from "@/lib/intro-storage";
import { cn } from "@/lib/utils";
import { INTRO_ICONS, type IntroDirection } from "./intro-icons";

const NAME_GRADIENT =
  "linear-gradient(90deg, oklch(0.70 0.19 45), oklch(0.80 0.15 200), oklch(0.68 0.20 300), oklch(0.85 0.19 130))";

const TERMINAL_LINES = [
  { text: "$ npm run build", className: "text-white/80" },
  { text: "▲ compiling portfolio…", className: "text-white/55" },
  {
    text: "✔ 42 modules transformed",
    className: "text-[oklch(0.85_0.19_130)]",
  },
  {
    text: "✔ optimized for production",
    className: "text-[oklch(0.85_0.19_130)]",
  },
];

const ENTRY: Record<IntroDirection, { x: string; y: string; rotate: number }> =
  {
    top: { x: "0vw", y: "-130vh", rotate: -110 },
    right: { x: "130vw", y: "0vh", rotate: 110 },
    bottom: { x: "0vw", y: "130vh", rotate: 110 },
    left: { x: "-130vw", y: "0vh", rotate: -110 },
  };

const PANEL_DIRS: [number, number][] = [
  [-130, -130],
  [130, -130],
  [-130, 130],
  [130, 130],
];

export function WelcomeIntro() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useGSAP(
    () => {
      const overlay = overlayRef.current;
      if (!overlay) return;

      const alreadySeen = document.documentElement.dataset.intro === "seen";
      markIntroSeen();

      if (GATE_INTRO_ONCE && alreadySeen) {
        setActive(false);
        return;
      }

      const query = <T extends Element>(selector: string) =>
        Array.from(overlay.querySelectorAll<T>(selector));

      const bg = overlay.querySelector<HTMLElement>("[data-intro-bg]");
      const scene = overlay.querySelector<HTMLElement>("[data-intro-scene]");
      const iconsLayer =
        overlay.querySelector<HTMLElement>("[data-intro-icons]");
      const hud = overlay.querySelector<HTMLElement>("[data-intro-hud]");
      const identity = overlay.querySelector<HTMLElement>(
        "[data-intro-identity]",
      );
      const terminal = overlay.querySelector<HTMLElement>(
        "[data-intro-terminal]",
      );
      const caret = overlay.querySelector<HTMLElement>("[data-intro-caret]");
      const barFill = overlay.querySelector<HTMLElement>(
        "[data-intro-bar-fill]",
      );
      const percent = overlay.querySelector<HTMLElement>(
        "[data-intro-percent]",
      );
      const nameEl = overlay.querySelector<HTMLElement>("[data-intro-name]");
      const dot = overlay.querySelector<HTMLElement>("[data-intro-dot]");
      const role = overlay.querySelector<HTMLElement>("[data-intro-role]");
      const underline = overlay.querySelector<HTMLElement>(
        "[data-intro-underline]",
      );

      const brackets = query<HTMLElement>("[data-intro-bracket]");
      const labels = query<HTMLElement>("[data-intro-hud-label]");
      const icons = query<HTMLElement>("[data-intro-icon]");
      const lines = query<HTMLElement>("[data-intro-line]");
      const panels = query<HTMLElement>("[data-intro-panel]");
      const topBar = overlay.querySelector<HTMLElement>("[data-intro-bar-top]");
      const bottomBar = overlay.querySelector<HTMLElement>(
        "[data-intro-bar-bottom]",
      );

      const split = nameEl ? SplitText.create(nameEl, { type: "chars" }) : null;

      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        document.body.style.overflow = previousOverflow;
        setActive(false);
        requestAnimationFrame(() => ScrollTrigger.refresh());
      };

      for (const icon of icons) {
        const from = (icon.dataset.introFrom ?? "top") as IntroDirection;
        const entry = ENTRY[from];
        gsap.set(icon, {
          xPercent: -50,
          yPercent: -50,
          x: entry.x,
          y: entry.y,
          rotate: entry.rotate,
          scale: 0.6,
          autoAlpha: 0,
        });
      }

      gsap.set(brackets, { autoAlpha: 0, scale: 0.7 });
      gsap.set(labels, { autoAlpha: 0, y: 8 });
      gsap.set(lines, { autoAlpha: 0 });
      gsap.set(caret, { autoAlpha: 0 });
      gsap.set(terminal, {
        autoAlpha: 0,
        scale: 0.92,
        rotateX: 12,
        transformOrigin: "50% 100%",
        transformPerspective: 800,
      });
      gsap.set(barFill, { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(bg, { autoAlpha: 0 });
      gsap.set(topBar, { yPercent: -100 });
      gsap.set(bottomBar, { yPercent: 100 });
      gsap.set(panels, { autoAlpha: 0 });
      gsap.set(dot, { autoAlpha: 0 });
      gsap.set(role, { autoAlpha: 0, y: 14 });
      gsap.set(underline, { autoAlpha: 0, scaleX: 0 });
      if (split) {
        gsap.set(split.chars, {
          autoAlpha: 0,
          yPercent: 120,
          rotateX: -70,
          transformPerspective: 600,
        });
      }

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        gsap.set([iconsLayer, hud, terminal, topBar, bottomBar], {
          autoAlpha: 0,
        });
        if (split) {
          gsap.set(split.chars, { autoAlpha: 1, yPercent: 0, rotateX: 0 });
        }
        gsap.set([dot, role], { autoAlpha: 1, y: 0 });
        gsap.set(underline, { autoAlpha: 1, scaleX: 1 });
        gsap.to(overlay, {
          autoAlpha: 0,
          duration: 0.4,
          delay: 0.9,
          onComplete: finish,
        });
        return () => {
          document.body.style.overflow = previousOverflow;
          split?.revert();
        };
      }

      const counter = { value: 0 };
      let float: ReturnType<typeof gsap.to> | null = null;
      let caretBlink: ReturnType<typeof gsap.to> | null = null;

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: finish,
      });

      tl.to(bg, { autoAlpha: 1, duration: 0.5 }, 0)
        .to(topBar, { yPercent: 0, duration: 0.5 }, 0.05)
        .to(bottomBar, { yPercent: 0, duration: 0.5 }, 0.05)
        .to(
          brackets,
          { autoAlpha: 1, scale: 1, duration: 0.45, stagger: 0.08 },
          0.25,
        )
        .to(labels, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.06 }, 0.45)
        .to(
          icons,
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            duration: 0.7,
            ease: "power4.out",
            stagger: { each: 0.045, from: "edges" },
          },
          0.35,
        )
        .to(scene, { scale: 1.05, duration: 3.1, ease: "none" }, 0)
        .to(
          terminal,
          { autoAlpha: 1, scale: 1, rotateX: 0, duration: 0.45 },
          0.95,
        )
        .add(() => {
          caretBlink = gsap.to(caret, {
            autoAlpha: 0.2,
            duration: 0.5,
            yoyo: true,
            repeat: -1,
          });
        }, 1.0)
        .to(barFill, { scaleX: 1, duration: 1.3, ease: "power2.inOut" }, 1.0)
        .to(
          counter,
          {
            value: 100,
            duration: 1.3,
            ease: "power2.inOut",
            onUpdate: () => {
              if (percent) {
                percent.textContent = String(
                  Math.round(counter.value),
                ).padStart(3, "0");
              }
            },
          },
          1.0,
        );

      let cursor = 1.0;
      for (const [index, line] of TERMINAL_LINES.entries()) {
        const el = lines[index];
        tl.set(el, { autoAlpha: 1 }, cursor);
        tl.to(
          el,
          { duration: line.text.length * 0.01, text: line.text, ease: "none" },
          cursor,
        );
        cursor += line.text.length * 0.01 + 0.04;
      }

      tl.add(() => {
        float = gsap.to(icons, {
          y: "+=9",
          rotate: "+=3",
          duration: 1.1,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: { each: 0.08 },
        });
      }, 1.65)
        .add(() => caretBlink?.kill(), 2.0)
        .set(caret, { autoAlpha: 0 }, 2.0)
        .to(
          terminal,
          {
            autoAlpha: 0,
            y: -28,
            scale: 0.95,
            duration: 0.3,
            ease: "power2.in",
          },
          2.02,
        );

      if (split) {
        tl.to(
          split.chars,
          {
            autoAlpha: 1,
            yPercent: 0,
            rotateX: 0,
            duration: 0.4,
            ease: "power4.out",
            stagger: 0.02,
          },
          2.35,
        );
      }

      tl.to(dot, { autoAlpha: 1, duration: 0.25 }, 2.75)
        .to(role, { autoAlpha: 1, y: 0, duration: 0.28 }, 2.8)
        .to(underline, { autoAlpha: 1, scaleX: 1, duration: 0.28 }, 2.85)
        .to(hud, { autoAlpha: 0, duration: 0.3 }, 3.1)
        .add(() => float?.kill(), 3.12)
        .to(
          icons,
          {
            autoAlpha: 0,
            scale: 0.5,
            x: (_index, el) =>
              ENTRY[(el.dataset.introFrom ?? "top") as IntroDirection].x,
            y: (_index, el) =>
              ENTRY[(el.dataset.introFrom ?? "top") as IntroDirection].y,
            duration: 0.45,
            ease: "power2.in",
            stagger: 0.02,
          },
          3.14,
        )
        .to(
          identity,
          { autoAlpha: 0, y: -16, duration: 0.3, ease: "power2.in" },
          3.15,
        )
        .to(scene, { scale: 1.12, duration: 0.45, ease: "power2.in" }, 3.1)
        .to(bg, { autoAlpha: 0, duration: 0.4 }, 3.2)
        .to(topBar, { yPercent: -100, duration: 0.35, ease: "power2.in" }, 3.2)
        .to(
          bottomBar,
          { yPercent: 100, duration: 0.35, ease: "power2.in" },
          3.2,
        )
        .set(panels, { autoAlpha: 1 }, 3.28)
        .to(
          panels,
          {
            xPercent: (index) => PANEL_DIRS[index][0],
            yPercent: (index) => PANEL_DIRS[index][1],
            duration: 0.55,
            ease: "power4.inOut",
            stagger: 0.04,
          },
          3.32,
        );

      const skip = () => {
        if (done) return;
        tl.progress(1);
        finish();
      };
      window.addEventListener("pointerdown", skip, { once: true });
      window.addEventListener("keydown", skip, { once: true });
      window.addEventListener("wheel", skip, { once: true, passive: true });
      window.addEventListener("touchstart", skip, {
        once: true,
        passive: true,
      });

      const cap = window.setTimeout(skip, 4000);

      return () => {
        window.clearTimeout(cap);
        window.removeEventListener("pointerdown", skip);
        window.removeEventListener("keydown", skip);
        window.removeEventListener("wheel", skip);
        window.removeEventListener("touchstart", skip);
        float?.kill();
        caretBlink?.kill();
        split?.revert();
        document.body.style.overflow = previousOverflow;
      };
    },
    { scope: overlayRef },
  );

  if (!active) return null;

  return (
    <div
      ref={overlayRef}
      data-welcome-intro
      aria-hidden
      className="fixed inset-0 z-[100] overflow-hidden bg-[oklch(0.11_0.02_40)]"
    >
      <div data-intro-bg className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 120% at 50% 38%, oklch(0.19 0.05 45), oklch(0.11 0.02 40) 70%)",
          }}
        />
        <div className="intro-grid absolute inset-0" />
        <div className="intro-scanline" />
        <div className="intro-vignette absolute inset-0" />
        <div className="intro-grain absolute inset-0" />
      </div>

      <div
        data-intro-scene
        className="absolute inset-0 z-20 will-change-transform"
      >
        <div data-intro-icons className="absolute inset-0">
          {INTRO_ICONS.map(({ id, Icon, x, y, from, color, mobileHidden }) => (
            <div
              key={id}
              data-intro-icon
              data-intro-from={from}
              className={cn(
                "absolute will-change-transform",
                mobileHidden && "hidden sm:block",
              )}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <Icon
                className="size-6 sm:size-8"
                style={{ color, filter: `drop-shadow(0 0 10px ${color})` }}
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="flex w-full max-w-xl flex-col items-center gap-8">
            <div data-intro-terminal className="w-full max-w-md">
              <div className="border border-white/10 bg-[oklch(0.15_0.03_40)/85] shadow-[0_0_60px_rgba(255,140,80,0.08)] backdrop-blur-md">
                <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2.5">
                  <span className="size-2 bg-[oklch(0.70_0.19_45)]" />
                  <span className="size-2 bg-[oklch(0.80_0.15_200)]" />
                  <span className="size-2 bg-[oklch(0.85_0.19_130)]" />
                  <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                    rafi@portfolio: ~/build
                  </span>
                </div>
                <div className="px-4 py-3.5">
                  <div className="min-h-24 font-mono text-xs leading-6 sm:text-sm">
                    {TERMINAL_LINES.map((line) => (
                      <p
                        key={line.text}
                        data-intro-line
                        className={line.className}
                      />
                    ))}
                    <span
                      data-intro-caret
                      className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-[oklch(0.85_0.19_130)]"
                    />
                  </div>
                </div>
                <div className="h-1 w-full bg-white/10">
                  <div
                    data-intro-bar-fill
                    className="h-full w-full"
                    style={{ backgroundImage: NAME_GRADIENT }}
                  />
                </div>
              </div>
            </div>

            <div
              data-intro-identity
              className="flex flex-col items-center gap-3"
            >
              <h1
                className="text-center text-4xl font-bold tracking-tight sm:text-6xl"
                style={{
                  backgroundImage: NAME_GRADIENT,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                <span data-intro-name>Rafi Shariar</span>
                <span data-intro-dot>.</span>
              </h1>
              <p
                data-intro-role
                className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-white/70 sm:text-xs"
              >
                Full-Stack Developer
              </p>
              <span
                data-intro-underline
                className="block h-0.5 w-28 sm:w-36"
                style={{ backgroundImage: NAME_GRADIENT }}
              />
            </div>
          </div>
        </div>
      </div>

      <div data-intro-hud className="absolute inset-0 z-30">
        <div
          data-intro-bracket
          className="absolute left-2 top-2 size-6 border-l-2 border-t-2 border-white/40 sm:size-8"
        />
        <div
          data-intro-bracket
          className="absolute right-2 top-2 size-6 border-r-2 border-t-2 border-white/40 sm:size-8"
        />
        <div
          data-intro-bracket
          className="absolute bottom-2 left-2 size-6 border-b-2 border-l-2 border-white/40 sm:size-8"
        />
        <div
          data-intro-bracket
          className="absolute bottom-2 right-2 size-6 border-b-2 border-r-2 border-white/40 sm:size-8"
        />
        <p
          data-intro-hud-label
          className="absolute left-3 top-16 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 sm:left-5"
        >
          portfolio · v2.0
        </p>
        <p
          data-intro-hud-label
          className="absolute right-3 top-16 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 sm:right-5"
        >
          boot sequence
        </p>
        <p
          data-intro-hud-label
          className="absolute bottom-16 left-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 sm:left-5"
        >
          stack: react + node
        </p>
        <p
          data-intro-percent
          className="absolute bottom-16 right-3 font-mono text-[10px] tracking-[0.25em] text-white/70 sm:right-5"
        >
          000
        </p>
      </div>

      <div
        data-intro-bar-top
        className="absolute inset-x-0 top-0 z-40 h-14 border-b border-white/10 bg-[oklch(0.09_0.02_40)] sm:h-16"
      />
      <div
        data-intro-bar-bottom
        className="absolute inset-x-0 bottom-0 z-40 h-14 border-t border-white/10 bg-[oklch(0.09_0.02_40)] sm:h-16"
      />

      {PANEL_DIRS.map(([x, y], index) => (
        <div
          key={`${x}-${y}`}
          data-intro-panel
          className={cn(
            "absolute z-50 h-[51%] w-[51%] bg-[oklch(0.12_0.03_40)]",
            index === 0 && "left-0 top-0",
            index === 1 && "right-0 top-0",
            index === 2 && "bottom-0 left-0",
            index === 3 && "bottom-0 right-0",
          )}
        />
      ))}
    </div>
  );
}
