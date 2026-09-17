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
    // ১. Lenis ইনিশিয়ালাইজেশন (ফাস্ট এবং লাক্সারি রেসপন্সিভ টিউনিং)
    const lenis = new Lenis({
      duration: 1.1, // স্ক্রোলের সময়কাল (খুব বেশি দিলে স্লো লাগে, ১.০ - ১.২ হচ্ছে সুইট স্পট)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // এক্সপোনেনশিয়াল ইজিং (বাটারি স্মুথ ফিল)
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    // ২. GSAP ScrollTrigger এর সাথে সিঙ্ক করা
    lenis.on("scroll", ScrollTrigger.update);

    // GSAP টিকারে Lenis কে যুক্ত করা (আলাদা requestAnimationFrame লুপের দরকার নেই)
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0); // ল্যাগ স্মুথিং অফ রাখলে স্ক্রোল কখনোই স্টুটার/আটকে থাকবে না

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
