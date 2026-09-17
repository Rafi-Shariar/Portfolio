"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    // Window-তে lenis রেফারেন্স রাখা যাতে যেকোনো জায়গা থেকে lenis.scrollTo() কল করা যায়
    (window as unknown as { lenis: Lenis }).lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // পেজের সব হ্যাশ লিংকের (#about, #skills, #projects) জাম্প ইন্টারসেপ্ট করা
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // যদি লিংকটি পেজের ভেতরের আইডি বা হ্যাস হয় (যেমন: #projects বা /#projects)
      if (href.startsWith("#") || (href.startsWith("/#") && window.location.pathname === "/")) {
        const hash = href.startsWith("/#") ? href.replace("/", "") : href;
        const targetElement = document.querySelector(hash);

        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement as HTMLElement, {
            offset: -80, // ফিক্সড হেডারের উচ্চতা অনুযায়ী অফসেট
            duration: 1.4,
          });
          // URL হ্যাশ আপডেট করা (ইতিহাস না ভেঙে)
          history.pushState(null, "", hash);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}