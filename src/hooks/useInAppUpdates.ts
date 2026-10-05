import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import SpInAppUpdates, {
    IAUUpdateKind,
    StartUpdateOptions,
    AndroidInstallStatus,
} from 'sp-react-native-in-app-updates';
import Constants from 'expo-constants';
import * as Sentry from "@sentry/react-native";

const inAppUpdates = new SpInAppUpdates(false);

export function useInAppUpdates() {
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

    useEffect(() => {
        if (Platform.OS !== 'android' || __DEV__) return;

        checkForFlexibleUpdate();

        // Cleanup listener when component unmounts
        return () => {
            // optional: remove listener if the library supports it
        };
    }, []);

    const checkForFlexibleUpdate = async () => {
        try {
            const result = await inAppUpdates.checkNeedsUpdate({
                curVersion: Constants.expoConfig?.version,
            });

            if (result.shouldUpdate) {
                const updateOptions: StartUpdateOptions = {
                    updateType: IAUUpdateKind.FLEXIBLE,
                };

                await inAppUpdates.startUpdate(updateOptions);
                inAppUpdates.addStatusUpdateListener(onStatusUpdate);
            }
        } catch (error) {
            Sentry.captureException(error, {
                extra: {
                    context: "Update check failed",
                },
            });
        }
    };

    const onStatusUpdate = (event: any) => {
        const { status, bytesDownloaded, totalBytesToDownload } = event;

        if (totalBytesToDownload > 0) {
            const progress = Math.round((bytesDownloaded / totalBytesToDownload) * 100);
            setDownloadProgress(progress);
        }

        if (status === AndroidInstallStatus.DOWNLOADED) {
            setSnackbarVisible(true);
        }
    };

    const installUpdate = () => {
        inAppUpdates.installUpdate();
        setSnackbarVisible(false);
    };

    return {
        snackbarVisible,
        setSnackbarVisible,
        downloadProgress,
        installUpdate,
    };
}