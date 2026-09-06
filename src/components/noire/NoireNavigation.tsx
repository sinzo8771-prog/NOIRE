"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Mail, Menu, X, Accessibility } from "lucide-react";
import { mailtoLink, CONCIERGE_EMAIL } from "@/lib/site";
import { ACTS, actNumeral } from "@/data/acts";
import { CopyEmailButton, CONCIERGE_REPLY_PROMISE } from "./ConciergeContact";
import {
  useReducedMotion,
  MOTION_PREF_KEY,
  MOTION_PREF_EVENT,
} from "@/hooks/useReducedMotion";

const CONCIERGE_MAILTO = mailtoLink(
  "Tasting request — NOIRÉ Atelier",
  "Hello NOIRÉ concierge,\n\nI would like to request a private tasting at the atelier.\n\nPreferred dates:\nParty size:\n\nThank you."
);

const MOBILE_MENU_ID = "noire-mobile-menu";

// P1 nav-unification: the header keeps four grouped anchors for space, but
// each one names the chapters it covers (title tooltip) and its active range
// spans exactly those chapters — all eight acts stay lit somewhere, including
// Savor. Mobile overlay, footer, and rail list all eight canonical chapters.
const NAV_ITEMS = [
  { label: "Origin", target: "act-2", acts: "Chapters 02–03 · Origin & Transformation", min: 2, max: 3 },
  { label: "Craft", target: "act-4", acts: "Chapters 04–05 · The Chocolate & The Break", min: 4, max: 5 },
  { label: "Sensory", target: "act-6", acts: "Chapter 06 · Sensory", min: 6, max: 6 },
  { label: "Collection", target: "act-7", acts: "Chapters 07–08 · Collection & Savor", min: 7, max: 8 },
];

interface NoireNavigationProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeAct: number;
  /** Optional Lenis-aware section scroller injected by the page */
  onNavigate?: (sectionId: string) => void;
}

