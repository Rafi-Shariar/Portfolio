import AboutSection from "@/components/homepage/AboutSection";
import HeroBanner from "@/components/homepage/Banner";
import FeaturedProjectsSection from "@/components/homepage/projects/FeaturedProjectSection";
import SkillsSection from "@/components/homepage/SkillSection";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <HeroBanner />
      <AboutSection/>
      <SkillsSection/>
      <FeaturedProjectsSection/>
    </div>
  );
}
