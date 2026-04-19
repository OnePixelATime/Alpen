import { Mountain, TrendingDown, TrendingUp } from "lucide-react";
import { HeroHeader } from "../components/HeroHeader";
import { StageCard } from "../components/StageCard";
import {
  TOUR_STAGES_DATA,
  TOUR_SUMMARY,
  TourElevationProfile,
} from "../components/TourElevationProfile";
import type { Stage } from "../types";

// Per-stage distance map for StageCard display
const STAGE_DISTANCES: Record<string, number> = {
  e1: 6.5,
  e2: 7.7,
  e3: 11.7,
  e4: 6.0,
  e5: 11.9,
  e6: 5.5,
  e7: 16.6,
  e8: 8.4,
  e9: 5.7,
  e10: 5.6,
  e11: 13.9,
  e12: 12.6,
};

const STAGES: Stage[] = [
  {
    id: "e1",
    number: 1,
    date: "04.08.",
    from: "Oberstdorf",
    to: "Kemptner Hütte",
  },
  {
    id: "e2",
    number: 2,
    date: "05.08.",
    from: "Kemptner Hütte",
    to: "Holzgau",
  },
  {
    id: "e3",
    number: 3,
    date: "06.08.",
    from: "Holzgau",
    to: "Ansbacher Hütte",
  },
  {
    id: "e4",
    number: 4,
    date: "07.08.",
    from: "Ansbacher Hütte",
    to: "Zams/Venet",
  },
  { id: "e5", number: 5, date: "08.08.", from: "Zams", to: "Wenns" },
  {
    id: "e6",
    number: 6,
    date: "09.08.",
    from: "Wenns",
    to: "Braunschweiger Hütte",
  },
  {
    id: "e7",
    number: 7,
    date: "10.08.",
    from: "Braunschweiger Hütte",
    to: "Vent",
  },
  { id: "e8", number: 8, date: "11.08.", from: "Vent", to: "Hochjoch Hospiz" },
  {
    id: "e9",
    number: 9,
    date: "12.08.",
    from: "Gipfeltag Guslarspitze",
    to: "",
    isSpecial: true,
  },
  {
    id: "e10",
    number: 10,
    date: "13.08.",
    from: "Hochjoch Hospiz",
    to: "Vernagthütte",
  },
  {
    id: "e11",
    number: 11,
    date: "14.08.",
    from: "Vernagthütte",
    to: "Schnals",
  },
  { id: "e12", number: 12, date: "15.08.", from: "Schnals", to: "Meran" },
];

export function HomePage() {
  const totalKm = Math.round(TOUR_SUMMARY.totalDistanceKm);

  const subtitle = `12 Etappen · Alpenüberquerung · ~${totalKm} km`;

  return (
    <div className="min-h-screen bg-background">
      <HeroHeader
        label="Wandertagebuch der Familie Schreiber"
        title="E5 · Oberstdorf → Meran · August 2026"
        subtitle={subtitle}
      />

      {/* Tour stats strip */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-0.5">
                Distanz
              </p>
              <p className="text-xl sm:text-2xl font-bold font-display text-foreground">
                {TOUR_SUMMARY.totalDistanceKm.toFixed(1)}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  km
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-0.5 flex items-center justify-center gap-1">
                <TrendingUp size={11} className="text-primary" />
                Aufstieg
              </p>
              <p className="text-xl sm:text-2xl font-bold font-display text-foreground">
                +{TOUR_SUMMARY.totalAscentM.toLocaleString("de-DE")}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  m
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-0.5 flex items-center justify-center gap-1">
                <TrendingDown size={11} className="text-primary" />
                Abstieg
              </p>
              <p className="text-xl sm:text-2xl font-bold font-display text-foreground">
                −{TOUR_SUMMARY.totalDescentM.toLocaleString("de-DE")}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  m
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stage grid section */}
      <main className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-5xl mx-auto">
          {/* Section label */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              Die Etappen
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
            data-ocid="stages-grid"
          >
            {STAGES.map((stage) => (
              <StageCard
                key={stage.id}
                stage={stage}
                distanceKm={STAGE_DISTANCES[stage.id]}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Total elevation profile section */}
      <section className="bg-muted/40 border-t border-border px-4 sm:px-6 lg:px-8 py-10 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-border" />
            <div className="flex items-center gap-2">
              <Mountain size={14} className="text-primary opacity-70" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                Gesamthöhenprofil
              </span>
            </div>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Chart card */}
          <div className="wood-texture relative rounded-xl bg-card border border-border overflow-hidden shadow-sm">
            <div className="h-1 w-full bg-primary opacity-70" />
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1 mb-4">
                <div>
                  <h3 className="text-lg font-bold font-display text-foreground leading-tight">
                    E5 Alpenüberquerung
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Oberstdorf → Meran · Etappen 1–{TOUR_STAGES_DATA.length} mit
                    GPX-Daten
                  </p>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Klick auf Abschnitt öffnet Etappe
                </p>
              </div>
              <TourElevationProfile />
            </div>
          </div>
        </div>
      </section>

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
