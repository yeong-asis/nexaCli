import { Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { COLORS, HEADERBACKGROUNDCOLORCODE } from "../../themes/theme";

export const UserPageList = [
    {
        id: 1,
        index: 1,
        icon: (
            <Image
                style={{ width: 80, height: 80 }}
                source={require('../../assets/serviceIcon.png')} 
            />
        ),
        title: "Field Service",
        navigate: "MainJob",
    },
    {
        id: 2,
        index: 2,
        icon: (
            // <Icon
            //     name="cube-sharp"
            //     size={80}
            //     color={ COLORS.primaryDarkGreyHex }
            // />
            <Image
                style={{ width: 80, height: 80 }}
                source={require('../../assets/stockIcon.png')} 
            />
        ),
        // title: "Workflow",
        // navigate: "WorkflowList",
        title: "SMQ",
        navigate: "MainStock",
    },
    {
        id: 3,
        index: 3,
        icon: (
            // <Icon
            //     name="newspaper-sharp"
            //     size={80}
            //     color={ COLORS.primaryDarkGreyHex }
            // />
            <Image
                style={{ width: 80, height: 80 }}
                source={require('../../assets/reportIcon.png')} 
            />
        ),
        title: "Daily Task",
        navigate: "MainTask",
        // navigate: "/messagelist",
    },
];