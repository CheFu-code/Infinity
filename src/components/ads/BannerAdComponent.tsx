import { Platform } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import * as Sentry from "@sentry/react-native";

const BANNER_AD_UNIT_ID = "ca-app-pub-8952058057579255/7287204281";

export function BannerAdComponent() {
    if (Platform.OS !== "android") {
        return null;
    }

    return (
        <BannerAd
            unitId={BANNER_AD_UNIT_ID}
            size={BannerAdSize.LARGE_ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
                requestNonPersonalizedAdsOnly: true,
            }}
            onAdFailedToLoad={(error) => {
                Sentry.captureException(error, {
                    extra: {
                        context: "Banner ad failed to load",
                    },
                });
            }}
        />
    );
}
