import { useActor } from "@caffeineai/core-infrastructure";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import {
  Clock,
  ExternalLink,
  Globe,
  Home,
  Mail,
  Mountain,
  Phone,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createActor } from "../backend";
import type { StagePhoto } from "../backend";
import { AuthButton } from "../components/AuthButton";
import { ElevationChart } from "../components/ElevationChart";
import { RouteMap } from "../components/RouteMapLightbox";
import {
  StagePhotoSection,
  hashToDirectUrl,
} from "../components/StagePhotoSection";

// ─── Hardcoded Etappe 7 data ───────────────────────────────────────────────

const ETAPPE7_DATA = {
  distanceKm: 16.6,
  ascentM: 388,
  descentM: 1230,
  profile: [
    { d: 0.0, e: 2737 },
    { d: 0.07, e: 2737 },
    { d: 0.15, e: 2742 },
    { d: 0.23, e: 2752 },
    { d: 0.33, e: 2765 },
    { d: 0.52, e: 2800 },
    { d: 0.7, e: 2820 },
    { d: 0.83, e: 2820 },
    { d: 0.97, e: 2825 },
    { d: 1.09, e: 2834 },
    { d: 1.16, e: 2847 },
    { d: 1.31, e: 2882 },
    { d: 1.47, e: 2908 },
    { d: 1.61, e: 2927 },
    { d: 1.71, e: 2938 },
    { d: 1.77, e: 2939 },
    { d: 1.85, e: 2941 },
    { d: 1.94, e: 2930 },
    { d: 2.14, e: 2877 },
    { d: 2.35, e: 2820 },
    { d: 2.63, e: 2764 },
    { d: 2.8, e: 2732 },
    { d: 2.92, e: 2711 },
    { d: 3.23, e: 2674 },
    { d: 3.38, e: 2662 },
    { d: 3.57, e: 2653 },
    { d: 3.85, e: 2648 },
    { d: 4.14, e: 2658 },
    { d: 6.02, e: 2799 },
    { d: 6.18, e: 2792 },
    { d: 6.34, e: 2782 },
    { d: 6.55, e: 2780 },
    { d: 6.7, e: 2787 },
    { d: 6.85, e: 2783 },
    { d: 7.09, e: 2776 },
    { d: 7.22, e: 2766 },
    { d: 7.37, e: 2749 },
    { d: 7.55, e: 2724 },
    { d: 7.74, e: 2712 },
    { d: 7.93, e: 2710 },
    { d: 8.18, e: 2700 },
    { d: 8.35, e: 2689 },
    { d: 8.65, e: 2671 },
    { d: 8.94, e: 2655 },
    { d: 9.39, e: 2669 },
    { d: 9.68, e: 2663 },
    { d: 10.04, e: 2646 },
    { d: 10.23, e: 2636 },
    { d: 10.41, e: 2627 },
    { d: 10.53, e: 2619 },
    { d: 10.8, e: 2571 },
    { d: 10.99, e: 2541 },
    { d: 11.17, e: 2523 },
    { d: 11.53, e: 2521 },
    { d: 11.9, e: 2516 },
    { d: 12.0, e: 2510 },
    { d: 12.28, e: 2494 },
    { d: 12.59, e: 2455 },
    { d: 12.79, e: 2425 },
    { d: 12.95, e: 2397 },
    { d: 13.1, e: 2364 },
    { d: 13.27, e: 2343 },
    { d: 13.5, e: 2319 },
    { d: 13.76, e: 2282 },
    { d: 13.89, e: 2266 },
    { d: 14.05, e: 2248 },
    { d: 14.24, e: 2221 },
    { d: 14.39, e: 2194 },
    { d: 14.57, e: 2158 },
    { d: 14.71, e: 2133 },
    { d: 14.8, e: 2114 },
    { d: 14.91, e: 2095 },
    { d: 15.06, e: 2061 },
    { d: 15.18, e: 2040 },
    { d: 15.41, e: 2011 },
    { d: 15.59, e: 1995 },
    { d: 15.82, e: 1967 },
    { d: 16.09, e: 1929 },
    { d: 16.42, e: 1898 },
    { d: 16.52, e: 1894 },
  ],
} as const;

