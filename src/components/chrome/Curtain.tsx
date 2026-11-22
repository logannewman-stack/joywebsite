import { site } from "@/content/site";
import { CURTAIN_SCRIPT } from "./script";

/**
 * The signature curtain: the site's opening titles. On every full page load
 * (first arrival and reload), a black curtain carries the cream script
 * wordmark, large and centred. It is signed, slowly; a gold hairline draws
 * beneath it; and after a beat the curtain lifts into the page (under six
 * seconds in all). Any click, tap, key or scroll skips it.
 *
 * It is in the server HTML but shown only when the head script has put
 * `intro` on <html>: JavaScript on, reduced motion off, and a full load that
 * is not a Back/Forward return. Moving between pages inside the site never
 * shows it (those are not document loads), nor do reduced motion and
 * no-JavaScript. sessionStorage "dj-intro" = "1" switches it off for tooling
 * and tests. The page underneath renders and loads as usual, so the opening
 * photograph is painted at once behind it.
 *
 * Its timing is CSS (styles/chrome.css): animations that start with the
 * first paint. The script after the markup only shortens it for a page that
 * arrived late, lets the visitor skip it, and clears up when it ends.
 */
export function Curtain() {
  const src = site.wordmark.onDark;
  return (
    <>
      <div className="intro-curtain" aria-hidden="true">
        {src && (
          <div className="intro-stage">
            <div className="intro-sign">
              {/* .intro-pen carries the ink cover that writes the signature in. */}
              <span className="intro-pen">
                {/* A plain <img>: the same file as the header's dark wordmark, so it costs no extra request.
                    It is asked for first: the signing starts with the first paint and does not wait for it. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="intro-mark" src={src} alt="" width={site.wordmark.width} height={site.wordmark.height} decoding="sync" fetchPriority="high" />
              </span>
              <span className="intro-rule" />
            </div>
          </div>
        )}
      </div>
      <script dangerouslySetInnerHTML={{ __html: CURTAIN_SCRIPT }} />
    </>
  );
}
