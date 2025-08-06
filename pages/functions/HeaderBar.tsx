import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { HeaderCSS } from '../../themes/CSS';
import { COLORS } from '../../themes/theme';
import { useNavigation } from '@react-navigation/native';
import GradientBGIcon from '../../objects/GradientBGIcon';

interface HeaderBarProps {
  title?: string;
  checkBackBttn?: boolean;
  phoneID?: string;
  personStatus?: boolean;
}

const HeaderBar: React.FC<HeaderBarProps> = ({title, checkBackBttn, phoneID, personStatus}) => {
    const navigation = useNavigation();
    const [userID, setUserID] = useState('');
    
    return (
        checkBackBttn==true ? (
        <View style={HeaderCSS.BackHeaderContainer}>
            <TouchableOpacity onPress={async () => { navigation.goBack(); }}>
                <GradientBGIcon
                    name="arrow-back-circle-outline"
                    color={COLORS.primaryLightGreyHex}
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
