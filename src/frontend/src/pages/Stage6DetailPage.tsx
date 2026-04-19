import { useActor } from "@caffeineai/core-infrastructure";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import {
  Clock,
  ExternalLink,
  Globe,
  Home,
  Mountain,
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

// ─── Hardcoded Etappe 6 data ───────────────────────────────────────────────

const ETAPPE6_DATA = {
  distanceKm: 5.5,
  ascentM: 978,
  descentM: 0,
  profile: [
    { d: 0.0, e: 1738 },
    { d: 0.08, e: 1738 },
    { d: 0.14, e: 1742 },
    { d: 0.22, e: 1747 },
    { d: 0.29, e: 1752 },
    { d: 0.34, e: 1756 },
    { d: 0.41, e: 1761 },
    { d: 0.5, e: 1768 },
    { d: 0.55, e: 1772 },
    { d: 0.6, e: 1777 },
    { d: 0.66, e: 1782 },
    { d: 0.71, e: 1787 },
    { d: 0.76, e: 1792 },
    { d: 0.83, e: 1800 },
    { d: 0.9, e: 1806 },
    { d: 0.97, e: 1813 },
    { d: 1.0, e: 1816 },
    { d: 1.05, e: 1820 },
    { d: 1.12, e: 1827 },
    { d: 1.17, e: 1831 },
    { d: 1.25, e: 1838 },
    { d: 1.31, e: 1843 },
    { d: 1.37, e: 1850 },
    { d: 1.48, e: 1862 },
    { d: 1.54, e: 1867 },
    { d: 1.63, e: 1879 },
    { d: 1.7, e: 1886 },
    { d: 1.87, e: 1905 },
    { d: 1.93, e: 1911 },
    { d: 2.0, e: 1919 },
    { d: 2.15, e: 1935 },
    { d: 2.24, e: 1945 },
    { d: 2.29, e: 1951 },
    { d: 2.42, e: 1968 },
    { d: 2.48, e: 1976 },
    { d: 2.56, e: 1992 },
    { d: 2.62, e: 2003 },
    { d: 2.69, e: 2017 },
    { d: 2.75, e: 2033 },
    { d: 2.8, e: 2048 },
    { d: 2.86, e: 2066 },
    { d: 2.93, e: 2087 },
    { d: 3.05, e: 2122 },
    { d: 3.15, e: 2149 },
    { d: 3.26, e: 2175 },
    { d: 3.37, e: 2197 },
    { d: 3.52, e: 2225 },
    { d: 3.64, e: 2251 },
    { d: 3.75, e: 2273 },
    { d: 3.87, e: 2299 },
    { d: 3.98, e: 2322 },
    { d: 4.12, e: 2353 },
    { d: 4.22, e: 2384 },
    { d: 4.3, e: 2405 },
    { d: 4.39, e: 2438 },
    { d: 4.49, e: 2473 },
    { d: 4.59, e: 2501 },
    { d: 4.71, e: 2537 },
    { d: 4.85, e: 2592 },
    { d: 4.99, e: 2645 },
    { d: 5.1, e: 2686 },
    { d: 5.3, e: 2717 },
    { d: 5.5, e: 2717 },
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

export function Stage6DetailPage() {
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
    queryKey: ["stagePhotos", "6"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStagePhotos(6n);
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
                09. August 2026
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-foreground leading-tight tracking-tight">
              Etappe 6
              <br />
              <span className="text-primary">Wenns</span>
              <span className="mx-2 text-muted-foreground">→</span>
              <span>Braunschweiger Hütte</span>
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
              value={`${ETAPPE6_DATA.distanceKm.toLocaleString("de-DE", { minimumFractionDigits: 1 })} km`}
            />
            <InfoCard
              icon={<TrendingUp size={22} />}
              label="Aufstieg"
              value={`+${ETAPPE6_DATA.ascentM.toLocaleString("de-DE")} m`}
            />
            <InfoCard
              icon={<TrendingDown size={22} />}
              label="Abstieg"
              value="0 m"
            />
            <InfoCard
              icon={<Clock size={22} />}
              label="Gehzeit"
              value="~4h 25min"
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
                  Braunschweiger Hütte
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Tel. +43 5413 86116
                </p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                  <Globe
                    size={14}
                    className="text-primary opacity-70 shrink-0"
                  />
                  <a
                    href="https://www.braunschweiger-huette.at"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors duration-200 inline-flex items-center gap-1"
                  >
                    braunschweiger-huette.at{" "}
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
                Etappe 6 · Wenns → Braunschweiger Hütte
              </p>
              <dl className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-xs font-bold tracking-[0.12em] uppercase text-primary shrink-0 w-28 mb-0.5 sm:mb-0 pt-0.5">
                    Anreise
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">
                    Bus Linie 310 (VVT/Postbus) ab Wenns Pitztaler Hof 07:33 Uhr
                    → Mittelberg Wendestelle ca. 08:27 Uhr, dann Aufstieg zu Fuß
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-xs font-bold tracking-[0.12em] uppercase text-primary shrink-0 w-28 mb-0.5 sm:mb-0 pt-0.5">
                    Highlight
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">
                    Pitztaler Wasserfall und Gletscherzunge des
                    Mittelbergferners
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-xs font-bold tracking-[0.12em] uppercase text-primary shrink-0 w-28 mb-0.5 sm:mb-0 pt-0.5">
                    Charakter
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">
                    Kurz aber anspruchsvoll — +978 m auf nur 5,5 km, die
                    Königsetappe des E5!
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
                        ETAPPE6_DATA.profile as unknown as {
                          d: number;
                          e: number;
                        }[]
                      }
                      distanceMax={ETAPPE6_DATA.distanceKm}
                      elevationDomain={[1600, 2800]}
                      gradientId="elevGradient6"
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
                    src="/assets/images/Etappe6.png"
                    alt="Routenkarte Etappe 6: Wenns → Braunschweiger Hütte"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Photos & journal */}
          <StagePhotoSection
            stageId={6n}
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
