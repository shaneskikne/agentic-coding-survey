import { SurveyForm } from "./survey-form";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[640px] px-5 py-12 sm:px-8 sm:py-20">
      <header className="mb-12 sm:mb-16">
        <div className="mb-5 text-xs uppercase tracking-[0.18em] text-zinc-500">
          Feedback
        </div>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
          Post-session reflection
        </h1>
        <p className="mt-3 max-w-md text-base leading-relaxed text-zinc-600">
          A few questions about today&apos;s agentic coding session. Takes about
          two minutes — your answers go straight to the organizer.
        </p>
      </header>
      <SurveyForm />
      <footer className="mt-16 border-t border-zinc-200 pt-6 text-xs text-zinc-500">
        Anonymous unless you tell us otherwise.
      </footer>
    </main>
  );
}
