"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function HeroSection() {
  const heroRef = useScrollReveal<HTMLElement>(0.05);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToNext = () => {
    document.getElementById("why-join-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-end justify-center overflow-hidden pt-20 pb-24 w-full"
    >
      {/* Background Image with parallax */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://ieee.socet.edu.in/wp-content/uploads/2021/01/cropped-SOU-IEEE-SB-Header.png)",
          transform: `scale(1.12) translateY(${scrollY * 0.25}px)`,
          transition: "transform 0.05s linear",
        }}
      />

      {/* Overlay — dark at top, fades to page background at bottom */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/75 via-black/60 to-background/95" />

      {/* Animated grid lines overlay */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(0deg, transparent 24%, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05) 76%, transparent 77%), linear-gradient(90deg, transparent 24%, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05) 76%, transparent 77%)",
          backgroundSize: "55px 55px",
        }}
      />

      {/* Content */}
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto text-center">
        {/* Each word clips up independently for a dramatic entrance */}
        <div
          className="mb-6"
          style={{ transform: `translateY(${scrollY * -0.15}px)` }}
        >
          <span className="block text-foreground dark:text-white text-4xl md:text-6xl font-bold tracking-tight">
            <span className="reveal fade-up inline-block">Welcome&nbsp;to</span>
          </span>
          <span className="block text-foreground dark:text-white text-4xl md:text-6xl font-bold tracking-tight">
            <span className="reveal fade-up delay-2 inline-block">Silver&nbsp;Oak&nbsp;University</span>
          </span>
          <span className="block text-foreground dark:text-white text-4xl md:text-6xl font-bold tracking-tight">
            <span className="reveal fade-up delay-3 inline-block">IEEE&nbsp;Student&nbsp;Branch</span>
          </span>
        </div>

        {/* Subline shimmer */}
        <div className="reveal fade-up delay-4 mx-auto mb-8" style={{ maxWidth: 360 }}>
          <span className="heading-line reveal delay-4 mx-auto block" style={{ maxWidth: 200 }} />
        </div>

        {/* Button */}
        <div
          className="flex justify-center"
          style={{ transform: `translateY(${scrollY * -0.08}px)` }}
        >
          <span className="reveal pop delay-5">
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto border-foreground text-foreground hover:bg-foreground hover:text-background dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-gray-900"
            >
              <a href="/events">View Events</a>
            </Button>
          </span>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
        <Button variant="ghost" size="icon" onClick={scrollToNext} className="rounded-full text-white">
          <ChevronDown className="h-6 w-6" />
        </Button>
      </div>
    </section>
  );
}
