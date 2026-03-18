@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=JetBrains+Mono:wght@400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-void: #030508;
  --color-obsidian: #0a0d14;
  --color-carbon: #111520;
  --color-frost: #4df0ff;
  --color-gold: #e8b84b;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html, body {
  max-width: 100vw;
  overflow-x: hidden;
  background-color: var(--color-void);
  color: #c8cdd8;
  font-family: 'DM Sans', sans-serif;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: var(--color-obsidian);
}
::-webkit-scrollbar-thumb {
  background: rgba(77, 240, 255, 0.2);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(77, 240, 255, 0.4);
}

/* Selection */
::selection {
  background: rgba(77, 240, 255, 0.2);
  color: #4df0ff;
}

/* Grid background */
.bg-grid {
  background-image: 
    linear-gradient(rgba(77,240,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(77,240,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Noise texture overlay */
.noise-overlay::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 9999;
  opacity: 0.4;
}

/* Frost glow line */
.frost-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(77,240,255,0.4), transparent);
}

/* Card */
.glass-card {
  background: linear-gradient(135deg, rgba(26,31,46,0.8) 0%, rgba(10,13,20,0.9) 100%);
  border: 1px solid rgba(77,240,255,0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Progress bar animation */
@keyframes progressShimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}

.progress-shimmer {
  animation: progressShimmer 1.5s ease-in-out infinite;
}

/* Upload zone */
.upload-zone {
  background: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 19px,
      rgba(77,240,255,0.04) 19px,
      rgba(77,240,255,0.04) 20px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 19px,
      rgba(77,240,255,0.04) 19px,
      rgba(77,240,255,0.04) 20px
    );
}

/* Aptos wallet button overrides */
.wallet-button {
  all: unset;
  cursor: pointer;
}
