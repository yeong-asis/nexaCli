import { Image } from "react-native";

export const UserPageList = [
    {
        id: 1,
        index: 1,
        icon: (
            <Image
                style={{ width: 80, height: 80 }}
                source={require('../../assets/serviceIcon.png')} 
                // source={colorScheme === 'light' ? require('../assets/DashboardLight.png') : require('../assets/DashboardDark.png')} 
            />
        ),
        title: "Field Service",
        navigate: "MainJob",
    },
    {
        id: 2,
        index: 2,
        icon: (
            <Image
                style={{ width: 80, height: 80 }}
                source={require('../../assets/stockIcon.png')} 
                // source={colorScheme === 'light' ? require('../assets/FlowLight.png') : require('../assets/WorkflowDark.png')} 
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
            <Image
                style={{ width: 80, height: 80 }}
                source={require('../../assets/reportIcon.png')} 
            />
        ),
        title: "Daily Task",
        navigate: "MainTask",
        // navigate: "/messagelist",
    },
    // {
    //     id: 4,
    //     index: 4,
    //     icon: (
    //         <Image
    //             style={{ width: 80, height: 80 }}
    //             source={require('../assets/CRM.png')} 
    //         />
    //     ),
    //     title: "Report",
    //     navigate: "/...",
    // },
];