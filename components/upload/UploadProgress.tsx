"use client";

import { Check, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UploadProgress } from "@/types";
import { UPLOAD_STEPS } from "@/types";

interface UploadProgressProps {
  progress: UploadProgress;
}

export function UploadProgressDisplay({ progress }: UploadProgressProps) {
  const isError = progress.step === "error";
  const isSuccess = progress.step === "success";

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Overall progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono text-ash-200 uppercase tracking-widest">
            {isError ? "Upload Failed" : isSuccess ? "Complete" : "Uploading..."}
          </span>
          <span
            className={cn(
              "text-xs font-mono font-semibold",
              isError ? "text-red-400" : "text-frost"
            )}
          >
            {progress.percentage}%
          </span>
        </div>

        <div className="relative h-1.5 bg-carbon rounded-full overflow-hidden">
          <div
            className={cn(
              "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
              isError
                ? "bg-red-500"
                : isSuccess
                ? "bg-frost shadow-glow-frost"
                : "bg-gradient-to-r from-frost/60 to-frost"
            )}
            style={{ width: `${progress.percentage}%` }}
          />
          {!isError && !isSuccess && (
            <div
              className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent progress-shimmer"
              style={{ left: `${progress.percentage - 10}%` }}
            />
          )}
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-start gap-0">
        {UPLOAD_STEPS.map((step, i) => {
          const isActive = progress.stepIndex === i && !isSuccess && !isError;
          const isDone =
            progress.stepIndex > i || isSuccess;
          const isUpcoming = progress.stepIndex < i;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-2 flex-1">
                {/* Circle */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                    isDone && "bg-frost/20 border border-frost",
                    isActive && "bg-frost/10 border-2 border-frost animate-glow-pulse",
                    isUpcoming && "bg-carbon border border-ash-300"
                  )}
                >
                  {isDone ? (
                    <Check className="w-4 h-4 text-frost" />
                  ) : isActive ? (
                    <Loader2 className="w-4 h-4 text-frost animate-spin" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-ash-300" />
                  )}
                </div>

                {/* Label */}
                <div className="text-center">
                  <p
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wider",
                      isDone && "text-frost",
                      isActive && "text-ash-100",
                      isUpcoming && "text-ash-300"
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] text-ash-300 mt-0.5 max-w-[100px] text-center leading-tight">
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Connector line */}
              {i < UPLOAD_STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-px flex-1 mb-8 mx-1 transition-all duration-500",
                    isDone ? "bg-frost/40" : "bg-ash-400"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Status message */}
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-mono",
          isError
            ? "bg-red-500/10 border border-red-500/20 text-red-300"
            : "bg-frost/5 border border-frost/10 text-ash-200"
        )}
      >
        {isError ? (
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-frost animate-pulse-slow shrink-0" />
        )}
        <span>{progress.error ?? progress.message}</span>
      </div>
    </div>
  );
}
