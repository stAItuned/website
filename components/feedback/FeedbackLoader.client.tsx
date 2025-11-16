"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically load the feedback launcher on the client only
const FeedbackLauncher = dynamic(() => import("./FeedbackLauncher"), { ssr: false });

export default function FeedbackLoader() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const flag = (process.env.NEXT_PUBLIC_ENABLE_FEEDBACK || "").toLowerCase();
    setEnabled(flag === "1" || flag === "true");
  }, []);

  if (!enabled) return null;
  return (
    <FeedbackLauncher />
  );
}
