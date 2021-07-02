import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { useTranslation } from 'react-i18next';

function AboutScreen({ navigation }) {
    const { t, i18n } = useTranslation();

    const OpenURLButton = ({ url, children }) => {
        const handlePress = useCallback(async () => {
            // Checking if the link is supported for links with custom URL scheme.
            const supported = await Linking.canOpenURL(url);

            if (supported) {
                // Opening the link with some app, if the URL scheme is "http" the web link should be opened
                // by some browser in the mobile
                await Linking.openURL(url);
            } else {
                Alert.alert(`Don't know how to open this URL: ${url}`);
            }
        }, [url]);

        return <TouchableOpacity onPress={handlePress} style={{ borderBottomWidth: 1, padding: 0, alignItems: 'center', justifyContent: 'flex-start', borderBottomColor: '#6888C9' }} >
            <Text style={{ color: '#6888C9', fontSize: 15 }}>{children}</Text>
        </TouchableOpacity>;
    };

    return (
        <ScrollView style={styles.box} >

            <View>
                <Text style={{ fontSize: 16 }}>          {t('eSings app is an electronic signature mobile app that help you sign electronic documents both electronic sign with your signature picture file or digital sign by your certificate from certificate authority (CA).')}
                </Text>
                <Text style={{ fontSize: 16 }}>          {t("This mobile application can help you sign electronic documents anywhere anytime with fast and easy.")}</Text>
            </View>

            <Text style={styles.textHeader}>{t('Digital Signature')}</Text>

            <View style={{ paddingHorizontal: 7 }}>
                <View style={styles.detailBox}>
                    <Text style={styles.detail}>- </Text>
                    <Text style={styles.detail}>{t('Support PDF file.')}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detail}>- </Text>
                    <Text style={styles.detail}>{t('PAdES (PDF Advanced Electronic Signatures)')}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detail}>- </Text>
                    <Text style={styles.detail}>{t('Support XML file.')}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detail}>- </Text>
                    <Text style={styles.detail}>{t('XAdES (XML Advanced Electronic Signatures)')}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detail}>- </Text>
                    <Text style={styles.detail}>{t('Use your own .p12 or .pfx certificate file for digital sign.')}</Text>
                </View>
            </View>

            <Text style={styles.textHeader}>{t('Learn more')}</Text>

            <View style={{ paddingHorizontal: 7, }}>
                <View style={{ paddingTop: 5 }}>
                    <Text style={styles.detail}>{t('To learn more about eSigns app or use web app version at  ')} </Text>
                    <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <OpenURLButton url={'https://www.esigns.cloud'}>https://www.esigns.cloud</OpenURLButton>
                    </View>
                    <Text style={{ paddingTop: 20, fontSize: 15 }}>{t('For any enquiries, please email to ')} </Text>
                    <Text style={{ fontSize: 15, color: '#6888C9' }}>support@esigns.cloud</Text>
                </View>
            </View>

            <Text>  </Text>
            <Text>  </Text>
            <Text>  </Text>
            <Text>  </Text>
        </ScrollView>
    )
}

//Header---------
export function AboutHeader({ navigation }) {
    const { t, i18n } = useTranslation();

    return (
        <View style={styles.homeHeader}>
            <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.openDrawer()} >
                <Icon name='align-left' size={25} color='white' />
            </TouchableOpacity>
            <Text style={styles.homeHeaderText}><Icon name='info-circle' size={30} />  {t('About this app')}</Text>
        </View >
    )
}

const styles = StyleSheet.create({
    linearGradient: {
        //flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        height: 30,
        width: 70,
    },

    box: {
        //flex: 1,
        //justifyContent: 'center',
        //alignItems: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 17,
        //paddingTop: 15,
        //borderWidth: 3,
        //margin: 10
        //paddingBottom: 50

    },
    textHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 20,
    },
    detail: {
        fontSize: 15
    },
    detailBox: {
        paddingTop: 5,
        flexDirection: 'row',

    },
    //Header---------
    homeHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: '#2b44bd',
        //width: 100,
    },
    headerLeft: {
        position: 'absolute',
        left: 5
    },
    headerRight: {
        position: 'absolute',
        right: 5,
        //backgroundColor: 'black',
        padding: 7,
        //borderRadius: 10
    },
    homeHeaderText: {
        fontSize: 23,
        color: 'white',
    },

})

export default AboutScreen;

