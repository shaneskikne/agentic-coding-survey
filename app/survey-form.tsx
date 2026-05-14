"use client";

import { FormEvent, useState } from "react";

const ROLES = [
  "Engineer",
  "PM",
  "Designer",
  "Leadership",
  "Student",
  "Other",
] as const;

const EXPERIENCE = ["None", "Some", "Regular user"] as const;
const PACE = ["Too slow", "Just right", "Too fast"] as const;
const SCALE = [1, 2, 3, 4, 5] as const;

type FormState = {
  role: string;
  experience: string;
  rating: number | null;
  pace: string;
  mostValuable: string;
  improvements: string;
  likelihood: number | null;
  other: string;
};

const INITIAL: FormState = {
  role: "",
  experience: "",
  rating: null,
  pace: "",
  mostValuable: "",
  improvements: "",
  likelihood: null,
  other: "",
};

export function SurveyForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isValid =
    form.role !== "" && form.experience !== "" && form.rating !== null;

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
          role: form.role,
          experience: form.experience,
          rating: form.rating,
          pace: form.pace || "(not answered)",
          most_valuable: form.mostValuable || "(not answered)",
          improvements: form.improvements || "(not answered)",
          likelihood: form.likelihood ?? "(not answered)",
          other: form.other || "(not answered)",
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
      <div className="rounded-lg border border-zinc-200 bg-white p-8 sm:p-10">
        <div className="mb-4 text-xs uppercase tracking-[0.18em] text-emerald-700">
          Submitted
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Thanks — your feedback&apos;s on its way.
        </h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-600">
          The organizer will read every response. Close this tab, or{" "}
          <button
            type="button"
            onClick={() => {
              setForm(INITIAL);
              setStatus("idle");
            }}
            className="underline underline-offset-2 hover:text-zinc-900"
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
    <form onSubmit={onSubmit} className="space-y-12">
      <Question
        number={1}
        label="Your role"
        required
      >
        <RadioGroup
          name="role"
          options={ROLES}
          value={form.role}
          onChange={(v) => setForm({ ...form, role: v })}
        />
      </Question>

      <Question
        number={2}
        label="Prior experience with agentic coding tools"
        required
      >
        <RadioGroup
          name="experience"
          options={EXPERIENCE}
          value={form.experience}
          onChange={(v) => setForm({ ...form, experience: v })}
        />
      </Question>

      <Question
        number={3}
        label="Overall session rating"
        required
        helper="1 = poor, 5 = excellent"
      >
        <Scale
          value={form.rating}
          onChange={(v) => setForm({ ...form, rating: v })}
          lowLabel="Poor"
          highLabel="Excellent"
        />
      </Question>

      <Question number={4} label="Pace was">
        <RadioGroup
          name="pace"
          options={PACE}
          value={form.pace}
          onChange={(v) => setForm({ ...form, pace: v })}
        />
      </Question>

      <Question number={5} label="Most valuable part">
        <TextInput
          value={form.mostValuable}
          onChange={(v) => setForm({ ...form, mostValuable: v })}
          placeholder="What stuck with you?"
        />
      </Question>

      <Question number={6} label="What was unclear or could improve">
        <TextInput
          value={form.improvements}
          onChange={(v) => setForm({ ...form, improvements: v })}
          placeholder="Anything that fell flat or felt rushed"
        />
      </Question>

      <Question
        number={7}
        label="Likelihood to use agentic coding in your work"
        helper="1 = unlikely, 5 = very likely"
      >
        <Scale
          value={form.likelihood}
          onChange={(v) => setForm({ ...form, likelihood: v })}
          lowLabel="Unlikely"
          highLabel="Very likely"
        />
      </Question>

      <Question number={8} label="Anything else?">
        <TextArea
          value={form.other}
          onChange={(v) => setForm({ ...form, other: v })}
          placeholder="Open mic — share whatever you&apos;d like."
        />
      </Question>

      {status === "error" && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {errorMsg}
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={!isValid || submitting}
          className="w-full rounded-md bg-zinc-900 px-5 py-3.5 text-base font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          {submitting ? "Sending…" : "Submit feedback"}
        </button>
        {!isValid && (
          <p className="mt-3 text-xs text-zinc-500">
            Answer questions 1, 2, and 3 to submit.
          </p>
        )}
      </div>
    </form>
  );
}

function Question({
  number,
  label,
  required,
  helper,
  children,
}: {
  number: number;
  label: string;
  required?: boolean;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <div className="mb-4 flex items-baseline gap-3">
        <span className="text-xs font-mono tabular-nums text-zinc-400">
          {String(number).padStart(2, "0")}
        </span>
        <legend className="text-base font-medium text-zinc-900">
          {label}
          {required && (
            <span aria-hidden className="ml-1 text-zinc-400">
              *
            </span>
          )}
        </legend>
      </div>
      {helper && (
        <p className="mb-3 pl-8 text-xs text-zinc-500">{helper}</p>
      )}
      <div className="pl-8">{children}</div>
    </fieldset>
  );
}

function RadioGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <label
            key={opt}
            className={[
              "flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm transition",
              selected
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400",
            ].join(" ")}
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={selected}
              onChange={() => onChange(opt)}
              className="sr-only"
            />
            <span
              aria-hidden
              className={[
                "h-3.5 w-3.5 rounded-full border-2",
                selected ? "border-white" : "border-zinc-300",
              ].join(" ")}
            />
            {opt}
          </label>
        );
      })}
    </div>
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
      <div className="flex gap-2">
        {SCALE.map((n) => {
          const selected = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={[
                "flex-1 rounded-md border py-3 text-sm font-medium tabular-nums transition",
                selected
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400",
              ].join(" ")}
              aria-pressed={selected}
              aria-label={`${n} out of 5`}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-xs text-zinc-500">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className="w-full resize-y rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
    />
  );
}
