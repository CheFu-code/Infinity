import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from '../utils/admob';

interface RewardedAdComponentProps {
    visible: boolean;
    onRewardEarned: (reward: any) => void;
    onClose: () => void;
    isDark?: boolean;
}

/**
 * RewardedAd component that displays a rewarded ad modal
 * Shows when the user has pressed undo more than 3 times
 */
export function RewardedAdComponent({
    visible,
    onRewardEarned,
    onClose,
    isDark = false,
}: RewardedAdComponentProps) {
    const [rewardedAd, setRewardedAd] = useState<RewardedAd | null>(null);
    const [loading, setLoading] = useState(false);
    const [adLoaded, setAdLoaded] = useState(false);

    useEffect(() => {
        if (!visible) return;

        // Create a new rewarded ad instance
        const ad = RewardedAd.createForAdRequest(AD_UNIT_IDS.rewarded, {
            keywords: ['game', 'puzzle', 'casual'],
            requestNonPersonalizedAdsOnly: false,
        });

        // Handle reward earned
        ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
            console.log('Reward earned:', reward);
            onRewardEarned(reward);
            setAdLoaded(false);
            handleClose();
        });

        // Handle ad closed
        ad.addAdEventListener(RewardedAdEventType.CLOSED, () => {
            setAdLoaded(false);
            handleClose();
        });

        // Handle ad failed to load
        ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
            setAdLoaded(true);
            setLoading(false);
        });

        ad.addAdEventListener(RewardedAdEventType.ERROR, (error) => {
            console.warn('Rewarded ad failed to load:', error);
            setLoading(false);
            setAdLoaded(false);
        });

        setRewardedAd(ad);
        setLoading(true);
        ad.load();

        return () => {
            ad.removeAllListeners();
        };
    }, [visible, onRewardEarned]);

    const handleShowAd = () => {
        if (adLoaded && rewardedAd) {
            rewardedAd.show();
        }
    };

    const handleClose = () => {
        setAdLoaded(false);
        onClose();
    };

    if (!visible) return null;

    return (
        <View style={[styles.overlay, isDark && styles.darkOverlay]}>
            <View style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
                <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
                    Watch an Ad
                </Text>
                <Text style={[styles.message, isDark ? styles.mutedDarkText : styles.mutedLightText]}>
                    You've used many undos! Watch a rewarded ad to unlock an extra undo.
                </Text>

                <View style={styles.buttonContainer}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            styles.primaryButton,
                            pressed && styles.buttonPressed,
                            loading && styles.buttonDisabled,
                        ]}
                        onPress={handleShowAd}
                        disabled={!adLoaded || loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Loading Ad...' : adLoaded ? 'Watch Ad' : 'No Ad Available'}
                        </Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            styles.secondaryButton,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={handleClose}
                    >
                        <Text style={[styles.secondaryButtonText, isDark ? styles.darkText : styles.lightText]}>
                            Cancel
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    darkOverlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    container: {
        borderRadius: 12,
        padding: 24,
        width: '85%',
        maxWidth: 400,
    },
    darkContainer: {
        backgroundColor: '#1f2937',
    },
    lightContainer: {
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    message: {
        fontSize: 14,
        marginBottom: 20,
        lineHeight: 20,
    },
    darkText: {
        color: '#ffffff',
    },
    lightText: {
        color: '#000000',
    },
    mutedDarkText: {
        color: '#d1d5db',
    },
    mutedLightText: {
        color: '#6b7280',
    },
    buttonContainer: {
        gap: 12,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: '#3b82f6',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#3b82f6',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    buttonPressed: {
        opacity: 0.7,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
});
