"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { WalletButton } from "@/components/wallet/WalletButton";
import { Database, Upload, LayoutGrid, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Upload", icon: Upload },
  { href: "/gallery", label: "Gallery", icon: LayoutGrid },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-obsidian/90 backdrop-blur-xl border-b border-[rgba(77,240,255,0.08)] shadow-[0_4px_40px_rgba(0,0,0,0.4)]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-frost/30 blur-lg rounded-lg group-hover:bg-frost/50 transition-all" />
                <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-frost/20 to-frost/5 border border-frost/30 flex items-center justify-center">
                  <Database className="w-4 h-4 text-frost" />
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl tracking-[0.2em] text-ash-100">
                  SHELBY
                </span>
                <span className="text-[9px] font-mono text-ash-300 tracking-[0.15em] uppercase">
                  NFT Storage
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                    pathname === href
                      ? "bg-frost/10 text-frost border border-frost/20"
                      : "text-ash-200 hover:text-ash-100 hover:bg-white/5"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <WalletButton />
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="sm:hidden p-2 rounded-lg text-ash-200 hover:text-ash-100 hover:bg-white/5 transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-[rgba(77,240,255,0.08)] bg-obsidian/95 backdrop-blur-xl">
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    pathname === href
                      ? "bg-frost/10 text-frost"
                      : "text-ash-200 hover:text-ash-100 hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
