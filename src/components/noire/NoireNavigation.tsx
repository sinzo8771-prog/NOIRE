"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX, ShoppingBag, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoireNavigationProps {
  cartCount: number;
  onOpenCart: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeAct: number;
  /** Optional Lenis-aware section scroller injected by the page */
  onNavigate?: (sectionId: string) => void;
}

export function NoireNavigation({
  cartCount,
  onOpenCart,
  soundEnabled,
  onToggleSound,
  activeAct,
  onNavigate,
}: NoireNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    // Prefer the Lenis-aware scroller passed down from the page so programmatic
    // navigation honors the same smoothing/easing as wheel scrolling
    if (onNavigate) {
      onNavigate(id);
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${
          isScrolled
            ? "bg-[#080604]/90 backdrop-blur-md border-b border-[#342015]/40 py-3.5"
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
            className="group flex flex-col focus:outline-none focus:ring-1 focus:ring-[#9B6742]"
            aria-label="NOIRÉ Home"
          >
            <span className="font-display text-2xl sm:text-3xl tracking-[0.25em] text-[#F3E8D3] font-normal transition-opacity duration-300 group-hover:text-[#F3E8D3]/80">
              NOIRÉ
            </span>
            <span className="text-[9px] uppercase tracking-[0.35em] text-[#9B6742] -mt-1 font-sans">
              Atelier
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-10 text-xs tracking-widest-editorial uppercase text-[#F3E8D3]/60 font-sans">
            <button
              onClick={() => scrollToSection("act-2")}
              className={`transition-colors duration-300 hover:text-[#F3E8D3] focus:outline-none focus:text-[#F3E8D3] ${
                activeAct >= 1 && activeAct <= 3 ? "text-[#F3E8D3] font-medium" : ""
              }`}
            >
              Origin
            </button>
            <button
              onClick={() => scrollToSection("act-4")}
              className={`transition-colors duration-300 hover:text-[#F3E8D3] focus:outline-none focus:text-[#F3E8D3] ${
                activeAct === 4 || activeAct === 5 ? "text-[#F3E8D3] font-medium" : ""
              }`}
            >
              Craft
            </button>
            <button
              onClick={() => scrollToSection("act-6")}
              className={`transition-colors duration-300 hover:text-[#F3E8D3] focus:outline-none focus:text-[#F3E8D3] ${
                activeAct === 6 ? "text-[#F3E8D3] font-medium" : ""
              }`}
            >
              Sensory
            </button>
            <button
              onClick={() => scrollToSection("act-7")}
              className={`transition-colors duration-300 hover:text-[#F3E8D3] focus:outline-none focus:text-[#F3E8D3] ${
                activeAct === 7 ? "text-[#F3E8D3] font-medium" : ""
              }`}
            >
              Collection
            </button>
          </nav>

          {/* Right utility items */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Audio Toggle */}
            <button
              onClick={onToggleSound}
              className="flex items-center space-x-2 text-[11px] uppercase tracking-widest text-[#F3E8D3]/70 hover:text-[#F3E8D3] transition-colors py-1 px-2.5 rounded-[2px] border border-[#342015]/60 hover:border-[#9B6742] focus:outline-none focus:ring-1 focus:ring-[#9B6742]"
              aria-label={soundEnabled ? "Mute ambient audio" : "Enable ambient audio"}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#9B6742] animate-pulse" />
                  <span className="hidden sm:inline">Audio On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#F3E8D3]/40" />
                  <span className="hidden sm:inline">Audio Off</span>
                </>
              )}
            </button>

            {/* Shopping Bag Trigger */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center space-x-2.5 text-[11px] uppercase tracking-widest text-[#F3E8D3] bg-[#1A100B] hover:bg-[#261710] border border-[#342015] hover:border-[#9B6742] px-3.5 py-1.5 rounded-[2px] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#9B6742]"
              aria-label={`Open shopping bag with ${cartCount} items`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#9B6742]" />
              <span className="tracking-wider">Bag</span>
              <span className="flex items-center justify-center h-4 min-w-[16px] px-1 bg-[#9B6742] text-[#F3E8D3] text-[10px] font-medium rounded-full">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-[#F3E8D3]/80 hover:text-[#F3E8D3] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#080604]/98 flex flex-col justify-center px-10 md:hidden animate-in fade-in-0 duration-300">
          <nav className="flex flex-col space-y-6 text-xl tracking-widest font-display text-[#F3E8D3]">
            <button
              onClick={() => scrollToSection("act-1")}
              className="text-left hover:text-[#9B6742] transition-colors"
            >
              01 &mdash; The Craving
            </button>
            <button
              onClick={() => scrollToSection("act-2")}
              className="text-left hover:text-[#9B6742] transition-colors"
            >
              02 &mdash; Origin & Cacao
            </button>
            <button
              onClick={() => scrollToSection("act-3")}
              className="text-left hover:text-[#9B6742] transition-colors"
            >
              03 &mdash; Transformation
            </button>
            <button
              onClick={() => scrollToSection("act-6")}
              className="text-left hover:text-[#9B6742] transition-colors"
            >
              04 &mdash; Sensory Notes
            </button>
            <button
              onClick={() => scrollToSection("act-7")}
              className="text-left hover:text-[#9B6742] transition-colors text-[#9B6742]"
            >
              05 &mdash; Reserve Collection
            </button>
          </nav>
          <div className="mt-12 pt-8 border-t border-[#342015] flex flex-col space-y-4">
            <p className="text-xs uppercase tracking-widest text-[#F3E8D3]/50">
              Chocolate, Unhurried.
            </p>
            <p className="text-[11px] text-[#F3E8D3]/40">
              Hand-tempered single-origin artisan chocolate.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