// ─── Info card ────────────────────────────────────────────────────────────

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <div className="wood-texture relative rounded-xl bg-card border border-border overflow-hidden">
      <div className="h-1 w-full bg-primary opacity-70" />
      <div className="p-4 flex flex-col gap-2 items-center text-center">
        <div className="text-primary opacity-80">{icon}</div>
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">
          {label}
        </p>
        <p className="text-2xl font-bold font-display text-foreground leading-none">
          {value}
        </p>
      </div>
      <div
        className="absolute bottom-0 right-0 w-6 h-6 opacity-20"
        style={{
          background:
            "linear-gradient(135deg, transparent 50%, oklch(var(--primary)) 50%)",
        }}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export function Stage7DetailPage() {
  const router = useRouter();
  const { identity } = useInternetIdentity();
  const { actor, isFetching: isActorFetching } = useActor(createActor);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string | null>>({});

  const { data: isAdmin = false } = useQuery({
    queryKey: ["isAdmin", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !!identity && !isActorFetching,
  });

  const { data: photos = [] } = useQuery<StagePhoto[]>({
    queryKey: ["stagePhotos", "7"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStagePhotos(7n);
    },
    enabled: !!actor && !isActorFetching,
  });

  useEffect(() => {
    if (!photos.length) return;
    for (const photo of photos) {
      if (photoUrls[photo.id] !== undefined) continue;
      setPhotoUrls((prev) => ({ ...prev, [photo.id]: null }));
      hashToDirectUrl(photo.blobHash)
        .then((url) => setPhotoUrls((prev) => ({ ...prev, [photo.id]: url })))
        .catch(() => setPhotoUrls((prev) => ({ ...prev, [photo.id]: null })));
    }
  }, [photos, photoUrls]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="bg-card border-b border-border px-4 sm:px-6 py-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.navigate({ to: "/" })}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200 group"
          data-ocid="back-btn"
          aria-label="Zurück zur Startseite"
        >
          <span className="text-primary group-hover:-translate-x-0.5 transition-transform duration-200">
            ←
          </span>
          Zurück
        </button>
        <span className="text-border">|</span>
        <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-semibold">
          Wandertagebuch · Familie Schreiber
        </span>
        <div className="ml-auto">
          <AuthButton />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          {/* Title block */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4 mb-1">
              <div className="h-px w-8 bg-primary opacity-60" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                10. August 2026
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-foreground leading-tight tracking-tight">
              Etappe 7
              <br />
              <span className="text-primary">Braunschweiger Hütte</span>
              <span className="mx-2 text-muted-foreground">→</span>
              <span>Vent</span>
            </h1>
          </div>

          {/* Info cards */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
            data-ocid="info-cards"
          >
            <InfoCard
              icon={<Mountain size={22} />}
              label="Distanz"
              value={`${ETAPPE7_DATA.distanceKm.toLocaleString("de-DE", { minimumFractionDigits: 1 })} km`}
            />
            <InfoCard
              icon={<TrendingUp size={22} />}
              label="Aufstieg"
              value={`+${ETAPPE7_DATA.ascentM.toLocaleString("de-DE")} m`}
            />
            <InfoCard
              icon={<TrendingDown size={22} />}
              label="Abstieg"
              value={`−${ETAPPE7_DATA.descentM.toLocaleString("de-DE")} m`}
            />
            <InfoCard
              icon={<Clock size={22} />}
              label="Gehzeit"
              value="~9h 05min"
            />
          </div>

          {/* Accommodation */}
          <div className="wood-texture relative rounded-xl bg-card border border-border overflow-hidden">
            <div className="h-1 w-full bg-primary opacity-70" />
            <div className="p-5 flex items-center gap-4">
              <Home size={20} className="text-primary opacity-80 shrink-0" />
              <div>
                <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-0.5">
                  Unterkunft
                </p>
                <p className="text-lg font-bold font-display text-foreground leading-snug">
                  Hotel Vent
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Marzellweg 1, 6458 Vent
                </p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                  <Phone
                    size={13}
                    className="text-primary opacity-70 shrink-0"
                  />
                  <span>+43 5254 8130</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                  <Mail
                    size={13}
                    className="text-primary opacity-70 shrink-0"
                  />
                  <a
                    href="mailto:info@hotel-vent.at"
                    className="hover:text-foreground transition-colors duration-200"
                  >
                    info@hotel-vent.at
                  </a>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                  <Globe
                    size={14}
                    className="text-primary opacity-70 shrink-0"
                  />
                  <a
                    href="https://www.hotel-vent.at"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors duration-200 inline-flex items-center gap-1"
                  >
                    hotel-vent.at{" "}
                    <ExternalLink size={11} className="opacity-60" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Stage info text */}
          <div className="wood-texture relative rounded-xl bg-card border border-border overflow-hidden">
            <div className="h-1 w-full bg-primary" />
            <div className="p-5">
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4">
                Etappe 7 · Braunschweiger Hütte → Vent
              </p>
              <dl className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-xs font-bold tracking-[0.12em] uppercase text-primary shrink-0 w-28 mb-0.5 sm:mb-0 pt-0.5">
                    Highlight
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">
                    Pitztaler Jöchl (2.942 m) mit Panoramablick auf Wildspitze
                    und Ötztaler Alpen
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-xs font-bold tracking-[0.12em] uppercase text-primary shrink-0 w-28 mb-0.5 sm:mb-0 pt-0.5">
                    Charakter
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">
                    Kurzer Aufstieg zum Jöchl, dann langer Abstieg −1.230 m nach
                    Vent über den Panoramaweg
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Elevation profile + map */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                Strecke &amp; Profil
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Elevation profile */}
              <div className="w-full md:w-1/2 flex flex-col gap-2">
                <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground px-1">
                  Höhenprofil
                </p>
                <div
                  className="wood-texture relative rounded-xl bg-card border border-border overflow-hidden"
                  data-ocid="elevation-chart"
                >
                  <div className="h-1 w-full bg-primary opacity-70" />
                  <div className="px-4 pt-5 pb-2">
                    <ElevationChart
                      data={
                        ETAPPE7_DATA.profile as unknown as {
                          d: number;
                          e: number;
                        }[]
                      }
                      distanceMax={ETAPPE7_DATA.distanceKm}
                      elevationDomain={[1800, 3000]}
                      gradientId="elevGradient7"
                      photos={photos}
                      photoUrls={photoUrls}
                      isAdmin={isAdmin}
                      pendingMarker={selectedDistance}
                      onPositionSelect={
                        isAdmin ? setSelectedDistance : undefined
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Route map */}
              <div className="w-full md:w-1/2 flex flex-col gap-2">
                <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground px-1">
                  Routenkarte
                </p>
                <div
                  className="w-full rounded-xl overflow-hidden border-2 border-border"
                  data-ocid="route-map"
                >
                  <RouteMap
                    src="/assets/images/Etappe7.png"
                    alt="Routenkarte Etappe 7: Braunschweiger Hütte → Vent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Photos & journal */}
          <StagePhotoSection
            stageId={7n}
            selectedDistance={selectedDistance}
            onClearDistance={() => setSelectedDistance(null)}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6 px-4 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors duration-200"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
