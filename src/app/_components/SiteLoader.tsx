"use client";

import { useEffect, useState } from "react";

const LOADER_KEY = "savehxpe-loader-seen-v1";
const MIN_VISIBLE_MS = 2300;
const MAX_VISIBLE_MS = 3100;
const EXIT_MS = 320;

export default function SiteLoader() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    try {
      if (sessionStorage.getItem(LOADER_KEY) === "1") {
        setVisible(false);
        return;
      }
    } catch {
      // Ignore storage failures.
    }

    if (reducedMotion) {
      setVisible(false);

      try {
        sessionStorage.setItem(LOADER_KEY, "1");
      } catch {
        // Ignore storage failures.
      }

      document.documentElement.dataset.loaderSeen = "1";
      return;
    }

    const body = document.body;
    const html = document.documentElement;
    const start = performance.now();
    let exitTimer = 0;
    let hardTimer = 0;
    let finished = false;

    const finish = () => {
      if (finished) {
        return;
      }

      finished = true;
      setExiting(true);
      exitTimer = window.setTimeout(() => {
        setVisible(false);
        body.classList.remove("loader-active");
        html.classList.remove("loader-active");
        html.dataset.loaderSeen = "1";

        window.clearTimeout(hardTimer);

        try {
          sessionStorage.setItem(LOADER_KEY, "1");
        } catch {
          // Ignore storage failures.
        }
      }, EXIT_MS);
    };

    const scheduleFinish = () => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(MIN_VISIBLE_MS - elapsed, 0);
      window.setTimeout(finish, remaining);
    };

    const onLoad = () => {
      scheduleFinish();
    };

    body.classList.add("loader-active");
    html.classList.add("loader-active");
    html.dataset.loaderSeen = "0";

    if (document.readyState === "complete") {
      scheduleFinish();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    hardTimer = window.setTimeout(finish, MAX_VISIBLE_MS);

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(exitTimer);
      window.clearTimeout(hardTimer);
      body.classList.remove("loader-active");
      html.classList.remove("loader-active");
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      aria-label="Loading saveHXPE"
      aria-live="polite"
      role="status"
      className={`site-loader ${exiting ? "is-exiting" : ""}`}
    >
      <div className="site-loader__panel">
        <div className="site-loader__halo" aria-hidden="true">
          <span />
          <span />
        </div>
        <div className="site-loader__eyebrow">GAME BOOT</div>
        <div className="site-loader__wordmark">
          <span className="site-loader__dot" aria-hidden="true" />
          <span className="site-loader__brand">saveHXPE / Outworld</span>
        </div>
        <div className="site-loader__copy">
          <span className="site-loader__title">Initializing the scene</span>
          <span className="site-loader__subtitle">Preparing assets, audio, and stage data</span>
        </div>
        <div className="site-loader__line" aria-hidden="true">
          <span />
          <span />
        </div>
        <div className="site-loader__meta" aria-hidden="true">
          <span>Assets ready</span>
          <span>Scene sync</span>
        </div>
      </div>
    </div>
  );
}
