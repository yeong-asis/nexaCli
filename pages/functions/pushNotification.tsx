import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import { PermissionsAndroid } from 'react-native';



export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
    }
}

export async function GetFCMToken() {
    // console.log("run token step");
    let FCMToken = await AsyncStorage.getItem("fcmtoken");
    console.log(FCMToken,"old token");
    if (!FCMToken) {
        try {
            const FCMToken = await messaging().getToken();
            if (FCMToken) {
                console.log(FCMToken, "new token");
                const service = 'GMS';
                await AsyncStorage.setItem("service", service);
                await AsyncStorage.setItem("fcmtoken", FCMToken);
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export const NotificationListner = async () => {
    messaging().onNotificationOpenedApp(async remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
    });

    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,);

            }
        });

    messaging().onMessage(async remoteMessage => {
        console.log("notification on froground state....", remoteMessage);
    })
}