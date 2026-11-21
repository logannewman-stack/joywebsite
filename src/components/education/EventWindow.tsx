"use client";

import { useCallback, useId, useSyncExternalStore, type ReactNode } from "react";

/** Longest delay setTimeout accepts (about 24.8 days). */
const MAX_TIMEOUT = 2 ** 31 - 1;

/**
 * Shows the featured P3 event until it ends, then the interest-list fallback.
 * A past event must never keep its Register button, and the page is static,
 * so the switch happens in three places:
 * 1. The server decides `ended` from an hourly cached clock (see hasEnded).
 * 2. On a full page load, an inline script corrects older HTML before the
 *    browser paints it.
 * 3. In the browser the clock is read on every render (client-side
 *    navigations included) and once more at the moment the event ends.
 * Both versions are in the HTML; the inactive one carries `hidden`.
 */
export function EventWindow({
  endsAt,
  ended,
  live,
  fallback,
}: {
  /** End of the event's last day, in milliseconds since 1970 (eventEndsAt). */
  endsAt: number;
  /** The server's answer, used for the HTML and during hydration. */
  ended: boolean;
  live: ReactNode;
  fallback: ReactNode;
}) {
  const id = useId();
  const liveId = `${id}live`;
  const pastId = `${id}past`;

  const subscribe = useCallback(
    (notify: () => void) => {
      const wait = endsAt - Date.now();
      if (wait <= 0 || wait > MAX_TIMEOUT) return () => {};
      const timer = window.setTimeout(notify, wait);
      return () => window.clearTimeout(timer);
    },
    [endsAt],
  );
  const over = useSyncExternalStore(subscribe, () => Date.now() >= endsAt, () => ended);

  const fix = `(function(){if(Date.now()<${endsAt})return;var a=document.getElementById(${JSON.stringify(liveId)}),b=document.getElementById(${JSON.stringify(pastId)});if(a&&b){a.hidden=true;b.hidden=false}})()`;

  return (
    <>
      <div id={liveId} hidden={over} suppressHydrationWarning>
        {live}
      </div>
      <div id={pastId} hidden={!over} suppressHydrationWarning>
        {fallback}
      </div>
      {/* Runs while the HTML is parsed (full page loads). React renders it inert
          in the browser, where the clock check above takes over. */}
      <script
        type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: fix }}
      />
    </>
  );
}
