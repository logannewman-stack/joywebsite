import { site } from "@/content/site";
import { CURTAIN_SCRIPT } from "./script";
import { SIGNATURE_SCRIPT } from "./signature";

/**
 * The signature curtain: the site's opening titles. On every full page load
 * (first arrival and reload), a black curtain carries the cream script
 * wordmark, large and centred. It is signed, slowly, the line drawn as a pen
 * would write it (signature.ts); a gold hairline draws beneath it; and after
 * a beat the curtain lifts into the page (about seven seconds in all). Any
 * click, tap, key or scroll skips it.
 *
 * It is in the server HTML but shown only when the head script has put
 * `intro` on <html>: JavaScript on, reduced motion off, and a full load that
 * is not a Back/Forward return. Moving between pages inside the site never
 * shows it (those are not document loads), nor do reduced motion and
 * no-JavaScript. sessionStorage "dj-intro-off" = "1" switches it off for tooling
 * and tests. The page underneath renders and loads as usual, so the opening
 * photograph is painted at once behind it.
 *
 * Its timing is CSS (styles/chrome.css): animations that start with the
 * first paint. Two scripts follow the markup: the first builds the pieces of
 * the signature, the second shortens the opening for a page that arrived
 * late, lets the visitor skip it, and clears up when it ends.
 */
export function Curtain() {
  const src = site.wordmark.onDark;
  return (
    <>
      <div className="intro-curtain" aria-hidden="true">
        {src && (
          <div className="intro-stage">
            <div className="intro-sign">
              {/* The signature. .intro-ink is filled by SIGNATURE_SCRIPT with the pieces that write it
                  (its contents are declared as raw HTML so React leaves what the script put there alone);
                  .intro-mark is the whole wordmark, shown only if the pieces could not be made. Both show
                  the artwork held in chrome.css, so nothing here waits on a request. */}
              <span className="intro-pen">
                <span className="intro-ink" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: "" }} />
                <span className="intro-mark" />
              </span>
              <span className="intro-rule" />
            </div>
          </div>
        )}
      </div>
      <script dangerouslySetInnerHTML={{ __html: SIGNATURE_SCRIPT }} />
      <script dangerouslySetInnerHTML={{ __html: CURTAIN_SCRIPT }} />
    </>
  );
}
