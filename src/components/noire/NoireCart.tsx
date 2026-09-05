"use client";

import { useState } from "react";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "@/hooks/useCart";

interface NoireCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  subtotal: number;
}

export function NoireCart({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  subtotal,
}: NoireCartProps) {
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const shippingFreeThreshold = 1500;
  const isFreeShipping = subtotal >= shippingFreeThreshold;
  const shippingCost = items.length === 0 ? 0 : isFreeShipping ? 0 : 150;
  const total = subtotal + shippingCost;

  const handleCheckout = () => {
    setCheckoutModalOpen(true);
  };

  const handleConfirmOrder = () => {
    onClearCart();
    setCheckoutModalOpen(false);
    onClose();
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="flex flex-col justify-between w-full sm:max-w-md bg-[#0D0805] border-l border-[#342015] text-[#F3E8D3]">
          <div>
            <SheetHeader className="pb-6 border-b border-[#342015]">
              <SheetTitle className="font-display text-2xl font-normal tracking-[0.15em] text-[#F3E8D3]">
                YOUR BAG
              </SheetTitle>
              <SheetDescription className="text-xs uppercase tracking-widest text-[#F3E8D3]/50">
                {items.length === 0
                  ? "Zero items"
                  : `${items.reduce((a, b) => a + b.quantity, 0)} ${
                      items.reduce((a, b) => a + b.quantity, 0) === 1 ? "Creation" : "Creations"
                    }`}
              </SheetDescription>
            </SheetHeader>

            {/* Cart Items List */}
            <div className="py-6 space-y-6 max-h-[55vh] overflow-y-auto pr-1">
              {items.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                  <p className="font-editorial text-lg text-[#F3E8D3]/60 italic">
                    Your bag is quiet.
                  </p>
                  <p className="text-xs uppercase tracking-widest text-[#F3E8D3]/40">
                    Discover our reserve single-origin editions below.
                  </p>
                </div>
              ) : (
                items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between pb-6 border-b border-[#342015]/60 last:border-b-0"
                  >
                    <div className="space-y-1">
                      <h4 className="font-display text-lg tracking-wide text-[#F3E8D3]">
                        {product.name}
                      </h4>
                      <p className="text-[11px] uppercase tracking-wider text-[#9B6742]">
                        {product.cacaoPercentage}% Cacao &bull; {product.weight}
                      </p>
                      <p className="text-xs font-mono text-[#F3E8D3]/70">
                        {formatPrice(product.price)} each
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Quantity selector */}
                      <div className="flex items-center border border-[#342015] bg-[#1A100B] rounded-[2px]">
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                          className="p-1.5 text-[#F3E8D3]/70 hover:text-[#F3E8D3] focus:outline-none"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono min-w-[20px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="p-1.5 text-[#F3E8D3]/70 hover:text-[#F3E8D3] focus:outline-none"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove item */}
                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="p-1.5 text-[#F3E8D3]/40 hover:text-[#9B6742] transition-colors focus:outline-none"
                        aria-label={`Remove ${product.name} from bag`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="pt-6 border-t border-[#342015] space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#F3E8D3]/70">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#F3E8D3]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#F3E8D3]/70">
                  <span>Chilled Insulated Courier</span>
                  <span className="font-mono text-[#F3E8D3]">
                    {isFreeShipping ? "COMPLIMENTARY" : formatPrice(shippingCost)}
                  </span>
                </div>
                {!isFreeShipping && (
                  <p className="text-[10px] text-[#9B6742] italic">
                    Add {formatPrice(shippingFreeThreshold - subtotal)} more for complimentary climate-controlled delivery.
                  </p>
                )}
                <div className="flex justify-between pt-2 border-t border-[#342015]/60 text-sm font-medium">
                  <span className="font-display tracking-widest text-lg">Total</span>
                  <span className="font-mono text-base text-[#9B6742]">{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-[#9B6742] hover:bg-[#835534] text-[#F3E8D3] flex items-center justify-center space-x-2 py-6 text-xs uppercase tracking-widest-editorial"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-[#F3E8D3]/40 uppercase tracking-widest pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#9B6742]" />
                <span>Small batch freshly tempered &bull; Temperature guaranteed</span>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Checkout Simulation Dialog */}
      <Dialog open={checkoutModalOpen} onOpenChange={setCheckoutModalOpen}>
        <DialogContent className="border border-[#342015] bg-[#120B07] text-[#F3E8D3]">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl tracking-wider">
              RESERVE DISPATCH
            </DialogTitle>
            <DialogDescription className="text-xs uppercase tracking-widest text-[#F3E8D3]/60">
              Your artisanal chocolate order is queued for hand-tempered packaging.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 text-xs">
            <div className="p-4 bg-[#1A100B] border border-[#342015] rounded-[2px] space-y-2">
              <p className="text-[11px] text-[#9B6742] uppercase tracking-widest font-semibold">
                Order Summary ({items.reduce((a, b) => a + b.quantity, 0)} Bars)
              </p>
              {items.map((i) => (
                <div key={i.product.id} className="flex justify-between text-[#F3E8D3]/80 text-[11px]">
                  <span>
                    {i.quantity}&times; {i.product.name}
                  </span>
                  <span className="font-mono">{formatPrice(i.product.price * i.quantity)}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-[#342015] flex justify-between font-medium text-[#F3E8D3]">
                <span>Total Amount</span>
                <span className="font-mono text-[#9B6742]">{formatPrice(total)}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#F3E8D3]/60 leading-relaxed">
              In accordance with Section 42 of the NOIRÉ Master Bible, this completes the front-end commerce state verification. Each bar is packed in insulated compostable thermal foil with frozen gel packs.
            </p>
          </div>

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setCheckoutModalOpen(false)}
              className="border-[#342015] text-xs whitespace-normal"
            >
              Back to Bag
            </Button>
            <Button
              onClick={handleConfirmOrder}
              className="bg-[#9B6742] text-[#F3E8D3] hover:bg-[#835534] text-xs uppercase tracking-widest whitespace-normal"
            >
              Complete Reservation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
