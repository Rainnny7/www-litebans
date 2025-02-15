import umami from "@umami/node";
import { env, isProd, isUsingAnalytics } from "~/env";

/**
 * Cache the umami instance in development. This
 * avoids creating a new instance on every HMR update.
 */
const globalForUmami = globalThis as unknown as {
    initialized: boolean;
};

if (isUsingAnalytics && !globalForUmami.initialized) {
    globalForUmami.initialized = true;
    umami.init({
        hostUrl: env.ANALYTICS_HOST,
        websiteId: env.ANALYTICS_ID,
    });
}

/**
 * Track the record fetch event.
 *
 * @param category The category of the records fetched.
 */
export const trackRecordFetch = (category: string) => {
    if (isProd && isUsingAnalytics) {
        umami.track(`${category} Records Fetched`);
    }
};
