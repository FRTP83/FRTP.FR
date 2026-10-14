"use client";

import { useEffect } from "react";

/** Signal only after React has hydrated the public page. */
export function StudioPreviewReady() {
  useEffect(() => {
    if (window.parent === window || !new URLSearchParams(window.location.search).has("studioPreview")) return;
    document.documentElement.dataset.studioHydrated = "true";
    window.parent.postMessage({ type: "frtp:preview-ready" }, window.location.origin);
  }, []);
  return null;
}
