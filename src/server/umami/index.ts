import umami from "@umami/node";
import { env, isUsingAnalytics } from "~/env";

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

export const trackRecordFetch = (category: string) => {
    if (isUsingAnalytics) {
        umami.track("Record Fetch", {
            category,
        });
    }
};
