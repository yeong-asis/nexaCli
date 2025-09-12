import React, { useState } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import { HeaderCSS } from '../../themes/CSS';
import { BLACKUSEFULCOLOR, COLORS, HEADERBACKGROUNDCOLORCODE, SECONDGREENCOLOR } from '../../themes/theme';
import { useNavigation } from '@react-navigation/native';
import GradientBGIcon from '../../objects/GradientBGIcon';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './Navigation';
import Icon from 'react-native-vector-icons/Ionicons';

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
        <>
        <View style={HeaderCSS.FirstTopMainHeaderCSS}>
            <Image 
            source={require('../../assets/NexaLogoBWBoard.png')} 
            style={HeaderCSS.HeaderPictureCSS} />
            <View>
                <TouchableOpacity onPress={async () => {}}>
                    <Icon
                        name="ellipsis-vertical"
                        size={28}
                        color={ COLORS.primaryWhiteHex }
                        style={HeaderCSS.HeaderIconCSS}
                    />
                </TouchableOpacity>
            </View>
        </View>
        {checkBackBttn==true ? (
        <View style={HeaderCSS.BackHeaderContainer}>
            <TouchableOpacity onPress={async () => { 
                if (navigation.canGoBack()) {
                    navigation.goBack();
                } else {
                    navigation.navigate("Tab", { screen: "Dashboard" });
                }
             }}>
                <GradientBGIcon
                    name="arrow-back-circle-sharp"
                    color={HEADERBACKGROUNDCOLORCODE}
                    size={40}
                />
            </TouchableOpacity>
            <View style={{marginLeft: 15}}>
                <Text style={HeaderCSS.HeaderText}>{title}</Text>
            </View>
        </View>
        ) : (
        <View style={HeaderCSS.HeaderContainer}>
            <Text style={HeaderCSS.HeaderText}>{title}</Text>
        </View>
        )}
        </>
    );
};

export default HeaderBar;
