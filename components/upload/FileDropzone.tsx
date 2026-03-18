"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  ImageIcon,
  Video,
  Music,
  X,
  FileIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ALL_SUPPORTED_TYPES,
  MAX_FILE_SIZE,
  getMediaCategory,
  formatFileSize,
} from "@/types";

interface FileDropzoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function FileDropzone({ onFileSelected, disabled }: FileDropzoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;
      setSelectedFile(file);

      // Generate preview for images
      const category = getMediaCategory(file.type);
      if (category === "image") {
        const url = URL.createObjectURL(file);
        setPreview(url);
      } else {
        setPreview(null);
      }

      onFileSelected(file);
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: ALL_SUPPORTED_TYPES.reduce(
        (acc, type) => ({ ...acc, [type]: [] }),
        {}
      ),
      maxSize: MAX_FILE_SIZE,
      maxFiles: 1,
      disabled,
    });

  function clearFile(e: React.MouseEvent) {
    e.stopPropagation();
    if (preview) URL.revokeObjectURL(preview);
    setSelectedFile(null);
    setPreview(null);
  }

  function getFileIcon(type: string) {
    const cat = getMediaCategory(type);
    if (cat === "image") return <ImageIcon className="w-8 h-8" />;
    if (cat === "video") return <Video className="w-8 h-8" />;
    if (cat === "audio") return <Music className="w-8 h-8" />;
    return <FileIcon className="w-8 h-8" />;
  }

  // File selected state
  if (selectedFile) {
    const category = getMediaCategory(selectedFile.type);
    return (
      <div className="relative rounded-xl overflow-hidden border border-[rgba(77,240,255,0.2)] bg-carbon">
        {/* Preview */}
        {preview ? (
          <div className="relative h-56">
            <img
              src={preview}
              alt={selectedFile.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-transparent" />
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center bg-gradient-to-br from-slate to-carbon">
            <div className="text-frost opacity-60">{getFileIcon(selectedFile.type)}</div>
          </div>
        )}

        {/* File info */}
        <div className="p-4 flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-ash-100 font-medium truncate">
              {selectedFile.name}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={cn(
                  "text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-mono",
                  category === "image" && "bg-frost/10 text-frost",
                  category === "video" && "bg-gold/10 text-gold",
                  category === "audio" && "bg-purple-400/10 text-purple-300"
                )}
              >
                {category}
              </span>
              <span className="text-xs text-ash-200 font-mono">
                {formatFileSize(selectedFile.size)}
              </span>
            </div>
          </div>

          {!disabled && (
            <button
              onClick={clearFile}
              className="ml-3 p-1.5 rounded-lg hover:bg-[rgba(255,100,100,0.1)] text-ash-200 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Empty dropzone
  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200",
        "upload-zone",
        isDragActive && !isDragReject
          ? "border-frost bg-frost/5 shadow-glow-frost scale-[1.01]"
          : isDragReject
          ? "border-red-500 bg-red-500/5"
          : "border-ash-400 hover:border-[rgba(77,240,255,0.3)] hover:bg-frost/[0.02]",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center py-14 px-6 text-center gap-4">
        <div
          className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
            isDragActive
              ? "bg-frost/20 shadow-glow-frost"
              : "bg-slate"
          )}
        >
          <Upload
            className={cn(
              "w-7 h-7 transition-colors",
              isDragActive ? "text-frost" : "text-ash-200"
            )}
          />
        </div>

        <div>
          <p className="text-ash-100 font-semibold text-base">
            {isDragActive
              ? "Drop your file here"
              : "Drop your NFT media here"}
          </p>
          <p className="text-ash-200 text-sm mt-1">
            or{" "}
            <span className="text-frost underline-offset-2 hover:underline cursor-pointer">
              browse files
            </span>
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {["JPG / PNG / GIF / WebP", "MP4 / WebM", "MP3 / WAV / FLAC"].map((t) => (
            <span
              key={t}
              className="text-[10px] font-mono px-2 py-1 bg-carbon border border-ash-400 text-ash-200 rounded"
            >
              {t}
            </span>
          ))}
        </div>

        <p className="text-[11px] text-ash-300">Max size: 100MB · 1 ShelbyUSD per upload</p>
      </div>

      {isDragActive && (
        <div className="absolute inset-0 rounded-xl pointer-events-none">
          <div className="absolute inset-0 rounded-xl border-2 border-frost animate-pulse-slow" />
        </div>
      )}
    </div>
  );
}
