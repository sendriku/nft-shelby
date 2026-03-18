import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "SHELBY NFT — Decentralized Media Storage",
  description:
    "Store your NFT media assets on the Shelby decentralized storage network, built on Aptos.",
  keywords: ["NFT", "Shelby", "Aptos", "decentralized storage", "blockchain"],
  openGraph: {
    title: "SHELBY NFT",
    description: "Decentralized NFT Media Storage on Aptos",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="noise-overlay">
        <Providers>
          {children}
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#111520",
                border: "1px solid rgba(77,240,255,0.15)",
                color: "#c8cdd8",
                fontFamily: "'DM Sans', sans-serif",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
