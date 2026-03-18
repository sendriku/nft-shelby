"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Shield, Zap, Globe, Layers } from "lucide-react";
import { truncateAddress } from "@/types";

const STATS = [
  { icon: Shield, label: "Erasure Coded", value: "Redundant" },
  { icon: Zap, label: "Latency", value: "< 100ms" },
  { icon: Globe, label: "Network", value: "Testnet" },
  { icon: Layers, label: "Storage Nodes", value: "16 SPs" },
];

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {STATS.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="glass-card rounded-xl p-4 flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-frost/10 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-frost" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-ash-300 font-mono truncate">{label}</p>
            <p className="text-sm font-semibold text-ash-100">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
