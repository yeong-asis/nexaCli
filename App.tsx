import { NewAppScreen } from '@react-native/new-app-screen';
import React from 'react';
import { GetFCMToken, NotificationListner, requestUserPermission } from './pages/functions/pushNotification';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';

import { Dimensions, View } from 'react-native';
import LoginScreen from './pages/screens/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TabNavigator from './pages/screens/TabNavigator';
import { DashboardScreen } from './pages/screens/DashboardScreen';
import { ProfileScreen } from './pages/screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [loading, setLoading] = React.useState(true);
  const [initialRouteName, setInitialRouteName] = React.useState("");

 React.useEffect(() => {
    (async()=>{
      await GetFCMToken();
      await requestUserPermission();
      await NotificationListner();
    })();
    
    const checkUserCode = async () => {
      const userCode = await AsyncStorage.getItem('UserID');
      if (userCode === null) {
        setInitialRouteName('Login');
      }else{
        setInitialRouteName('Tab');
      }
      // setInitialRouteName('Login');
      setLoading(false);
    };

    checkUserCode();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
    {loading ? (
      <View style={{ flex: 1, marginVertical: Dimensions.get('screen').height / 100 * 10 }}>
        <ActivityIndicator size={40} color="#000000" />
      </View>
    ) : (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={LoginScreen} options={{animation: 'slide_from_bottom'}} />
          <Stack.Screen name="Tab" component={TabNavigator} options={{animation: 'slide_from_bottom'}} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{animation: 'slide_from_bottom'}} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{animation: 'slide_from_bottom'}} />
          </Stack.Navigator>
      </NavigationContainer>
    )}
    </SafeAreaView>
  );
}

export default App;
