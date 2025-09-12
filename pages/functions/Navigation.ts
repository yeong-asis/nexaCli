// types/navigation.ts
import { NavigatorScreenParams } from "@react-navigation/native";

export type TabParamList = {
  Dashboard: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tab: NavigatorScreenParams<TabParamList>;
  Login: undefined;
  Settings: undefined;
};
