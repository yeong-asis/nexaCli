import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { defaultCSS } from '../../themes/CSS';
import { BACKGROUNDCOLORCODE } from '../../themes/theme';
import HeaderBar from '../functions/HeaderBar';
import LoadingAnimation from '../functions/LoadingAnimation';

type FileType = 'png' | 'jpg' | 'pdf' | 'unknown';

const ViewAttachmentScreen = ({ navigation }: { navigation: any }) => {
    const route = useRoute();
    const { fileName, attachmentLink } = route.params as any;

    const [fileType, setFileType] = useState<FileType>('unknown');
    const [b64, setB64]           = useState<string>(''); 
    const [source, setSource] = useState<any|{ uri: string }|null>(null);
    const [processData, setProcessData] = useState(false);

    useEffect(() => {
        // const showPreview = async () => {
        //     // 1) detect type
        //     const type = detectFileType(attachmentLink);
        //     setFileType(type);

        //     // 2) normalize to Base64
        //     const _b64  = hexToBase64(attachmentLink);
        //     setB64(_b64);

        //     if (type === 'png' || type === 'jpg') {
        //         // inline data URI
        //         setSource({ uri: `data:image/${type};base64,${_b64}` });
        //         setProcessData(false);
        //     }
        //     else if (type === 'pdf') {
        //         const path = FileSystem.documentDirectory + `${fileName}.pdf`;
        //         await FileSystem.writeAsStringAsync(path, _b64, {
        //         encoding: FileSystem.EncodingType.Base64,
        //         });
        //         setSource({ uri: path.startsWith('file://') ? path : 'file://' + path });
        //         setProcessData(false);
        //     }
        //     else {
        //         // unsupported
        //         setProcessData(false);
        //     }
        // };

        // showPreview();
    }, [attachmentLink, fileName]);

    return (
    <View style={defaultCSS.ScreenContainer}>
        <StatusBar backgroundColor={BACKGROUNDCOLORCODE} />

        <View style={{ flex: 1 }}>
            <HeaderBar title={`${"View Attachment:"}: `} checkBackBttn={true} />

            {processData ? (
                <View style={{ alignSelf: "center", }}>
                    <LoadingAnimation />
                </View>
            ) : (
            <>
                {(fileType === 'png' || fileType === 'jpg') ? (
                    <View style={styles.container}>
                        <Image
                            source={source as { uri: string }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>
                ) : (fileType === 'pdf' && source) ? (
                    <View style={styles.container}>
                        <WebView
                            originWhitelist={['*']}
                            source={source as { uri: string }}
                            style={styles.webview}
                            useWebKit
                        />
                    </View>
                ) : (
                    <Text>Unsupported file type.</Text>
                )}
            </>
            )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        alignItems: 'center',
    },
    image: {
        width: 300,
        height: 400,
        backgroundColor: '#eee',
    },
    webview: {
        flex: 1,
        width: Dimensions.get('window').width,
    },
});

export default ViewAttachmentScreen;