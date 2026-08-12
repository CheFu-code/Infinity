import { Platform } from 'react-native';
import GoogleMobileAds from 'react-native-google-mobile-ads';

// Test Ad Unit IDs (replace with your real Ad Unit IDs in production)
const TEST_AD_UNIT_IDS = {
    banner: 'ca-app-pub-3940256099942544/6300978111',
    rewarded: 'ca-app-pub-3940256099942544/5224354917',
};

// Your actual Ad Unit IDs - REPLACE THESE WITH YOUR REAL IDs FROM ADMOB
// Get your Ad Unit IDs from: https://admob.google.com
// Steps:
// 1. Sign up for AdMob (https://admob.google.com)
// 2. Create an app
// 3. Create Ad Units for banner and rewarded ads
// 4. Copy the Ad Unit IDs and replace the empty strings below
const PRODUCTION_AD_UNIT_IDS = {
    banner: Platform.select({
        ios: '', // Add your iOS banner ad unit ID from AdMob (format: ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy)
        android: 'ca-app-pub-8952058057579255/7287204281', // Add your Android banner ad unit ID from AdMob (format: ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy)
    }) || '',
    rewarded: Platform.select({
        ios: '', // Add your iOS rewarded ad unit ID from AdMob (format: ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy)
        android: 'ca-app-pub-8952058057579255/3160530088', // Add your Android rewarded ad unit ID from AdMob (format: ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy)
    }) || '',
};

// Use test ads in development, production ads in production
const USE_TEST_ADS = process.env.NODE_ENV === 'development' || __DEV__;

export const AD_UNIT_IDS = {
    banner: USE_TEST_ADS ? TEST_AD_UNIT_IDS.banner : PRODUCTION_AD_UNIT_IDS.banner,
    rewarded: USE_TEST_ADS ? TEST_AD_UNIT_IDS.rewarded : PRODUCTION_AD_UNIT_IDS.rewarded,
};

/**
 * Initialize Google Mobile Ads
 * This should be called once when the app starts
 */
export async function initializeAdMob() {
    try {
        await GoogleMobileAds().initialize();
    } catch (error) {
        console.warn('Failed to initialize Google Mobile Ads:', error);
    }
}

export default GoogleMobileAds;
