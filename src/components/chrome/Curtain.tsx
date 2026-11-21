import { site } from "@/content/site";
import { CURTAIN_SCRIPT } from "./script";

/**
 * The first-visit signature. On the first page of a visit, a black curtain
 * carries the cream script wordmark, which writes itself in from left to
 * right; then the curtain lifts into the page (about 1.3 seconds in all).
 *
 * It is in the server HTML but shown only when the head script has put
 * `intro` on <html>: JavaScript on, reduced motion off, and no page seen yet
 * in this visit (sessionStorage). Later pages, reloads, reduced motion and
 * no-JavaScript never see it. The page underneath renders and loads as
 * usual, so the opening photograph is painted at once behind it.
 */
export function Curtain() {
  const src = site.wordmark.onDark;
  return (
    <>
      <div className="intro-curtain" aria-hidden="true">
        {src && (
          // A plain <img>: the same file as the header's dark wordmark, so it costs no extra request.
          // eslint-disable-next-line @next/next/no-img-element
          <img className="intro-mark" src={src} alt="" width={site.wordmark.width} height={site.wordmark.height} decoding="sync" />
        )}
      </div>
      <script dangerouslySetInnerHTML={{ __html: CURTAIN_SCRIPT }} />
    </>
  );
}
