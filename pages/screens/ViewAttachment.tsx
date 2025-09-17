import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { defaultCSS } from '../../themes/CSS';
import { BACKGROUNDCOLORCODE } from '../../themes/theme';
import HeaderBar from '../functions/HeaderBar';
import LoadingAnimation from '../functions/LoadingAnimation';

type FileType = 'png' | 'jpg' | 'jpeg' | 'pdf' | 'unknown';

const ViewAttachmentScreen = ({ navigation }: { navigation: any }) => {
    const route = useRoute();
    const { doc } = route.params as any;

    const [fileType, setFileType] = useState<FileType>('unknown');
    const [source, setSource] = useState<any | null>(null);
    const [processData, setProcessData] = useState(false);

    useEffect(() => {
        // console.log(doc)
        const showPreview = async () => {
            if (!doc) return;
            setProcessData(true);

            const ext = doc.FileName?.split('.').pop()?.toLowerCase();
            if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
                setFileType('jpg'); // treat png/jpg same
                setSource({ uri: `data:image/${ext};base64,${doc.FileBase64}` });
            } else if (ext === 'pdf') {
                setFileType('pdf');

                // const path = FileSystem.documentDirectory + `${fileName}.pdf`;
                // await FileSystem.writeAsStringAsync(path, _b64, {
                // encoding: FileSystem.EncodingType.Base64,
                // });
                // setSource({ uri: path.startsWith('file://') ? path : 'file://' + path });
                setProcessData(false);

            } else {
                setFileType('unknown');
                setProcessData(false);
            }
        };

        showPreview();

    }, [doc]);

    return (
    <View style={defaultCSS.ScreenContainer}>
        <StatusBar backgroundColor={BACKGROUNDCOLORCODE} />

        <View style={{ flex: 1 }}>
            <HeaderBar title={`${"View Attachment"}`} checkBackBttn={true} />

            {processData ? (
                <View style={{ alignSelf: "center", }}>
                    <LoadingAnimation />
                </View>
            ) : (
            <>
                {(fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg') ? (
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
                            // source={{ uri: source }}
                            // source={source}
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