"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type Payload = {
  category: string;
  message: string;
  email?: string;
  page: string;
  userAgent?: string;
  consent: boolean;
  website?: string; // honeypot
};

const CATEGORIES = ["Idea", "Bug", "Content", "Other"] as const;

export default function FeedbackLauncher() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [error, setError] = useState<string | null>(null);
  const [showNudge, setShowNudge] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const confettiRef = useRef<HTMLCanvasElement | null>(null);

  const pathname = usePathname();
  const search = useSearchParams();
  const page = useMemo(
    () => (search?.toString() ? `${pathname}?${search}` : pathname) ?? "/",
    [pathname, search]
  );

  const [payload, setPayload] = useState<Payload>({
    category: "Idea",
    message: "",
    email: "",
    page,
    userAgent: "",
    consent: false,
    website: "",
  });

  // Prefill email once (and persist user’s change)
  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //   const saved = localStorage.getItem("feedback_email");
  //   setPayload((p) => ({ ...p, email: saved || "daniele.moltisanti@skytv.it" }));
  // }, []);
  // useEffect(() => {
  //   if (payload.email) localStorage.setItem("feedback_email", payload.email);
  // }, [payload.email]);

  // Nudge dot (shows until first open)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem("feedback_seen");
    setShowNudge(!seen);
  }, []);
  useEffect(() => {
    if (open && typeof window !== "undefined") {
      localStorage.setItem("feedback_seen", "1");
      setShowNudge(false);
    }
  }, [open]);

  // Track open
  useEffect(() => {
    if (open) window.gtag?.("event", "feedback_open", { page });
  }, [open, page]);

  // Keep page + UA updated
  useEffect(() => setPayload((p) => ({ ...p, page })), [page]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPayload((p) => ({ ...p, userAgent: navigator.userAgent }));
    }
  }, []);

  // Keyboard shortcut: F to open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "f" && !open) setOpen(true);
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Tiny confetti burst
  function confetti() {
    const canvas = confettiRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = (canvas.width = window.innerWidth);
    const H = (canvas.height = window.innerHeight);
    const parts = Array.from({ length: 90 }, () => ({
      x: Math.random() * W,
      y: -20,
      r: 2 + Math.random() * 4,
      vx: -2 + Math.random() * 4,
      vy: 2 + Math.random() * 4,
      a: 0.6 + Math.random() * 0.4,
    }));
    let t = 0;
    const anim = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      parts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
      });
      t++;
      if (t < 80) requestAnimationFrame(anim);
      else ctx.clearRect(0, 0, W, H);
    };
    anim();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setOk(null);

    if (!payload.message || payload.message.trim().length < 6) {
      setError("Please add a few more words 🙂");
      setBusy(false);
      return;
    }
    if (!payload.consent) {
      setError("Please accept the consent.");
      setBusy(false);
      return;
    }

    window.gtag?.("event", "feedback_submit", {
      page,
      category: payload.category,
    });

    try {
    const res = await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setOk(res.ok);
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Unknown error");
      }
      setPayload((p) => ({ ...p, message: "" }));
      confetti();
      setTimeout(() => setOpen(false), 900);
    } catch (err: any) {
      setError(err?.message || "Network error");
      setOk(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setOpen(true)}
  className="fixed right-[calc(env(safe-area-inset-right,20px)+8px)] bottom-[calc(env(safe-area-inset-bottom,20px)+20px)] z-[60]
       group flex items-center gap-2 rounded-full px-6 py-3
       text-sm font-medium text-white shadow-xl
       bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600
       hover:from-fuchsia-500 hover:to-indigo-500
       focus:outline-none focus:ring-2 focus:ring-white/40
       [@media(prefers-reduced-motion:no-preference)]:animate-pulse"
        aria-label="Open feedback"
      >
        <span className="text-lg">💬</span>
        <span className="hidden sm:block">Feedback</span>
        {showNudge && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
        )}
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Send feedback"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={() => setOpen(false)} />

          {/* Success confetti layer */}
          <canvas ref={confettiRef} className="pointer-events-none absolute inset-0" />

          {/* Panel */}
          <div className="relative w-full sm:max-w-lg sm:rounded-2xl sm:shadow-2xl bg-neutral-900 text-neutral-50 p-0 m-0 sm:m-4 overflow-hidden">
            {/* Gradient header */}
            <div className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 px-5 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold tracking-wide">Tell us what you think</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-1 hover:bg-white/10 focus:outline-none focus:ring focus:ring-white/30"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs mt-1 opacity-90">
                Press <kbd className="px-1 rounded bg-black/20">F</kbd> anytime to open this panel.
              </p>
            </div>

            <form onSubmit={submit} className="p-5 space-y-4">
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                autoComplete="off"
                tabIndex={-1}
                value={payload.website}
                onChange={(e) => setPayload((p) => ({ ...p, website: e.target.value }))}
                className="hidden"
              />

              {/* Category chips */}
              <fieldset>
                <legend className="text-xs mb-2 opacity-80">Type</legend>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => {
                    const active = payload.category === c;
                    return (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setPayload((p) => ({ ...p, category: c }))}
                        className={`px-3 py-1.5 rounded-full text-xs border
                          ${active
                            ? "bg-white text-black border-white"
                            : "bg-neutral-800 border-white/15 hover:bg-neutral-700"}`}
                        aria-pressed={active}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Message */}
              <label className="text-sm block">
                Your message
                <textarea
                  required
                  rows={5}
                  placeholder="Be specific: what should we improve or what worked well?"
                  value={payload.message}
                  onChange={(e) => {
                    setPayload((p) => ({ ...p, message: e.target.value }));
                    setCharCount(e.target.value.length);
                  }}
                  className="mt-1 w-full rounded-xl bg-neutral-800 border border-white/10 px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </label>
              <div className="flex items-center justify-between text-xs opacity-70">
                <span>Page: {payload.page}</span>
                <span>{charCount} chars</span>
              </div>

              {/* Email + Consent */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="text-sm">
                  Email (optional)
                  <input
                    type="email"
                    inputMode="email"
                    placeholder="we’ll reach out if needed"
                    value={payload.email}
                    onChange={(e) => setPayload((p) => ({ ...p, email: e.target.value }))}
                    className="mt-1 w-full rounded-xl bg-neutral-800 border border-white/10 px-3 py-2 text-sm
                               focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </label>

                <label className="flex items-start gap-2 text-xs opacity-80 pt-6">
                  <input
                    id="consent"
                    type="checkbox"
                    checked={payload.consent}
                    onChange={(e) => setPayload((p) => ({ ...p, consent: e.target.checked }))}
                    className="mt-1"
                    required
                  />
                  <span>I agree this feedback may be used to improve the site.</span>
                </label>
              </div>

              {/* Alerts */}
              {error && <p className="text-red-300 text-sm" role="alert">{error}</p>}
              {ok && <p className="text-green-300 text-sm" role="status">Thanks! Sent ✅</p>}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-2 bg-white/10 hover:bg-white/15"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-xl px-4 py-2 bg-white text-black hover:bg-white/90 disabled:opacity-60"
                >
                  {busy ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
