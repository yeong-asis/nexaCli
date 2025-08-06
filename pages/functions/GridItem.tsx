import { Text, View } from "react-native";
import { ItemProps } from "../../objects/objects";
import { IconListPicture } from "../../themes/CSS";

export const GridItem = ({ icon, title }: ItemProps) => {
    return (
        <View style={IconListPicture.gridCSS}>
            <View>{icon}</View>
            <View style={{ marginTop: 10 }}>
                <Text style={IconListPicture.gridTitle}>{title}</Text>
            </View>
        </View>
    );
};