import { Code2, Cpu, CloudUpload } from "lucide-react";

const STEPS = [
  {
    icon: Cpu,
    number: "01",
    title: "Erasure Coding",
    description:
      "Your file is split into chunks and encoded with cryptographic commitment hashes using Shelby's erasure coding provider.",
    color: "frost",
  },
  {
    icon: Code2,
    number: "02",
    title: "On-Chain Registration",
    description:
      "A transaction is submitted to the Aptos smart contract, registering your blob's merkle root and metadata on-chain.",
    color: "gold",
  },
  {
    icon: CloudUpload,
    number: "03",
    title: "RPC Upload",
    description:
      "The encoded data is sent to Shelby RPC servers and distributed across 16 storage providers via dedicated fiber.",
    color: "frost",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16">
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl sm:text-4xl tracking-wider text-ash-100">
          HOW IT WORKS
        </h2>
        <p className="text-ash-200 text-sm mt-2">
          Three steps. Fully decentralized. Cryptographically verified.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STEPS.map((step, i) => (
          <div key={step.number} className="relative group">
            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div className="hidden sm:block absolute top-8 left-[60%] right-0 h-px bg-gradient-to-r from-ash-400 to-transparent z-10" />
            )}

            <div className="glass-card rounded-2xl p-6 h-full hover:border-[rgba(77,240,255,0.25)] transition-all duration-200 group-hover:-translate-y-1">
              {/* Number + Icon */}
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    step.color === "gold"
                      ? "bg-gold/10 border border-gold/20"
                      : "bg-frost/10 border border-frost/20"
                  }`}
                >
                  <step.icon
                    className={`w-5 h-5 ${
                      step.color === "gold" ? "text-gold" : "text-frost"
                    }`}
                  />
                </div>
                <span
                  className={`font-display text-4xl leading-none ${
                    step.color === "gold" ? "text-gold/20" : "text-frost/20"
                  }`}
                >
                  {step.number}
                </span>
              </div>

              <h3 className="font-semibold text-ash-100 mb-2">{step.title}</h3>
              <p className="text-sm text-ash-200 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
