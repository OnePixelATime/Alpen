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

// ─── Hardcoded Etappe 8 data ───────────────────────────────────────────────

const ETAPPE8_DATA = {
  distanceKm: 8.4,
  ascentM: 457,
  descentM: 12,
  profile: [
    { d: 0.0, e: 1896 },
    { d: 0.08, e: 1896 },
    { d: 0.21, e: 1899 },
    { d: 0.35, e: 1905 },
    { d: 0.45, e: 1915 },
    { d: 0.55, e: 1925 },
    { d: 0.62, e: 1932 },
    { d: 0.76, e: 1946 },
    { d: 0.93, e: 1960 },
    { d: 1.04, e: 1964 },
    { d: 1.12, e: 1968 },
    { d: 1.27, e: 1976 },
    { d: 1.38, e: 1982 },
    { d: 1.52, e: 1990 },
    { d: 1.66, e: 1994 },
    { d: 1.76, e: 1997 },
    { d: 1.86, e: 1998 },
    { d: 1.97, e: 1999 },
    { d: 2.04, e: 2000 },
    { d: 2.11, e: 2002 },
    { d: 2.19, e: 2004 },
    { d: 2.4, e: 2009 },
    { d: 2.6, e: 2010 },
    { d: 2.71, e: 2011 },
    { d: 2.87, e: 2017 },
    { d: 2.97, e: 2022 },
    { d: 3.01, e: 2024 },
    { d: 3.27, e: 2041 },
    { d: 3.5, e: 2059 },
    { d: 3.6, e: 2066 },
    { d: 3.7, e: 2073 },
    { d: 3.85, e: 2075 },
    { d: 3.96, e: 2079 },
    { d: 4.03, e: 2085 },
    { d: 4.1, e: 2089 },
    { d: 4.16, e: 2095 },
    { d: 4.21, e: 2100 },
    { d: 4.28, e: 2107 },
    { d: 4.4, e: 2111 },
    { d: 4.53, e: 2113 },
    { d: 4.67, e: 2108 },
    { d: 4.77, e: 2107 },
    { d: 4.94, e: 2108 },
    { d: 5.03, e: 2113 },
    { d: 5.12, e: 2117 },
    { d: 5.23, e: 2119 },
    { d: 5.35, e: 2122 },
    { d: 5.51, e: 2126 },
    { d: 5.61, e: 2133 },
    { d: 5.67, e: 2136 },
    { d: 5.76, e: 2138 },
    { d: 5.91, e: 2139 },
    { d: 6.06, e: 2135 },
    { d: 6.17, e: 2140 },
    { d: 6.21, e: 2143 },
    { d: 6.29, e: 2150 },
    { d: 6.37, e: 2158 },
    { d: 6.46, e: 2169 },
    { d: 6.51, e: 2174 },
    { d: 6.62, e: 2185 },
    { d: 6.71, e: 2195 },
    { d: 6.75, e: 2197 },
    { d: 6.82, e: 2202 },
    { d: 6.86, e: 2205 },
    { d: 6.92, e: 2208 },
    { d: 6.98, e: 2212 },
    { d: 7.07, e: 2217 },
    { d: 7.19, e: 2225 },
    { d: 7.23, e: 2228 },
    { d: 7.29, e: 2232 },
    { d: 7.35, e: 2238 },
    { d: 7.43, e: 2246 },
    { d: 7.47, e: 2250 },
    { d: 7.52, e: 2255 },
    { d: 7.55, e: 2260 },
    { d: 7.58, e: 2265 },
    { d: 7.62, e: 2271 },
    { d: 7.73, e: 2286 },
    { d: 7.77, e: 2294 },
    { d: 7.83, e: 2303 },
    { d: 7.9, e: 2314 },
    { d: 8.05, e: 2334 },
    { d: 8.12, e: 2341 },
    { d: 8.35, e: 2341 },
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

export function Stage8DetailPage() {
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
    queryKey: ["stagePhotos", "8"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStagePhotos(8n);
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
                11. August 2026
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-foreground leading-tight tracking-tight">
              Etappe 8
              <br />
              <span className="text-primary">Vent</span>
              <span className="mx-2 text-muted-foreground">→</span>
              <span>Hochjoch Hospiz</span>
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
              value={`${ETAPPE8_DATA.distanceKm.toLocaleString("de-DE", { minimumFractionDigits: 1 })} km`}
            />
            <InfoCard
              icon={<TrendingUp size={22} />}
              label="Aufstieg"
              value={`+${ETAPPE8_DATA.ascentM.toLocaleString("de-DE")} m`}
            />
            <InfoCard
              icon={<TrendingDown size={22} />}
              label="Abstieg"
              value={`−${ETAPPE8_DATA.descentM.toLocaleString("de-DE")} m`}
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
                Etappe 8 · Vent → Hochjoch Hospiz
              </p>
              <dl className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-xs font-bold tracking-[0.12em] uppercase text-primary shrink-0 w-28 mb-0.5 sm:mb-0 pt-0.5">
                    Charakter
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">
                    Angenehme Etappe durchs wildromantische Rofental, immer am
                    Wasser entlang, moderater Aufstieg
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-xs font-bold tracking-[0.12em] uppercase text-primary shrink-0 w-28 mb-0.5 sm:mb-0 pt-0.5">
                    Highlight
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">
                    Rofenschlucht, Hängebrücke über die Rofenache, Blick auf
                    Weißkamm und Guslarspitzen
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-xs font-bold tracking-[0.12em] uppercase text-primary shrink-0 w-28 mb-0.5 sm:mb-0 pt-0.5">
                    Hinweis
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">
                    2 Nächte auf dem Hochjoch Hospiz (11.–13. August)
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
                        ETAPPE8_DATA.profile as unknown as {
                          d: number;
                          e: number;
                        }[]
                      }
                      distanceMax={ETAPPE8_DATA.distanceKm}
                      elevationDomain={[1600, 2600]}
                      gradientId="elevGradient8"
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
                    src="/assets/images/Etappe8.png"
                    alt="Routenkarte Etappe 8: Vent → Hochjoch Hospiz"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Photos & journal */}
          <StagePhotoSection
            stageId={8n}
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
