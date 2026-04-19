import { X, ZoomIn } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// ─── Lightbox overlay ─────────────────────────────────────────────────────────

interface RouteMapLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export function RouteMapLightbox({ src, alt, onClose }: RouteMapLightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "oklch(var(--foreground) / 0.65)" }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-ocid="route-map-lightbox-overlay"
    >
      <div
        className="wood-texture relative w-full max-w-2xl rounded-2xl bg-card border border-border overflow-hidden shadow-xl"
        style={{ maxHeight: "92dvh" }}
      >
        {/* Top accent */}
        <div className="h-1 w-full bg-primary opacity-70" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-card/90 border border-border text-foreground hover:text-primary transition-colors duration-200"
          aria-label="Schließen"
          data-ocid="route-map-lightbox-close"
        >
          <X size={16} />
        </button>

        {/* Image */}
        <div
          className="w-full overflow-hidden flex items-center justify-center bg-muted/20"
          style={{ maxHeight: "85dvh" }}
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-auto object-contain"
            style={{ maxHeight: "85dvh" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Clickable route map wrapper ──────────────────────────────────────────────

interface RouteMapProps {
  src: string;
  alt: string;
  /** Optional fallback content when the image fails to load */
  fallback?: React.ReactNode;
}

export function RouteMap({ src, alt, fallback }: RouteMapProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (imgError && fallback) {
    return <>{fallback}</>;
  }

  return (
    <>
      <button
        type="button"
        className="relative w-full group cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
        onClick={() => !imgError && setLightboxOpen(true)}
        aria-label={`${alt} vergrößern`}
        data-ocid="route-map-zoom-trigger"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-contain rounded-xl"
          onError={() => setImgError(true)}
        />
        {/* Hover hint overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{ background: "oklch(var(--foreground) / 0.18)" }}
        >
          <div className="flex items-center gap-2 bg-card/90 border border-border text-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
            <ZoomIn size={14} className="text-primary" />
            Vergrößern
          </div>
        </div>
      </button>

      {lightboxOpen && (
        <RouteMapLightbox
          src={src}
          alt={alt}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
