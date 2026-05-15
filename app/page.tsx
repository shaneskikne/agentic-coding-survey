import { SurveyForm } from "./survey-form";

export default function Home() {
  return (
    <main className="relative mx-auto w-full max-w-[640px] px-5 py-14 sm:px-8 sm:py-24">
      <BackgroundDecor />
      <header className="rise relative mb-10 sm:mb-14">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent-deep)] backdrop-blur">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
          />
          Post-session
        </div>
        <h1 className="font-serif text-[42px] leading-[1.05] tracking-tight text-[var(--color-ink)] sm:text-[56px]">
          How did the{" "}
          <span className="italic text-[var(--color-accent)]">
            agentic coding
          </span>{" "}
          session land?
        </h1>
        <p className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-[var(--color-ink-soft)] sm:text-[16px]">
          Four quick questions. Takes about a minute. Your answers go straight
          to the organizer.
        </p>
      </header>
      <SurveyForm />
      <footer
        className="rise mt-14 flex items-center justify-between border-t border-[var(--color-line-soft)] pt-6 text-[12px] text-[var(--color-ink-mute)]"
        style={{ animationDelay: "400ms" }}
      >
        <span>Anonymous unless you say otherwise.</span>
        <span className="font-serif italic text-[var(--color-ink-light)]">
          fin.
        </span>
      </footer>
    </main>
  );
}

function BackgroundDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -left-32 top-32 h-72 w-72 rounded-full bg-[var(--color-accent-soft)] opacity-60 blur-[100px]" />
      <div className="absolute -right-24 top-[55%] h-80 w-80 rounded-full bg-[#CFE0FB] opacity-50 blur-[120px]" />
    </div>
  );
}
