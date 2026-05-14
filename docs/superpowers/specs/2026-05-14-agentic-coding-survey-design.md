# Agentic Coding Post-Session Survey — Design

**Date:** 2026-05-14
**Status:** Approved

## Purpose

A single-page web survey participants fill out after attending a session on agentic coding (workshop, talk, hackathon, etc.). Responses are routed to the organizer's inbox via Web3Forms.

## User flow

1. Participant opens the URL on phone or laptop.
2. Sees the 8-question survey, no login required.
3. Fills in answers (most fields optional, role + rating required).
4. Hits Submit → POST to `https://api.web3forms.com/submit`.
5. Inline success state replaces the form with a thank-you message.
6. On error, an inline error appears above the submit button with a Retry affordance.

## Survey questions

| # | Question | Field type | Required |
|---|---|---|---|
| 1 | Your role | Radio (Engineer / PM / Designer / Leadership / Student / Other) | Yes |
| 2 | Prior experience with agentic coding tools | Radio (None / Some / Regular user) | Yes |
| 3 | Overall session rating | 1–5 button group | Yes |
| 4 | Pace was | Radio (Too slow / Just right / Too fast) | No |
| 5 | Most valuable part | Short text | No |
| 6 | What was unclear or could improve | Short text | No |
| 7 | Likelihood to use agentic coding in your work | 1–5 button group | No |
| 8 | Anything else? | Long text | No |

## Architecture

- **Next.js 16 App Router**, TypeScript, Tailwind v4.
- Single route: `app/page.tsx` — server component shell that renders a client `<SurveyForm />`.
- `app/survey-form.tsx` — `'use client'` component holding form state via `useState`, owns submission via `fetch`.
- No backend route needed — Web3Forms handles delivery.

## Web3Forms integration

- Access key stored as `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` (Web3Forms keys are designed to be client-side; spam protection is on their side).
- POST body: `{ access_key, subject, from_name, ...all answers }` as JSON to `https://api.web3forms.com/submit`.
- Subject line: "Agentic coding session — survey response".

## Visual design

- Light single-column layout, max-width ~640px on desktop, full-width with padding on mobile.
- System font stack (Geist Sans from default scaffold).
- Generous vertical rhythm. Question label above input. Required indicator subtle.
- Submit button: full-width, dark, prominent.
- Success state: short thank-you headline + paragraph + reset link.

## Out of scope

- Multi-step / paginated form (single page is fine for 8 questions).
- Authentication or response viewing UI (responses land in inbox via Web3Forms).
- Storing responses in our own DB.
- Analytics.

## Verification

- Local dev: load at `localhost:3000`, fill, submit, confirm success state.
- Playwright tests at 1280×800 (desktop) and 375×667 (mobile) capturing screenshots of empty form, filled form, and success state.
- Deployed URL gets the same Playwright pass.