export function NoireNavigation({
  soundEnabled,
  onToggleSound,
  activeAct,
  onNavigate,
}: NoireNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const reducedMotion = useReducedMotion();

  const toggleMotion = () => {
    try {
      localStorage.setItem(MOTION_PREF_KEY, reducedMotion ? "on" : "off");
    } catch {
      // localStorage unavailable — toggle still affects this page load
    }
    window.dispatchEvent(new Event(MOTION_PREF_EVENT));
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActiveFor = (target: string): boolean => {
    const item = NAV_ITEMS.find((i) => i.target === target);
    if (!item) return false;
    return activeAct >= item.min && activeAct <= item.max;
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  // P1.5 / P4.2 — accessible mobile menu: body scroll locked while open and
  // restored on close; Escape closes; Tab focus trapped inside the menu;
  // focus returns to the toggle button after close.
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const firstItem = menuRef.current?.querySelector("button");
    if (firstItem && document.activeElement !== toggleRef.current) {
      (firstItem as HTMLButtonElement).focus();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileMenuOpen(false);
        return;
      }
      if (e.key === "Tab") {
        const focusables = Array.from(
          menuRef.current?.querySelectorAll("button, a[href], [tabindex]") ?? []
        ).filter((el: Element) => !el.hasAttribute("disabled"));
        if (focusables.length === 0) return;
        const first = focusables[0] as HTMLElement;
        const last = focusables[focusables.length - 1] as HTMLElement;
        const active = document.activeElement;
        if (e.shiftKey && (active === first || active === toggleRef.current)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      toggleRef.current?.focus();
    };
  }, [mobileMenuOpen]);
return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${
          isScrolled
            ? "bg-cacao-950/90 backdrop-blur-md border-b border-cacao-700/40 py-3.5"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Brand Wordmark */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("act-1");
            }}
            className="group flex flex-col focus:outline-none focus-visible:ring-1 focus-visible:ring-copper rounded-[2px]"
            aria-label="NOIRÉ Home"
          >
            <span className="font-display text-2xl sm:text-3xl tracking-[0.25em] text-ivory font-normal transition-opacity duration-300 group-hover:text-ivory/80">
              NOIRÉ
            </span>
            <span className="text-[9px] uppercase tracking-[0.35em] text-copper-text -mt-1 font-sans">
              Atelier
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-10 text-xs tracking-widest-editorial uppercase text-ivory/60 font-sans">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => scrollToSection(item.target)}
                title={item.acts}
                data-noire-event="navigation_click"
                data-noire-label={`nav ${item.label.toLowerCase()}`}
                data-noire-target={`#${item.target}`}
                className={`py-2 min-h-[44px] inline-flex items-center transition-colors duration-300 hover:text-ivory focus:outline-none focus-visible:ring-1 focus-visible:ring-copper rounded-[2px] ${
                  isActiveFor(item.target) ? "text-ivory font-medium" : ""
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
{/* Right utility items */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={onToggleSound}
              aria-label={soundEnabled ? "Mute ambient audio" : "Enable ambient audio"}
              aria-pressed={soundEnabled}
              className="hidden sm:flex items-center justify-center space-x-2 text-[11px] uppercase tracking-widest text-ivory/70 hover:text-ivory transition-colors py-1 px-2.5 min-h-[44px] min-w-[44px] rounded-[2px] border border-cacao-700/60 hover:border-copper focus:outline-none focus-visible:ring-1 focus-visible:ring-copper"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-copper-text animate-pulse" />
                  <span className="hidden sm:inline">Audio On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-ivory/40" />
                  <span className="hidden sm:inline">Audio Off</span>
                </>
              )}
            </button>

            {/* Cinematic motion toggle — visible opt-out/opt-in control */}
            <button
              type="button"
              onClick={toggleMotion}
              aria-pressed={reducedMotion}
              aria-label={
                reducedMotion
                  ? "Enable cinematic scroll motion"
                  : "Disable cinematic scroll motion"
              }
              title="Cinematic scroll motion"
              className="hidden sm:flex items-center justify-center space-x-2 text-[11px] uppercase tracking-widest text-ivory/70 hover:text-ivory transition-colors py-1 px-2.5 min-h-[44px] min-w-[44px] rounded-[2px] border border-cacao-700/60 hover:border-copper focus:outline-none focus-visible:ring-1 focus-visible:ring-copper"
            >
              <Accessibility
                className={`w-3.5 h-3.5 ${
                  reducedMotion ? "text-ivory/40" : "text-copper-text"
                }`}
              />
              <span className="hidden lg:inline">
                {reducedMotion ? "Motion Off" : "Motion On"}
              </span>
            </button>

            {/* Concierge inquiry CTA — one Request vocabulary (P1.6) */}
            <a
              href={CONCIERGE_MAILTO}
              data-noire-event="request_tasting_click"
              data-noire-label="nav request a tasting"
              title={`Request a tasting — ${CONCIERGE_REPLY_PROMISE}`}
              className="relative flex items-center space-x-2.5 text-[11px] uppercase tracking-widest text-ivory bg-cacao-850 hover:bg-cacao-800 border border-cacao-700 hover:border-copper px-3.5 py-1.5 rounded-[2px] transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-copper"
              aria-label="Request a tasting with the NOIRÉ concierge by email"
            >
              <Mail className="w-3.5 h-3.5 text-copper-text" />
              <span className="tracking-wider hidden sm:inline">Request a Tasting</span>
              <span className="tracking-wider sm:hidden">Request</span>
            </a>

            {/* P1 handoff fallback: copy the address when no mail app exists.
                Tucked beside the CTA on larger screens; the mobile menu and
                footer carry the full fallback block. */}
            <span className="hidden lg:inline-flex">
              <CopyEmailButton label="nav request a tasting" />
            </span>

            {/* Mobile Menu Toggle */}
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-ivory/80 hover:text-ivory focus:outline-none focus-visible:ring-1 focus-visible:ring-copper rounded-[2px]"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls={MOBILE_MENU_ID}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
<div
          ref={menuRef}
          id={MOBILE_MENU_ID}
          className="fixed inset-0 z-30 bg-cacao-950/98 flex flex-col justify-center px-10 md:hidden animate-in fade-in-0 duration-300"
        >
          <nav className="flex flex-col space-y-1 text-xl tracking-widest font-display text-ivory" aria-label="Story chapters">
            {ACTS.map((act) => (
              <button
                key={act.id}
                type="button"
                onClick={() => scrollToSection(act.target)}
                data-noire-event="navigation_click"
                data-noire-label={`mobile ${act.label.toLowerCase()}`}
                data-noire-target={`#${act.target}`}
                aria-current={activeAct === act.id ? "location" : undefined}
                className={`text-left py-2 transition-colors rounded-[2px] focus:outline-none focus-visible:ring-1 focus-visible:ring-copper ${
                  activeAct === act.id ? "text-copper-text" : "hover:text-copper-text"
                }`}
              >
                {actNumeral(act.id)} &mdash; {act.label}
              </button>
            ))}
          </nav>
          <div className="mt-10 pt-8 border-t border-cacao-700 flex flex-col space-y-4">
            <p className="text-xs uppercase tracking-widest text-ivory/50">
              Chocolate, Unhurried.
            </p>
            {/* P2: audio + motion controls live here on xs, where the header
                shows only the CTA + menu toggle to protect 375px widths. */}
            <div className="flex flex-wrap gap-3 sm:hidden">
              <button
                type="button"
                onClick={onToggleSound}
                aria-label={soundEnabled ? "Mute ambient audio" : "Enable ambient audio"}
                aria-pressed={soundEnabled}
                className="inline-flex items-center justify-center space-x-2 text-[11px] uppercase tracking-widest text-ivory/70 min-h-[44px] px-3 rounded-[2px] border border-cacao-700/60 focus:outline-none focus-visible:ring-1 focus-visible:ring-copper"
              >
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-copper-text" aria-hidden="true" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-ivory/40" aria-hidden="true" />
                )}
                <span>{soundEnabled ? "Audio On" : "Audio Off"}</span>
              </button>
              <button
                type="button"
                onClick={toggleMotion}
                aria-pressed={reducedMotion}
                aria-label={
                  reducedMotion
                    ? "Enable cinematic scroll motion"
                    : "Disable cinematic scroll motion"
                }
                className="inline-flex items-center justify-center space-x-2 text-[11px] uppercase tracking-widest text-ivory/70 min-h-[44px] px-3 rounded-[2px] border border-cacao-700/60 focus:outline-none focus-visible:ring-1 focus-visible:ring-copper"
              >
                <Accessibility
                  className={`w-3.5 h-3.5 ${
                    reducedMotion ? "text-ivory/40" : "text-copper-text"
                  }`}
                  aria-hidden="true"
                />
                <span>{reducedMotion ? "Motion Off" : "Motion On"}</span>
              </button>
            </div>
            <a
              href={CONCIERGE_MAILTO}
              data-noire-event="request_tasting_click"
              data-noire-label="mobile request a tasting"
              className="inline-flex items-center space-x-2 text-sm uppercase tracking-widest text-ivory rounded-[2px] focus:outline-none focus-visible:ring-1 focus-visible:ring-copper"
            >
              <Mail className="w-4 h-4 text-copper-text" />
              <span>Request a Tasting</span>
            </a>
            <p className="text-[11px] text-ivory/50">
              <span>{CONCIERGE_EMAIL} · </span>
              <CopyEmailButton label="mobile request a tasting" />
              <span className="block mt-1 text-copper-text/90 uppercase tracking-widest text-[10px]">
                {CONCIERGE_REPLY_PROMISE}
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}