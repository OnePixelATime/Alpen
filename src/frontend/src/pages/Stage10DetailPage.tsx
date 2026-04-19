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

// ─── Hardcoded Etappe 10 data ──────────────────────────────────────────────

const ETAPPE10_DATA = {
  distanceKm: 5.6,
  ascentM: 698,
  descentM: 385,
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
    { d: 2.78, e: 3053 },
    { d: 2.84, e: 3062 },
    { d: 2.94, e: 3071 },
    { d: 3.08, e: 3071 },
    { d: 3.16, e: 3065 },
    { d: 3.27, e: 3053 },
    { d: 3.34, e: 3041 },
    { d: 3.41, e: 3022 },
    { d: 3.48, e: 3005 },
    { d: 3.54, e: 2992 },
    { d: 3.61, e: 2977 },
    { d: 3.69, e: 2958 },
    { d: 3.76, e: 2943 },
    { d: 3.82, e: 2927 },
    { d: 3.9, e: 2908 },
    { d: 3.98, e: 2894 },
    { d: 4.07, e: 2877 },
    { d: 4.21, e: 2855 },
    { d: 4.33, e: 2835 },
    { d: 4.44, e: 2817 },
    { d: 4.52, e: 2800 },
    { d: 4.55, e: 2794 },
    { d: 4.61, e: 2781 },
    { d: 4.69, e: 2763 },
    { d: 4.76, e: 2751 },
    { d: 4.82, e: 2740 },
    { d: 4.9, e: 2726 },
    { d: 4.97, e: 2716 },
    { d: 5.04, e: 2706 },
    { d: 5.08, e: 2700 },
    { d: 5.13, e: 2695 },
    { d: 5.23, e: 2689 },
    { d: 5.29, e: 2686 },
    { d: 5.37, e: 2697 },
    { d: 5.45, e: 2709 },
    { d: 5.5, e: 2715 },
    { d: 5.64, e: 2716 },
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

export function Stage10DetailPage() {
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
    queryKey: ["stagePhotos", "10"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStagePhotos(10n);
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
                13. August 2026
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-foreground leading-tight tracking-tight">
              Etappe 10
              <br />
              <span className="text-primary">Hochjoch Hospiz</span>
              <span className="mx-2 text-muted-foreground">→</span>
              <span>Vernagthütte</span>
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
              value={`${ETAPPE10_DATA.distanceKm.toLocaleString("de-DE", { minimumFractionDigits: 1 })} km`}
            />
            <InfoCard
              icon={<TrendingUp size={22} />}
              label="Aufstieg"
              value={`+${ETAPPE10_DATA.ascentM.toLocaleString("de-DE")} m`}
            />
            <InfoCard
              icon={<TrendingDown size={22} />}
              label="Abstieg"
              value={`−${ETAPPE10_DATA.descentM.toLocaleString("de-DE")} m`}
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
                  Vernagthütte
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Franz-Senn-Weg 1, 6458 Vent
                </p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                  <Phone
                    size={13}
                    className="text-primary opacity-70 shrink-0"
                  />
                  <span>+43 664 141 21 19</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                  <Mail
                    size={13}
                    className="text-primary opacity-70 shrink-0"
                  />
                  <a
                    href="mailto:info@vernagt-scheiber.at"
                    className="hover:text-foreground transition-colors duration-200"
                  >
                    info@vernagt-scheiber.at
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
                Etappe 10 · Hochjoch Hospiz → Vernagthütte
              </p>
              <dl className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-xs font-bold tracking-[0.12em] uppercase text-primary shrink-0 w-28 mb-0.5 sm:mb-0 pt-0.5">
                    Route
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">
                    Aufstieg über die Guslarspitze (3.071 m), dann Abstieg zur
                    Vernagthütte
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-xs font-bold tracking-[0.12em] uppercase text-primary shrink-0 w-28 mb-0.5 sm:mb-0 pt-0.5">
                    Charakter
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">
                    Anspruchsvolle Hochgebirgsroute mit traumhaftem Panorama auf
                    Wildspitze und Ötztaler Gletscherwelt
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-xs font-bold tracking-[0.12em] uppercase text-primary shrink-0 w-28 mb-0.5 sm:mb-0 pt-0.5">
                    Highlight
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">
                    Guslarspitze (3.071 m) — zweiter Tag in Folge über 3.000 m!
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
                        ETAPPE10_DATA.profile as unknown as {
                          d: number;
                          e: number;
                        }[]
                      }
                      distanceMax={ETAPPE10_DATA.distanceKm}
                      elevationDomain={[2200, 3200]}
                      gradientId="elevGradient10"
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
                    src="/assets/images/Etappe10.png"
                    alt="Routenkarte Etappe 10: Hochjoch Hospiz → Vernagthütte"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Photos & journal */}
          <StagePhotoSection
            stageId={10n}
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
