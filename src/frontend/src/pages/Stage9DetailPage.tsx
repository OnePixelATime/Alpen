import { useActor } from "@caffeineai/core-infrastructure";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import {
  Clock,
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

// ─── Hardcoded Etappe 9 data ───────────────────────────────────────────────

const ETAPPE9_DATA = {
  distanceKm: 5.7,
  ascentM: 662,
  descentM: 621,
  profile: [
    { d: 0.0, e: 2402 },
    { d: 0.09, e: 2402 },
    { d: 0.13, e: 2411 },
    { d: 0.23, e: 2440 },
    { d: 0.33, e: 2468 },
    { d: 0.42, e: 2490 },
    { d: 0.51, e: 2512 },
    { d: 0.62, e: 2531 },
    { d: 0.71, e: 2549 },
    { d: 0.81, e: 2572 },
    { d: 0.89, e: 2590 },
    { d: 0.96, e: 2606 },
    { d: 1.06, e: 2630 },
    { d: 1.18, e: 2654 },
    { d: 1.28, e: 2672 },
    { d: 1.42, e: 2692 },
    { d: 1.53, e: 2706 },
    { d: 1.61, e: 2717 },
    { d: 1.71, e: 2729 },
    { d: 1.81, e: 2757 },
    { d: 1.87, e: 2771 },
    { d: 1.97, e: 2806 },
    { d: 2.02, e: 2824 },
    { d: 2.12, e: 2857 },
    { d: 2.22, e: 2891 },
    { d: 2.27, e: 2909 },
    { d: 2.34, e: 2930 },
    { d: 2.42, e: 2952 },
    { d: 2.5, e: 2976 },
    { d: 2.57, e: 2997 },
    { d: 2.64, e: 3020 },
    { d: 2.71, e: 3042 },
    { d: 2.78, e: 3051 },
    { d: 2.82, e: 3055 },
    { d: 2.87, e: 3062 },
    { d: 2.89, e: 3064 },
    { d: 2.94, e: 3057 },
    { d: 2.99, e: 3047 },
    { d: 3.06, e: 3030 },
    { d: 3.15, e: 3005 },
    { d: 3.24, e: 2977 },
    { d: 3.33, e: 2951 },
    { d: 3.4, e: 2930 },
    { d: 3.49, e: 2902 },
    { d: 3.62, e: 2857 },
    { d: 3.72, e: 2823 },
    { d: 3.82, e: 2789 },
    { d: 3.9, e: 2762 },
    { d: 3.96, e: 2750 },
    { d: 4.03, e: 2732 },
    { d: 4.11, e: 2717 },
    { d: 4.21, e: 2706 },
    { d: 4.26, e: 2700 },
    { d: 4.32, e: 2693 },
    { d: 4.42, e: 2678 },
    { d: 4.5, e: 2665 },
    { d: 4.56, e: 2654 },
    { d: 4.68, e: 2631 },
    { d: 4.78, e: 2607 },
    { d: 4.85, e: 2589 },
    { d: 4.93, e: 2570 },
    { d: 4.99, e: 2558 },
    { d: 5.03, e: 2550 },
    { d: 5.12, e: 2531 },
    { d: 5.18, e: 2519 },
    { d: 5.23, e: 2510 },
    { d: 5.31, e: 2495 },
    { d: 5.41, e: 2467 },
    { d: 5.51, e: 2443 },
    { d: 5.74, e: 2443 },
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

export function Stage9DetailPage() {
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
    queryKey: ["stagePhotos", "9"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStagePhotos(9n);
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
                12. August 2026
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-foreground leading-tight tracking-tight">
              Etappe 9
              <br />
              <span className="text-primary">Gipfeltag</span>
              <span className="mx-2 text-muted-foreground">·</span>
              <span>Mittlere Guslarspitze</span>
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
              value={`${ETAPPE9_DATA.distanceKm.toLocaleString("de-DE", { minimumFractionDigits: 1 })} km`}
            />
            <InfoCard
              icon={<TrendingUp size={22} />}
              label="Aufstieg"
              value={`+${ETAPPE9_DATA.ascentM.toLocaleString("de-DE")} m`}
            />
            <InfoCard
              icon={<TrendingDown size={22} />}
              label="Abstieg"
              value={`−${ETAPPE9_DATA.descentM.toLocaleString("de-DE")} m`}
            />
            <InfoCard
              icon={<Clock size={22} />}
              label="Gehzeit"
              value="~4h 50min"
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
                  Hochjoch Hospiz
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Franz-Senn-Weg 1, 6458 Vent
                </p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                  <Phone
                    size={13}
                    className="text-primary opacity-70 shrink-0"
                  />
                  <span>+43 720 51 31 30</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                  <Mail
                    size={13}
                    className="text-primary opacity-70 shrink-0"
                  />
                  <a
                    href="mailto:info@hochjoch-hospiz.at"
                    className="hover:text-foreground transition-colors duration-200"
                  >
                    info@hochjoch-hospiz.at
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
                Etappe 9 · Gipfeltag Mittlere Guslarspitze
              </p>
              <dl className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-xs font-bold tracking-[0.12em] uppercase text-primary shrink-0 w-28 mb-0.5 sm:mb-0 pt-0.5">
                    Charakter
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">
                    Rundtour vom Hochjoch Hospiz auf die Mittlere Guslarspitze
                    und zurück, gletscherfrei und markiert
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-xs font-bold tracking-[0.12em] uppercase text-primary shrink-0 w-28 mb-0.5 sm:mb-0 pt-0.5">
                    Highlight
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">
                    Gipfel auf 3.064 m mit Panoramablick auf Weißkugel, Similaun
                    und die gesamten Ötztaler Alpen
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-xs font-bold tracking-[0.12em] uppercase text-primary shrink-0 w-28 mb-0.5 sm:mb-0 pt-0.5">
                    Hinweis
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">
                    Übernachtung wieder im Hochjoch Hospiz (2. Nacht)
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-xs font-bold tracking-[0.12em] uppercase text-primary shrink-0 w-28 mb-0.5 sm:mb-0 pt-0.5">
                    Tipp
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">
                    Hüttenwirt Florian ist staatlich geprüfter Bergführer —
                    gerne bei der Tourenplanung fragen!
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
                        ETAPPE9_DATA.profile as unknown as {
                          d: number;
                          e: number;
                        }[]
                      }
                      distanceMax={ETAPPE9_DATA.distanceKm}
                      elevationDomain={[2200, 3200]}
                      gradientId="elevGradient9"
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
                    src="/assets/images/Etappe9.png"
                    alt="Routenkarte Etappe 9: Gipfeltag Mittlere Guslarspitze"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Photos & journal */}
          <StagePhotoSection
            stageId={9n}
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
