import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Event } from "@/types";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const SAMPLE_EVENTS: Event[] = [
  {
    id: "1",
    title: "AWS Student Community Day 2025",
    description:
      "The AWS Cloud Clubs Student Community Day Ahmedabad 2025 successfully bridged theoretical understanding with practical application, offering participants insights into emerging cloud technologies, AI-driven development methodologies, as well as modern machine learning workflows. Through expert keynotes, live demonstrations, interactive discussions and hands-on exercises, attendees gained first-hand experience of how cloud computing alongside artificial intelligence is transforming enterprise architecture, software development and career opportunities.",
    date: "December 12, 2025",
    time: "9:00 A.M. Onwards",
    image:
      "http://ieee.socet.edu.in/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-20-at-2.15.31-PM.jpeg",
    link: `/eventdetails/DuPyhhQkGHTucs8EfBhZ`,
  },
  {
    id: "2",
    title: "SOU Talks: Leadership beyond the call of duty",
    description:
      "The session by Lieutenant General Asit Mistry left the audience with a meaningful understanding of national security and the realities of India's strategic environment. His clear explanations, real-world examples and structured insights helped students grasp complex military decisions through the lens of leadership, discipline and responsibility, giving them a deeper appreciation for national service, strategic thinking and personal growth.",
    date: "December 4, 2025",
    time: "02:00 P.M. Onwards",
    image:
      "http://ieee.socet.edu.in/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-20-at-2.10.53-PM.jpeg",
    link: `/eventdetails/iCW3qDRouMMfkDAozmEY`,
  },
];

/* ─────────────────────────────────────────────
   SLIDE CARD — manages its own enter / exit classes
───────────────────────────────────────────── */
interface SlideCardProps {
  event: Event;
  sliding: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
}

