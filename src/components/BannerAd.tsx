import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from '../utils/admob';

interface BannerAdComponentProps {
  isDark?: boolean;
}

/**
 * BannerAd component that displays an AdMob banner ad at the bottom of the screen
 */
export function Banner({ isDark }: BannerAdComponentProps) {
  return (
    <View
      style={[
        styles.container,
        isDark ? styles.darkBackground : styles.lightBackground,
      ]}
    >
      <BannerAd
        unitId={AD_UNIT_IDS.banner}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={(error) => {
          console.warn('Banner ad failed to load:', error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    minHeight: 50,
  },
  darkBackground: {
    backgroundColor: '#1f2937',
  },
  lightBackground: {
    backgroundColor: '#f3f4f6',
  },
});
