"use client";

import dynamic from "next/dynamic";

// Dynamically load the feedback launcher on the client only
const FeedbackLauncher = dynamic(() => import("./FeedbackLauncher"), { ssr: false });

export default function FeedbackLoader() {
  const flag = (process.env.NEXT_PUBLIC_ENABLE_FEEDBACK || "").toLowerCase();
  const enabled = flag === "1" || flag === "true";

  if (!enabled) return null;
  return (
    <FeedbackLauncher />
  );
}