function SlideCard({ event, sliding, expanded, onToggleExpand }: SlideCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prevSliding = useRef(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (sliding && !prevSliding.current) {
      // Slide current card out to the LEFT
      el.classList.remove("es-slide-in", "es-prepare");
      el.classList.add("es-slide-out");
    }

    if (!sliding && prevSliding.current) {
      // Instantly position new card off-screen to the RIGHT (no transition)
      el.classList.remove("es-slide-out", "es-slide-in");
      el.classList.add("es-prepare");

      // Force reflow so the browser registers the snap position
      void el.offsetWidth;

      // Now animate it sliding in from right → center
      el.classList.remove("es-prepare");
      el.classList.add("es-slide-in");
    }

    prevSliding.current = sliding;
  }, [sliding]);

  return (
    <div ref={cardRef} className="es-card es-slide-in">
      {/* Left: image */}
      <div className="es-img-side">
        <img src={event.image} alt={event.title} />
      </div>

      {/* Right: details */}
      <div className="es-detail-side">
        <h3 className="es-title">{event.title}</h3>

        <div className="es-meta">
          <span className="es-meta-row">
            <Calendar className="es-meta-icon" />
            {event.date}
          </span>
          <span className="es-meta-row">
            <Clock className="es-meta-icon" />
            {event.time}
          </span>
        </div>

        <div className={cn("es-desc-wrap", expanded && "es-desc-wrap--open")}>
          <p className="es-desc">{event.description}</p>
        </div>

        {event.description.length > 200 && (
          <button className="es-read-toggle" onClick={onToggleExpand}>
            {expanded ? "Read less" : "Read more"}
          </button>
        )}

        <a href={event.link} rel="noopener noreferrer" className="es-learn">
          Learn more <ArrowRight className="es-learn-arrow" />
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function EventsSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>(0.08);
  const [activeIdx, setActiveIdx] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerNext = (nextIdx?: number) => {
    if (sliding) return;
    setSliding(true);
    setExpanded(false);
    timeoutRef.current = setTimeout(() => {
      setActiveIdx((prev) =>
        nextIdx !== undefined ? nextIdx : (prev + 1) % SAMPLE_EVENTS.length
      );
      setSliding(false);
    }, 520); // matches slide-out duration
  };

  /* Auto-advance */
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => triggerNext(), expanded ? 12000 : 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [sliding, expanded, activeIdx]);

  /* Cleanup */
  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return (
    <>
      <style>{`
        // @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── section ── */
        .es-section {
          font-family: 'DM Sans', sans-serif;
          padding: 3rem 1rem 2.5rem;
          overflow: hidden;
        }

        /* ── heading ── */
        .es-heading {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          letter-spacing: -0.03em;
          text-align: center;
          margin-bottom: 0.4rem;
        }
        .es-underline {
          width: 3rem;
          height: 3px;
          background: var(--primary, #6366f1);
          border-radius: 99px;
          margin: 0 auto 2rem;
        }

        /* ── outer clip — hides the card when it flies off screen ── */
        .es-viewport {
          max-width: 860px;
          margin: 0 auto;
          overflow: hidden;
          border-radius: 1.25rem;
        }

        /* ── card ── */
        .es-card {
          display: flex;
          flex-direction: row;
          background: var(--card, #ffffff);
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 1.25rem;
          overflow: hidden;
          min-height: 270px;
        }

        /* Slide states */
        .es-slide-in {
          transform: translateX(0);
          opacity: 1;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity  0.45s ease;
        }
        /* Card exits to the LEFT */
        .es-slide-out {
          transform: translateX(-110%);
          opacity: 0;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity  0.45s ease;
        }
        /* New card snaps to RIGHT instantly (no transition) */
        .es-prepare {
          transform: translateX(110%);
          opacity: 0;
          transition: none;
        }

        @media (max-width: 620px) {
          .es-card { flex-direction: column; }
        }

        /* ── image side ── */
        .es-img-side {
          width: 44%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          background: var(--muted, #f8f9fa);
        }
        @media (max-width: 620px) {
          .es-img-side { width: 100%; padding: 1rem 1rem 0; background: transparent; }
        }
        .es-img-side img {
          width: 100%;
          max-height: 210px;
          object-fit: contain;
          border-radius: 0.6rem;
          display: block;
        }

        /* ── detail side ── */
        .es-detail-side {
          flex: 1;
          padding: 1.5rem 1.5rem 1.25rem;
          display: flex;
          flex-direction: column;
        }

        .es-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          line-height: 1.35;
          margin-bottom: 0.6rem;
        }

        .es-meta {
          display: flex;
          flex-direction: column;
          gap: 0.22rem;
          margin-bottom: 0.75rem;
        }
        .es-meta-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.76rem;
          color: var(--muted-foreground, #6b7280);
        }
        .es-meta-icon { width: 0.75rem; height: 0.75rem; flex-shrink: 0; }

        .es-desc-wrap {
          max-height: 4.8rem;
          overflow: hidden;
          transition: max-height 0.45s ease;
        }
        .es-desc-wrap--open { max-height: 400px; }
        .es-desc {
          font-size: 0.78rem;
          line-height: 1.65;
          color: var(--muted-foreground, #6b7280);
        }

        .es-read-toggle {
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--primary, #6366f1);
          background: none;
          border: none;
          padding: 0.25rem 0;
          cursor: pointer;
          display: inline-block;
          margin-top: 0.15rem;
          text-align: left;
        }
        .es-read-toggle:hover { text-decoration: underline; }

        .es-learn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          margin-top: auto;
          padding-top: 0.85rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--primary, #6366f1);
          text-decoration: none;
          transition: gap 0.2s ease;
        }
        .es-learn:hover { gap: 0.55rem; }
        .es-learn-arrow { width: 0.85rem; height: 0.85rem; }

        /* ── dots ── */
        .es-dots {
          display: flex;
          justify-content: center;
          gap: 0.45rem;
          margin-top: 1.25rem;
        }
        .es-dot {
          height: 0.5rem;
          width: 0.5rem;
          border-radius: 99px;
          border: none;
          cursor: pointer;
          background: var(--muted, #d1d5db);
          transition: background 0.3s ease, width 0.3s ease;
        }
        .es-dot.es-dot--active {
          background: var(--primary, #6366f1);
          width: 1.4rem;
        }

        /* ── scroll reveal (uses global .reveal system) ── */
        .es-aos {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .es-aos.es-animated { opacity: 1; transform: translateY(0); }
        .es-aos:nth-child(2) { transition-delay: 0.1s; }
        .es-aos:nth-child(3) { transition-delay: 0.18s; }
        .es-aos:nth-child(4) { transition-delay: 0.24s; }
      `}</style>

      <div ref={sectionRef} className="es-section section-container">

        {/* Heading — heavy flip entrance */}
        <div className="reveal flip-up">
          <h2 className="es-heading">Recent Events</h2>
          <div className="heading-line" style={{ maxWidth: 80, margin: '0 auto 2rem' }} />
        </div>

        {/* Card viewport — zooms up hard */}
        <div className="reveal zoom-fade delay-2 es-viewport">
          <SlideCard
            event={SAMPLE_EVENTS[activeIdx]}
            sliding={sliding}
            expanded={expanded}
            onToggleExpand={() => setExpanded((p) => !p)}
          />
        </div>

        {/* Dots */}
        <div className="reveal fade-up delay-3 es-dots">
          {SAMPLE_EVENTS.map((_, idx) => (
            <button
              key={idx}
              className={cn("es-dot", idx === activeIdx && "es-dot--active")}
              onClick={() => triggerNext(idx)}
              aria-label={`Event ${idx + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="reveal pop delay-4 text-center mt-5">
          <Button asChild>
            <a href="/events">View All Events</a>
          </Button>
        </div>
      </div>
    </>
  );
}
