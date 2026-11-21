import { cacheLife } from "next/cache";

/**
 * Whether a featured event has ended, decided on the server.
 *
 * The page is prerendered, so a plain date comparison would freeze at build
 * time. Reading the clock inside "use cache" with an hourly lifetime makes the
 * prerendered page re-check in the background, so its HTML switches to the
 * interest list within about an hour of the event ending, with no redeploy.
 * Browsers never wait for that: EventWindow corrects an older copy before it
 * paints.
 */
export async function hasEnded(endsAt: number): Promise<boolean> {
  "use cache";
  cacheLife("hours");
  return Date.now() >= endsAt;
}
