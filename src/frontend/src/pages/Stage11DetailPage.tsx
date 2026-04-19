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

// ─── Hardcoded Etappe 11 data ──────────────────────────────────────────────

const ETAPPE11_DATA = {
  distanceKm: 13.9,
  ascentM: 916,
  descentM: 517,
  profile: [
    { d: 0.0, e: 2725 },
    { d: 0.1, e: 2724 },
    { d: 0.19, e: 2706 },
    { d: 0.28, e: 2688 },
    { d: 0.39, e: 2664 },
    { d: 0.5, e: 2644 },
    { d: 0.79, e: 2627 },
    { d: 1.07, e: 2628 },
    { d: 1.45, e: 2632 },
    { d: 1.77, e: 2630 },
    { d: 2.02, e: 2631 },
    { d: 2.22, e: 2635 },
    { d: 2.44, e: 2628 },
    { d: 2.91, e: 2604 },
    { d: 3.67, e: 2616 },
    { d: 4.04, e: 2610 },
    { d: 4.25, e: 2569 },
    { d: 4.51, e: 2521 },
    { d: 4.64, e: 2490 },
    { d: 4.91, e: 2415 },
    { d: 5.06, e: 2379 },
    { d: 5.17, e: 2357 },
    { d: 5.33, e: 2326 },
    { d: 5.51, e: 2298 },
    { d: 5.68, e: 2299 },
    { d: 5.83, e: 2320 },
    { d: 5.96, e: 2345 },
    { d: 6.1, e: 2378 },
    { d: 6.25, e: 2404 },
    { d: 6.4, e: 2421 },
    { d: 6.53, e: 2434 },
    { d: 6.69, e: 2453 },
    { d: 6.85, e: 2468 },
    { d: 7.12, e: 2488 },
    { d: 7.29, e: 2501 },
    { d: 7.5, e: 2524 },
    { d: 7.67, e: 2546 },
    { d: 7.86, e: 2571 },
    { d: 8.09, e: 2595 },
    { d: 8.51, e: 2635 },
    { d: 8.79, e: 2668 },
    { d: 9.42, e: 2739 },
    { d: 9.68, e: 2764 },
    { d: 9.86, e: 2782 },
    { d: 10.01, e: 2796 },
    { d: 10.09, e: 2803 },
    { d: 10.32, e: 2824 },
    { d: 10.57, e: 2834 },
    { d: 10.7, e: 2835 },
    { d: 10.95, e: 2834 },
    { d: 11.09, e: 2831 },
    { d: 11.28, e: 2821 },
    { d: 11.4, e: 2811 },
    { d: 11.6, e: 2791 },
    { d: 11.74, e: 2779 },
    { d: 11.95, e: 2778 },
    { d: 12.07, e: 2788 },
    { d: 12.17, e: 2806 },
    { d: 12.28, e: 2831 },
    { d: 12.34, e: 2845 },
    { d: 12.45, e: 2871 },
    { d: 12.57, e: 2902 },
    { d: 12.63, e: 2920 },
    { d: 12.72, e: 2944 },
    { d: 12.83, e: 2969 },
    { d: 13.06, e: 3008 },
    { d: 13.29, e: 3049 },
    { d: 13.42, e: 3072 },
    { d: 13.53, e: 3092 },
    { d: 13.69, e: 3122 },
    { d: 13.78, e: 3124 },
    { d: 13.91, e: 3124 },
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

export function Stage11DetailPage() {
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
    queryKey: ["stagePhotos", "11"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStagePhotos(11n);
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
                14. August 2026
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-foreground leading-tight tracking-tight">
              Etappe 11
              <br />
              <span className="text-primary">Vernagthütte</span>
              <span className="mx-2 text-muted-foreground">→</span>
              <span>Schnals</span>
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
              value={`${ETAPPE11_DATA.distanceKm.toLocaleString("de-DE", { minimumFractionDigits: 1 })} km`}
            />
            <InfoCard
              icon={<TrendingUp size={22} />}
              label="Aufstieg"
              value={`+${ETAPPE11_DATA.ascentM.toLocaleString("de-DE")} m`}
            />
            <InfoCard
              icon={<TrendingDown size={22} />}
              label="Abstieg"
              value={`−${ETAPPE11_DATA.descentM.toLocaleString("de-DE")} m`}
            />
            <InfoCard
              icon={<Clock size={22} />}
              label="Gehzeit"
              value="~8h 10min"
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
                  Gasthof Neuratheis
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Katharinaberg 40, 39020 Schnals
                </p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                  <Phone
                    size={13}
                    className="text-primary opacity-70 shrink-0"
                  />
                  <a
                    href="tel:+393517537757"
                    className="hover:text-foreground transition-colors duration-200"
                  >
                    +39 351 7537757
                  </a>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                  <Mail
                    size={13}
                    className="text-primary opacity-70 shrink-0"
                  />
                  <a
                    href="mailto:info@neuratheis.com"
                    className="hover:text-foreground transition-colors duration-200"
                  >
                    info@neuratheis.com
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
                Etappe 11 · Vernagthütte → Schöne Aussicht → Grawand
              </p>
              <dl className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-xs font-bold tracking-[0.12em] uppercase text-primary shrink-0 w-28 mb-0.5 sm:mb-0 pt-0.5">
                    Route
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">
                    Vernagthütte → Höhenweg → Hochjoch Hospiz → Abstieg
                    Hintereisbach → Schöne Aussicht (2.845 m) → Grawand
                    Bergstation (3.124 m)
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-xs font-bold tracking-[0.12em] uppercase text-primary shrink-0 w-28 mb-0.5 sm:mb-0 pt-0.5">
                    Highlight
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">
                    Schöne Aussicht mit Panoramablick auf Hochjochferner,
                    Finailspitze und Weißkugel — danach mit der Gletscherbahn in
                    6 Min. nach Kurzras!
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-xs font-bold tracking-[0.12em] uppercase text-primary shrink-0 w-28 mb-0.5 sm:mb-0 pt-0.5">
                    Hinweis
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">
                    Gletscherbahn Kurzras täglich 10:00–16:30 Uhr. Spätestens um
                    14:00 Uhr an der Schönen Aussicht sein!
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-xs font-bold tracking-[0.12em] uppercase text-primary shrink-0 w-28 mb-0.5 sm:mb-0 pt-0.5">
                    Anschluss
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">
                    Gletscherbahn Grawand → Kurzras → Bus SAD Linie 261 →
                    Neuratheis
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
                        ETAPPE11_DATA.profile as unknown as {
                          d: number;
                          e: number;
                        }[]
                      }
                      distanceMax={ETAPPE11_DATA.distanceKm}
                      elevationDomain={[2100, 3300]}
                      gradientId="elevGradient11"
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
                    src="/assets/images/Etappe11.png"
                    alt="Routenkarte Etappe 11: Vernagthütte → Schöne Aussicht → Grawand"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Photos & journal */}
          <StagePhotoSection
            stageId={11n}
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
