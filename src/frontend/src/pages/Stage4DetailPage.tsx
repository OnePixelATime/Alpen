import { useActor } from "@caffeineai/core-infrastructure";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import {
  Clock,
  ExternalLink,
  Globe,
  Home,
  MapPin,
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

// ─── Hardcoded Etappe 4 data ───────────────────────────────────────────────

const ETAPPE4_DATA = {
  distanceKm: 6.0,
  ascentM: 0,
  descentM: 1173,
  profile: [
    { d: 0.0, e: 2326 },
    { d: 0.09, e: 2326 },
    { d: 0.19, e: 2306 },
    { d: 0.29, e: 2285 },
    { d: 0.36, e: 2266 },
    { d: 0.44, e: 2248 },
    { d: 0.5, e: 2231 },
    { d: 0.58, e: 2211 },
    { d: 0.66, e: 2191 },
    { d: 0.72, e: 2175 },
    { d: 0.79, e: 2154 },
    { d: 0.85, e: 2134 },
    { d: 0.93, e: 2111 },
    { d: 1.01, e: 2089 },
    { d: 1.06, e: 2074 },
    { d: 1.14, e: 2049 },
    { d: 1.2, e: 2033 },
    { d: 1.27, e: 2013 },
    { d: 1.34, e: 1993 },
    { d: 1.39, e: 1973 },
    { d: 1.46, e: 1952 },
    { d: 1.5, e: 1935 },
    { d: 1.58, e: 1907 },
    { d: 1.66, e: 1879 },
    { d: 1.72, e: 1856 },
    { d: 1.79, e: 1836 },
    { d: 1.85, e: 1818 },
    { d: 1.92, e: 1799 },
    { d: 2.01, e: 1784 },
    { d: 2.15, e: 1762 },
    { d: 2.25, e: 1748 },
    { d: 2.33, e: 1737 },
    { d: 2.4, e: 1728 },
    { d: 2.47, e: 1719 },
    { d: 2.55, e: 1709 },
    { d: 2.67, e: 1693 },
    { d: 2.73, e: 1684 },
    { d: 2.79, e: 1674 },
    { d: 2.86, e: 1663 },
    { d: 2.94, e: 1645 },
    { d: 2.99, e: 1629 },
    { d: 3.04, e: 1614 },
    { d: 3.11, e: 1593 },
    { d: 3.17, e: 1572 },
    { d: 3.23, e: 1551 },
    { d: 3.31, e: 1528 },
    { d: 3.36, e: 1514 },
    { d: 3.44, e: 1491 },
    { d: 3.54, e: 1466 },
    { d: 3.61, e: 1450 },
    { d: 3.66, e: 1439 },
    { d: 3.77, e: 1411 },
    { d: 3.86, e: 1385 },
    { d: 3.91, e: 1371 },
    { d: 3.96, e: 1359 },
    { d: 4.06, e: 1338 },
    { d: 4.14, e: 1319 },
    { d: 4.23, e: 1298 },
    { d: 4.33, e: 1277 },
    { d: 4.49, e: 1248 },
    { d: 4.6, e: 1235 },
    { d: 4.71, e: 1223 },
    { d: 4.82, e: 1215 },
    { d: 4.95, e: 1203 },
    { d: 5.05, e: 1193 },
    { d: 5.12, e: 1186 },
    { d: 5.3, e: 1171 },
    { d: 5.42, e: 1164 },
    { d: 5.64, e: 1155 },
    { d: 5.97, e: 1153 },
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

export function Stage4DetailPage() {
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
    queryKey: ["stagePhotos", "4"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStagePhotos(4n);
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
                07. August 2026
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-foreground leading-tight tracking-tight">
              Etappe 4
              <br />
              <span className="text-primary">Ansbacher Hütte</span>
              <span className="mx-2 text-muted-foreground">→</span>
              <span>Zams/Venet</span>
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
              value={`${ETAPPE4_DATA.distanceKm.toLocaleString("de-DE", { minimumFractionDigits: 1 })} km`}
            />
            <InfoCard
              icon={<TrendingUp size={22} />}
              label="Aufstieg"
              value={`+${ETAPPE4_DATA.ascentM.toLocaleString("de-DE")} m`}
            />
            <InfoCard
              icon={<TrendingDown size={22} />}
              label="Abstieg"
              value={`−${ETAPPE4_DATA.descentM.toLocaleString("de-DE")} m`}
            />
            <InfoCard
              icon={<Clock size={22} />}
              label="Gehzeit"
              value="~4h 05min"
            />
          </div>

          {/* Accommodation */}
          <div className="wood-texture relative rounded-xl bg-card border border-border overflow-hidden">
            <div className="h-1 w-full bg-primary opacity-70" />
            <div className="p-5 flex items-start gap-4">
              <Home
                size={20}
                className="text-primary opacity-80 shrink-0 mt-0.5"
              />
              <div className="flex flex-col gap-2 min-w-0">
                <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Unterkunft
                </p>
                <p className="text-lg font-bold font-display text-foreground leading-snug">
                  Venet Gipfelhütte
                </p>
                <div className="flex flex-col gap-1.5 mt-1">
                  <div className="flex items-start gap-2 text-sm text-foreground/80">
                    <MapPin
                      size={14}
                      className="text-primary opacity-70 shrink-0 mt-0.5"
                    />
                    <span>Hauptstraße 38, 6511 Zams</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/80">
                    <Phone
                      size={14}
                      className="text-primary opacity-70 shrink-0"
                    />
                    <a
                      href="tel:+43544262663"
                      className="hover:text-foreground transition-colors duration-200"
                    >
                      +43 5442 62663
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/80">
                    <Globe
                      size={14}
                      className="text-primary opacity-70 shrink-0"
                    />
                    <a
                      href="https://www.venet.at"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors duration-200 inline-flex items-center gap-1"
                    >
                      venet.at <ExternalLink size={11} className="opacity-60" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stage info */}
          <div
            className="wood-texture relative rounded-xl bg-card border border-border overflow-hidden"
            data-ocid="stage-info"
          >
            <div className="h-1 w-full bg-primary opacity-70" />
            <div className="p-5 flex flex-col gap-3">
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                Etappeninfos
              </p>
              <dl className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <dt className="font-bold text-sm text-foreground shrink-0 min-w-[8rem]">
                    Optional morgens:
                  </dt>
                  <dd className="text-sm text-foreground/90">
                    Samspitze (2.624 m), 45 min, leicht
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <dt className="font-bold text-sm text-foreground shrink-0 min-w-[8rem]">
                    Route:
                  </dt>
                  <dd className="text-sm text-foreground/90">
                    Ansbacher Hütte → Fritzhütte → Flirsch (zu Fuß, ~3h,
                    Bergwaldsteig)
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <dt className="font-bold text-sm text-foreground shrink-0 min-w-[8rem]">
                    Öffentlich:
                  </dt>
                  <dd className="text-sm text-foreground/90">
                    Bus 4242 ab Flirsch Dorfplatz → Landeck-Zams (~28 min,
                    stündlich)
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <dt className="font-bold text-sm text-foreground shrink-0 min-w-[8rem]">
                    Weiter:
                  </dt>
                  <dd className="text-sm text-foreground/90">
                    Shuttle ab Apotheke Zams → Talstation Rifenalbahn (€ 2,00) →
                    Sessellift Rifenalbahn + Weinbergbahn → Venet Gipfelhütte
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-2 rounded-lg bg-amber-500/15 border border-amber-500/30 px-3 py-2">
                  <dt className="font-bold text-sm text-amber-700 dark:text-amber-400 shrink-0 min-w-[8rem]">
                    ⚠ Wichtig:
                  </dt>
                  <dd className="text-sm text-amber-700 dark:text-amber-400">
                    Letzte Bergfahrt 15:30 Uhr — rechtzeitig in Flirsch sein!
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-2 rounded-lg bg-amber-500/15 border border-amber-500/30 px-3 py-2">
                  <dt className="font-bold text-sm text-amber-700 dark:text-amber-400 shrink-0 min-w-[8rem]">
                    ⚠ Sommer 2026:
                  </dt>
                  <dd className="text-sm text-amber-700 dark:text-amber-400">
                    Venetbahn geschlossen, nur Rifenalbahn + Weinbergbahn in
                    Betrieb
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-2 rounded-lg bg-amber-500/15 border border-amber-500/30 px-3 py-2">
                  <dt className="font-bold text-sm text-amber-700 dark:text-amber-400 shrink-0 min-w-[8rem]">
                    ⚠ Sommer 2026:
                  </dt>
                  <dd className="text-sm text-amber-700 dark:text-amber-400">
                    Abstieg führt über Schotterwerk Zams (Autobahnbrücke
                    gesperrt)
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
                        ETAPPE4_DATA.profile as unknown as {
                          d: number;
                          e: number;
                        }[]
                      }
                      distanceMax={ETAPPE4_DATA.distanceKm}
                      elevationDomain={[1100, 2400]}
                      gradientId="elevGradient4"
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
                    src="/assets/images/etappe4.png"
                    alt="Routenkarte Etappe 4: Ansbacher Hütte → Zams/Venet"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Photos & journal */}
          <StagePhotoSection
            stageId={4n}
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
