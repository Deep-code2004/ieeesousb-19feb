import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import WhyJoinSection from "@/components/WhyJoinSection";
import CountUpSection from "@/components/CountUpSection";
import FounderMessage from "@/components/FounderMessage";
import EventsSection from "@/components/EventsSection";
import PageLayout from "@/components/PageLayout";

export default function Index() {
  useEffect(() => {
    // Smooth scroll to element when hash is in URL
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }

    // Animation for elements when they enter viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated");
            entry.target.classList.add("fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((el) => observer.observe(el));

    // Animate elements on page load with staggered delay
    const animateOnLoadElements = document.querySelectorAll(".animate-on-load");
    animateOnLoadElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("animated");
        el.classList.add("fade-in");
      }, 100 + index * 150);
    });

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <PageLayout>
      <HeroSection />
      <WhyJoinSection />
      <CountUpSection />
      <FounderMessage />
      <EventsSection />
    </PageLayout>
  );
}
