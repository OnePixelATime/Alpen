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

// ─── Hardcoded Etappe 5 data ───────────────────────────────────────────────

const ETAPPE5_DATA = {
  distanceKm: 11.9,
  ascentM: 395,
  descentM: 1565,
  profile: [
    { d: 0.0, e: 2199 },
    { d: 0.12, e: 2198 },
    { d: 0.22, e: 2192 },
    { d: 0.34, e: 2183 },
    { d: 0.44, e: 2168 },
    { d: 0.55, e: 2162 },
    { d: 0.66, e: 2167 },
    { d: 0.76, e: 2171 },
    { d: 0.87, e: 2175 },
    { d: 0.98, e: 2178 },
    { d: 1.08, e: 2179 },
    { d: 1.19, e: 2192 },
    { d: 1.29, e: 2208 },
    { d: 1.4, e: 2218 },
    { d: 1.5, e: 2228 },
    { d: 1.61, e: 2251 },
    { d: 1.71, e: 2273 },
    { d: 1.82, e: 2289 },
    { d: 1.93, e: 2307 },
    { d: 2.04, e: 2328 },
    { d: 2.14, e: 2353 },
    { d: 2.25, e: 2386 },
    { d: 2.35, e: 2415 },
    { d: 2.46, e: 2442 },
    { d: 2.56, e: 2466 },
    { d: 2.67, e: 2487 },
    { d: 2.78, e: 2499 },
    { d: 2.89, e: 2505 },
    { d: 3.0, e: 2493 },
    { d: 3.1, e: 2480 },
    { d: 3.21, e: 2469 },
    { d: 3.31, e: 2459 },
    { d: 3.42, e: 2461 },
    { d: 3.53, e: 2459 },
    { d: 3.64, e: 2447 },
    { d: 3.75, e: 2447 },
    { d: 3.86, e: 2459 },
    { d: 3.96, e: 2471 },
    { d: 4.07, e: 2483 },
    { d: 4.18, e: 2479 },
    { d: 4.29, e: 2470 },
    { d: 4.4, e: 2459 },
    { d: 4.5, e: 2448 },
    { d: 4.61, e: 2439 },
    { d: 4.71, e: 2429 },
    { d: 4.86, e: 2402 },
    { d: 4.96, e: 2375 },
    { d: 5.07, e: 2342 },
    { d: 5.17, e: 2312 },
    { d: 5.28, e: 2284 },
    { d: 5.38, e: 2249 },
    { d: 5.48, e: 2212 },
    { d: 5.6, e: 2170 },
    { d: 5.7, e: 2130 },
    { d: 5.81, e: 2098 },
    { d: 5.91, e: 2067 },
    { d: 6.02, e: 2033 },
    { d: 6.12, e: 2001 },
    { d: 6.23, e: 1974 },
    { d: 6.33, e: 1955 },
    { d: 6.44, e: 1957 },
    { d: 6.55, e: 1955 },
    { d: 6.66, e: 1950 },
    { d: 6.76, e: 1939 },
    { d: 6.87, e: 1925 },
    { d: 6.98, e: 1911 },
    { d: 7.08, e: 1898 },
    { d: 7.19, e: 1886 },
    { d: 7.3, e: 1874 },
    { d: 7.4, e: 1857 },
    { d: 7.51, e: 1841 },
    { d: 7.62, e: 1829 },
    { d: 7.73, e: 1820 },
    { d: 7.83, e: 1813 },
    { d: 8.1, e: 1764 },
    { d: 8.2, e: 1744 },
    { d: 8.31, e: 1723 },
    { d: 8.41, e: 1702 },
    { d: 8.52, e: 1680 },
    { d: 8.62, e: 1658 },
    { d: 8.73, e: 1636 },
    { d: 8.83, e: 1616 },
    { d: 8.94, e: 1594 },
    { d: 9.04, e: 1571 },
    { d: 9.14, e: 1548 },
    { d: 9.25, e: 1527 },
    { d: 9.36, e: 1505 },
    { d: 9.46, e: 1482 },
    { d: 9.57, e: 1458 },
    { d: 9.67, e: 1436 },
    { d: 9.78, e: 1418 },
    { d: 9.89, e: 1400 },
    { d: 9.99, e: 1386 },
    { d: 10.1, e: 1371 },
    { d: 10.21, e: 1348 },
    { d: 10.32, e: 1326 },
    { d: 10.42, e: 1303 },
    { d: 11.25, e: 1110 },
    { d: 11.36, e: 1092 },
    { d: 11.47, e: 1075 },
    { d: 11.58, e: 1054 },
    { d: 11.68, e: 1032 },
    { d: 11.79, e: 1029 },
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

export function Stage5DetailPage() {
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
    queryKey: ["stagePhotos", "5"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStagePhotos(5n);
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
                08. August 2026
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-foreground leading-tight tracking-tight">
              Etappe 5
              <br />
              <span className="text-primary">Venet Gipfelhütte</span>
              <span className="mx-2 text-muted-foreground">→</span>
              <span>Wenns</span>
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
              value={`${ETAPPE5_DATA.distanceKm.toLocaleString("de-DE", { minimumFractionDigits: 1 })} km`}
            />
            <InfoCard
              icon={<TrendingUp size={22} />}
              label="Aufstieg"
              value={`+${ETAPPE5_DATA.ascentM.toLocaleString("de-DE")} m`}
            />
            <InfoCard
              icon={<TrendingDown size={22} />}
              label="Abstieg"
              value={`−${ETAPPE5_DATA.descentM.toLocaleString("de-DE")} m`}
            />
            <InfoCard
              icon={<Clock size={22} />}
              label="Gehzeit"
              value="~7h 45min"
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
                  Hotel Pension Weiratherhof
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Oberdorf 711, 6473 Wenns · Tel. +43 5414 86111
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  info@weiratherhof-pitztal.at
                </p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                  <Globe
                    size={14}
                    className="text-primary opacity-70 shrink-0"
                  />
                  <a
                    href="https://www.weiratherhof-pitztal.at"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors duration-200 inline-flex items-center gap-1"
                  >
                    weiratherhof-pitztal.at{" "}
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
                Etappe 5 · Venet Gipfelhütte → Wenns
              </p>
              <dl className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-xs font-bold tracking-[0.12em] uppercase text-primary shrink-0 w-28 mb-0.5 sm:mb-0 pt-0.5">
                    Highlight
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">
                    Glanderspitze (2.505 m) und Wannejöchl (2.495 m) mit
                    Panoramablick ins Inntal und Pitztal
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-xs font-bold tracking-[0.12em] uppercase text-primary shrink-0 w-28 mb-0.5 sm:mb-0 pt-0.5">
                    Charakter
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">
                    Zuerst Aufstieg zur Glanderspitze (+395 m), dann langer
                    Abstieg −1.565 m ins Pitztal nach Wenns
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
                        ETAPPE5_DATA.profile as unknown as {
                          d: number;
                          e: number;
                        }[]
                      }
                      distanceMax={ETAPPE5_DATA.distanceKm}
                      elevationDomain={[900, 2600]}
                      gradientId="elevGradient5"
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
                    src="/assets/images/etappe5.png"
                    alt="Routenkarte Etappe 5: Venet Gipfelhütte → Wenns"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Photos & journal */}
          <StagePhotoSection
            stageId={5n}
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
