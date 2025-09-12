import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { HeaderCSS } from '../../themes/CSS';
import { COLORS } from '../../themes/theme';
import { useNavigation } from '@react-navigation/native';
import GradientBGIcon from '../../objects/GradientBGIcon';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './Navigation';

interface HeaderBarProps {
  title?: string;
  checkBackBttn?: boolean;
  phoneID?: string;
  personStatus?: boolean;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HeaderBar: React.FC<HeaderBarProps> = ({title, checkBackBttn, phoneID, personStatus}) => {
    
    const navigation = useNavigation<NavigationProp>();
    // const navigation = useNavigation();
    const [userID, setUserID] = useState('');
    
    return (
        checkBackBttn==true ? (
        <View style={HeaderCSS.BackHeaderContainer}>
            <TouchableOpacity onPress={async () => { 
                if (navigation.canGoBack()) {
                    navigation.goBack();
                } else {
                    navigation.navigate("Tab", { screen: "Dashboard" });
                }
             }}>
                <GradientBGIcon
                    name="arrow-back-circle-outline"
                    color={COLORS.primaryWhiteHex}
                    size={34}
                />
            </TouchableOpacity>

            <Text style={[HeaderCSS.HeaderText, {marginLeft: 15}]}>{title}</Text>
        </View>
        ) : (
        <View style={HeaderCSS.HeaderContainer}>
            <Text style={[HeaderCSS.HeaderText, {marginLeft: 15}]}>{title}</Text>
            <View style={{flexDirection: "row"}}></View>
        </View>
        )
    );
};

export default HeaderBar;
