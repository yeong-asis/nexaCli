import { PermissionsAndroid, Platform, Alert } from 'react-native';

export async function requestDownloadPermission() {
    if (Platform.OS === 'android') {
        if (Platform.Version < 33) { 
            // Android 12 or lower
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission Required',
                    message: 'This app needs access to save files to your Downloads.',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        // Android 13+ does not need WRITE_EXTERNAL_STORAGE for downloads
        return true;
    }
    return true; // iOS uses app sandbox, no permission needed
}
