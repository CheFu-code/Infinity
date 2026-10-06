import * as Sentry from "@sentry/react-native";
import {
    AdEventType,
    RewardedAd,
    RewardedAdEventType
} from "react-native-google-mobile-ads";

const REWARDED_AD_UNIT_ID = "ca-app-pub-8952058057579255/3160530088"

const MAX_LOAD_ATTEMPTS = 4;
const INITIAL_RETRY_DELAY_MS = 1_000;

type Listener = (loaded: boolean) => void;
type ShowCallbacks = {
    onReward: () => void;
    onFinished: () => void;
};

class RewardedAdManager {
    private ad: RewardedAd | null = null;
    private isLoaded = false;
    private isShowing = false;
    private loadAttempt = 0;
    private retryTimeout: ReturnType<typeof setTimeout> | null = null;
    private listeners = new Set<Listener>();
    private adUnsubscribers: Array<() => void> = [];
    private showCallbacks: ShowCallbacks | null = null;

    subscribe(listener: Listener): () => void {
        this.listeners.add(listener);
        listener(this.isLoaded);
        return () => this.listeners.delete(listener);
    }

    preload(): void {
        if (this.ad || this.isShowing || this.retryTimeout) {
            return;
        }

        this.loadAttempt += 1;
        const ad = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID, {
            requestNonPersonalizedAdsOnly: true,
        });
        this.ad = ad;
        Sentry.captureMessage("Rewarded ad load started", "info");
        this.adUnsubscribers = [
            ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
                this.loadAttempt = 0;
                this.isLoaded = true;
                this.notify(true);
                Sentry.captureMessage("Rewarded ad loaded", "info");
            }),
            ad.addAdEventListener(AdEventType.ERROR, (error) => {
                this.finishAd();
                this.notify(false);
                Sentry.captureException(error, {
                    extra: { context: "Rewarded ad failed to load or show" },
                });
                this.scheduleRetry();
            }),
        ];

        ad.load();
    }

    show(callbacks: ShowCallbacks): boolean {
        if (!this.ad || !this.isLoaded || this.isShowing) {
            return false;
        }

        const ad = this.ad;
        this.isShowing = true;
        this.isLoaded = false;
        this.showCallbacks = callbacks;
        Sentry.captureMessage("Rewarded ad button tapped", "info");
        this.adUnsubscribers.forEach((unsubscribe) => unsubscribe());
        this.adUnsubscribers = [
            ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
                Sentry.captureMessage("Rewarded ad completed and reward earned", "info");
                this.showCallbacks?.onReward();
            }),
            ad.addAdEventListener(AdEventType.CLOSED, () => {
                this.showCallbacks?.onFinished();
                this.finishAd();
                this.preload();
            }),
            ad.addAdEventListener(AdEventType.ERROR, (error) => {
                Sentry.captureException(error, {
                    extra: { context: "Rewarded ad failed to show" },
                });
                this.showCallbacks?.onFinished();
                this.finishAd();
                this.preload();
            }),
        ];

        try {
            void ad.show().catch((error) => {
                this.handleShowFailure(error);
            });
            return true;
        } catch (error) {
            this.handleShowFailure(error);
            return false;
        }
    }

    private handleShowFailure(error: unknown): void {
        if (!this.isShowing) {
            return;
        }

        Sentry.captureException(error, {
            extra: { context: "Rewarded ad failed to show" },
        });
        this.showCallbacks?.onFinished();
        this.finishAd();
        this.preload();
    }

    private finishAd(): void {
        this.adUnsubscribers.forEach((unsubscribe) => unsubscribe());
        this.adUnsubscribers = [];
        this.ad = null;
        this.isLoaded = false;
        this.isShowing = false;
        this.showCallbacks = null;
        this.notify(false);
    }

    private scheduleRetry(): void {
        if (this.loadAttempt >= MAX_LOAD_ATTEMPTS || this.retryTimeout) {
            return;
        }

        const delay = INITIAL_RETRY_DELAY_MS * 2 ** (this.loadAttempt - 1);
        this.retryTimeout = setTimeout(() => {
            this.retryTimeout = null;
            this.preload();
        }, delay);
    }

    private notify(loaded: boolean): void {
        this.listeners.forEach((listener) => listener(loaded));
    }
}

export const rewardedAdManager = new RewardedAdManager();
