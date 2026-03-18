"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState, useRef, useEffect } from "react";
import {
  Wallet,
  ChevronDown,
  LogOut,
  Copy,
  ExternalLink,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { truncateAddress, getExplorerAccountUrl } from "@/lib/aptos";
import { toast } from "sonner";

export function WalletButton() {
  const { connect, disconnect, connected, account, wallets, wallet } =
    useWallet();
  const [showMenu, setShowMenu] = useState(false);
  const [showWalletList, setShowWalletList] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
        setShowWalletList(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ts-sdk v2: account.address is AccountAddress, must call .toString()
  const addressStr = account?.address ? account.address.toString() : "";

  async function handleCopy() {
    if (!addressStr) return;
    await navigator.clipboard.writeText(addressStr);
    setCopied(true);
    toast.success("Address copied");
    setTimeout(() => setCopied(false), 2000);
  }

  if (connected && account) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
            "bg-slate border border-[rgba(77,240,255,0.15)] hover:border-[rgba(77,240,255,0.4)]",
            "text-ash-100 text-sm font-mono"
          )}
        >
          <span className="w-2 h-2 rounded-full bg-frost animate-pulse-slow" />
          {truncateAddress(addressStr)}
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-ash-200 transition-transform",
              showMenu && "rotate-180"
            )}
          />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-2 w-56 glass-card rounded-xl overflow-hidden z-50 shadow-card animate-slide-up">
            <div className="px-4 py-3 border-b border-[rgba(77,240,255,0.08)]">
              <p className="text-xs text-ash-200 mb-1">Connected via</p>
              <p className="text-ash-100 text-sm font-medium">
                {wallet?.name ?? "Wallet"}
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ash-100 hover:bg-[rgba(77,240,255,0.05)] transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-frost" />
              ) : (
                <Copy className="w-4 h-4 text-ash-200" />
              )}
              Copy Address
            </button>

            <a
              href={getExplorerAccountUrl(addressStr)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ash-100 hover:bg-[rgba(77,240,255,0.05)] transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-ash-200" />
              View on Explorer
            </a>

            <div className="border-t border-[rgba(77,240,255,0.08)]">
              <button
                onClick={() => {
                  disconnect();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-[rgba(239,68,68,0.05)] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Not connected
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowWalletList(!showWalletList)}
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-200",
          "bg-frost text-void font-semibold text-sm",
          "hover:shadow-glow-frost hover:scale-[1.02] active:scale-[0.98]"
        )}
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </button>

      {showWalletList && (
        <div className="absolute right-0 top-full mt-2 w-64 glass-card rounded-xl overflow-hidden z-50 shadow-card animate-slide-up">
          <div className="px-4 py-3 border-b border-[rgba(77,240,255,0.08)]">
            <p className="text-sm font-semibold text-ash-100">Select Wallet</p>
            <p className="text-xs text-ash-200 mt-0.5">Aptos Testnet</p>
          </div>

          <div className="py-2">
            {wallets && wallets.length > 0 ? (
              wallets.map((w) => (
                <button
                  key={w.name}
                  onClick={() => {
                    connect(w.name);
                    setShowWalletList(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[rgba(77,240,255,0.05)] transition-colors"
                >
                  {w.icon && (
                    <img src={w.icon} alt={w.name} className="w-7 h-7 rounded-lg" />
                  )}
                  <div className="text-left">
                    <p className="text-sm text-ash-100 font-medium">{w.name}</p>
                    <p className="text-xs text-ash-200">
                      {w.readyState === "Installed" ? "Installed" : "Not installed"}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-4 text-center">
                <p className="text-sm text-ash-200">No wallets detected</p>
                <a
                  href="https://petra.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-frost mt-1 inline-block hover:underline"
                >
                  Install Petra Wallet →
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
