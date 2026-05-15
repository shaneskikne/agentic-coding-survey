"use client";

import { FormEvent, useState } from "react";

const SCALE = [1, 2, 3, 4, 5] as const;

type FormState = {
  rating: number | null;
  enjoyed: string;
  improved: string;
  other: string;
};

const INITIAL: FormState = {
  rating: null,
  enjoyed: "",
  improved: "",
  other: "",
};

export function SurveyForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isValid = form.rating !== null;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid || status === "submitting") return;
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
          subject: "Agentic coding session — survey response",
          from_name: "Agentic Coding Survey",
          rating: form.rating,
          enjoyed: form.enjoyed.trim() || "(not answered)",
          could_be_better: form.improved.trim() || "(not answered)",
          other_thoughts: form.other.trim() || "(not answered)",
        }),
      });

      const data = (await res.json()) as { success: boolean; message?: string };
      if (!data.success) {
        throw new Error(data.message ?? "Submission failed.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rise rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-9 shadow-[0_1px_2px_rgba(15,27,48,0.04),0_24px_48px_-24px_rgba(31,90,224,0.18)] sm:p-12">
        <div className="mb-5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-accent-deep)]">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
          />
          Received
        </div>
        <h2 className="font-serif text-[34px] leading-[1.1] tracking-tight text-[var(--color-ink)] sm:text-[40px]">
          Thank you.
        </h2>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
          Your reflection is on its way to the organizer. Close this tab, or{" "}
          <button
            type="button"
            onClick={() => {
              setForm(INITIAL);
              setStatus("idle");
            }}
            className="font-medium text-[var(--color-accent)] underline decoration-[var(--color-accent-soft)] decoration-2 underline-offset-4 transition hover:decoration-[var(--color-accent)]"
          >
            submit another response
          </button>
          .
        </p>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={onSubmit} className="space-y-7 sm:space-y-9">
      <Card index={1} label="Rate your experience" required>
        <Scale
          value={form.rating}
          onChange={(v) => setForm({ ...form, rating: v })}
          lowLabel="Not for me"
          highLabel="Loved it"
        />
      </Card>

      <Card index={2} label="What's one thing you really enjoyed?">
        <TextArea
          value={form.enjoyed}
          onChange={(v) => setForm({ ...form, enjoyed: v })}
          placeholder="A moment, an idea, a tool — whatever stuck."
          rows={3}
        />
      </Card>

      <Card index={3} label="What's one thing that could have been better?">
        <TextArea
          value={form.improved}
          onChange={(v) => setForm({ ...form, improved: v })}
          placeholder="Be candid — friction, pacing, gaps."
          rows={3}
        />
      </Card>

      <Card index={4} label="Any other thoughts?">
        <TextArea
          value={form.other}
          onChange={(v) => setForm({ ...form, other: v })}
          placeholder="Optional. The floor is yours."
          rows={4}
        />
      </Card>

      {status === "error" && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900"
        >
          {errorMsg}
        </div>
      )}

      <div className="rise pt-2" style={{ animationDelay: "200ms" }}>
        <button
          type="submit"
          disabled={!isValid || submitting}
          className="group relative w-full overflow-hidden rounded-xl bg-[var(--color-accent)] px-6 py-4 text-[15px] font-medium tracking-tight text-white shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_8px_24px_-8px_rgba(31,90,224,0.55)] transition-all hover:bg-[var(--color-accent-deep)] hover:shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_12px_32px_-8px_rgba(31,90,224,0.7)] active:translate-y-[1px] disabled:cursor-not-allowed disabled:bg-[var(--color-ink-light)] disabled:shadow-none"
        >
          <span className="relative z-10 inline-flex items-center justify-center gap-2">
            {submitting ? (
              <>
                <Spinner />
                Sending
              </>
            ) : (
              <>
                Send reflection
                <Arrow />
              </>
            )}
          </span>
        </button>
        {!isValid && (
          <p className="mt-3 text-center text-[12px] text-[var(--color-ink-mute)]">
            Pick a rating to send.
          </p>
        )}
      </div>
    </form>
  );
}

function Card({
  index,
  label,
  required,
  children,
}: {
  index: number;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <fieldset
      className="rise rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 shadow-[0_1px_2px_rgba(15,27,48,0.03)] transition-shadow focus-within:shadow-[0_1px_2px_rgba(15,27,48,0.03),0_12px_32px_-16px_rgba(31,90,224,0.25)] sm:p-7"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="mb-5 flex items-baseline gap-3">
        <span className="font-serif text-[15px] italic text-[var(--color-accent)]">
          {String(index).padStart(2, "0")}
        </span>
        <legend className="text-[15px] font-medium leading-snug text-[var(--color-ink)] sm:text-[16px]">
          {label}
          {required && (
            <span
              aria-hidden
              className="ml-1 text-[var(--color-accent)]"
              title="Required"
            >
              *
            </span>
          )}
        </legend>
      </div>
      {children}
    </fieldset>
  );
}

function Scale({
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  value: number | null;
  onChange: (v: number) => void;
  lowLabel: string;
  highLabel: string;
}) {
  return (
    <div>
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {SCALE.map((n) => {
          const selected = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-pressed={selected}
              aria-label={`Rate ${n} out of 5`}
              className={[
                "focus-ring relative h-14 rounded-xl border text-[17px] font-medium tabular-nums transition-all sm:h-16 sm:text-[18px]",
                selected
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white shadow-[0_8px_20px_-8px_rgba(31,90,224,0.55)]"
                  : "border-[var(--color-line)] bg-white text-[var(--color-ink-soft)] hover:-translate-y-px hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-tint)] hover:text-[var(--color-accent-deep)]",
              ].join(" ")}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex justify-between text-[12px] text-[var(--color-ink-mute)]">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows ?? 3}
      className="focus-ring w-full resize-y rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas-deep)]/40 px-4 py-3 text-[15px] leading-relaxed text-[var(--color-ink)] placeholder:text-[var(--color-ink-light)] transition-colors hover:border-[var(--color-ink-light)] focus:border-[var(--color-accent)] focus:bg-white"
    />
  );
}

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="animate-spin"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="2"
      />
      <path
        d="M14 8a6 6 0 0 0-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className="transition-transform group-hover:translate-x-0.5"
    >
      <path
        d="M2 7h10M8 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
