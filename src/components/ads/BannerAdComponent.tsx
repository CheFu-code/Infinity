import { View, StyleSheet, Platform } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

const BANNER_AD_UNIT_ID = "ca-app-pub-8952058057579255/7287204281";

export function BannerAdComponent() {
    if (Platform.OS !== "android") {
        return null;
    }

    return (
        <View style={styles.container}>
            <BannerAd
                unitId={BANNER_AD_UNIT_ID}
                size={BannerAdSize.LARGE_ANCHORED_ADAPTIVE_BANNER}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
                onAdFailedToLoad={(error) => {
                    console.log("Banner failed to load:", error);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        width: "100%",
    },
});
