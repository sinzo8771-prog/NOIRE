"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { mailtoLink } from "@/lib/site";
import { CONC_PROCESS } from "@/data/products";

interface ChocolateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChocolateRoomModal({ isOpen, onClose }: ChocolateRoomModalProps) {
  const [selectedFlight, setSelectedFlight] = useState("grand-cru");
  const [confirmed, setConfirmed] = useState(false);

  // Reset confirmation state whenever the dialog is dismissed
  useEffect(() => {
    if (!isOpen) {
      setConfirmed(false);
    }
  }, [isOpen]);

  const flights = [
    {
      id: "grand-cru",
      name: "Grand Cru Single-Terroir Flight",
      desc: "Four unblended harvests paired with single-estate cold brew infusions.",
      duration: "60 Minutes",
    },
    {
      id: "botanical-conche",
      name: `${CONC_PROCESS.HEADLINE} Transformation`,
      desc: "Experience warm untempered liquor directly from granite stone melangeurs.",
      duration: "45 Minutes",
    },
    {
      id: "salt-smoke",
      name: "Heirloom & Salt Exploration",
      desc: "Arriba Nacional paired with mineral crusts from Brittany and Maldon.",
      duration: "45 Minutes",
    },
  ];

  const handleBook = () => {
    // Real booking handoff (Phase 4): open the visitor's email client with a
    // pre-filled reservation request for the selected flight, instead of
    // simulating a confirmation.
    const flight = flights.find((f) => f.id === selectedFlight);
    window.location.href = mailtoLink(
      `Tasting Reservation — ${flight?.name ?? "Private Tasting"}`,
      "Hello NOIRÉ concierge,\n\nI would like to reserve the tasting flight above.\n\nPreferred dates:\nParty size:\nContact number:\n\nThank you."
    );
    setConfirmed(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl border border-[#342015] bg-[#0E0906] text-[#F3E8D3] p-8 max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <div className="flex items-center space-x-2 text-[#9B6742] text-[10px] uppercase tracking-widest font-sans">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Atelier Salon</span>
          </div>
          <DialogTitle className="font-display text-3xl font-normal tracking-wide text-[#F3E8D3]">
            THE CHOCOLATE ROOM
          </DialogTitle>
          <DialogDescription className="text-xs uppercase tracking-widest text-[#F3E8D3]/60">
            A quiet sanctuary for sensory immersion, blind tasting, and slow conche exploration.
          </DialogDescription>
        </DialogHeader>

        {confirmed ? (
          <div className="py-12 text-center space-y-4 animate-in fade-in-50">
            <CheckCircle2 className="w-10 h-10 text-[#9B6742] mx-auto" />
            <h3 className="font-display text-2xl text-[#F3E8D3]">
              Request Prepared
            </h3>
            <p className="text-xs text-[#F3E8D3]/70 max-w-sm mx-auto leading-relaxed">
              Your email client has opened with a pre-filled reservation request. Press send and the concierge will confirm your table by reply — reservations are confirmed personally, never automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <span className="block text-[10px] uppercase tracking-widest text-[#F3E8D3]/50">
                Select Tasting Flight
              </span>
              <div className="space-y-2.5">
                {flights.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFlight(f.id)}
                    className={`w-full text-left p-4 rounded-[2px] border transition-all duration-300 ${
                      selectedFlight === f.id
                        ? "border-[#9B6742] bg-[#1A100B]"
                        : "border-[#342015] bg-[#120B07] hover:border-[#342015]/90 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-display text-base tracking-wide text-[#F3E8D3]">
                        {f.name}
                      </h4>
                      <span className="text-[10px] text-[#9B6742] font-mono">
                        {f.duration}
                      </span>
                    </div>
                    <p className="text-xs text-[#F3E8D3]/60 mt-1 leading-relaxed">
                      {f.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-[#F3E8D3]/70 pt-2 border-t border-[#342015]/60">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#9B6742]" />
                <span className="text-[11px]">NOIRÉ Atelier, Fort Mumbai</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-[#9B6742]" />
                <span className="text-[11px]">By appointment only</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-[#342015]">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-[#342015] text-xs uppercase tracking-widest whitespace-normal"
              >
                Close
              </Button>
              <Button
                onClick={handleBook}
                data-noire-event="request_tasting_click"
                data-noire-label="chocolate room reservation"
                className="bg-[#9B6742] hover:bg-[#835534] text-[#F3E8D3] text-xs uppercase tracking-widest-editorial px-8 whitespace-normal"
              >
                Reserve Tasting
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
