import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { useTranslation } from 'react-i18next';

function AboutScreen({ navigation }) {
    const { t, i18n } = useTranslation();

    const [backHandler, setBackHandler] = useState(false)

    //-------------------Backhandler handle-------------------
    useEffect(() => {
        //Handle back button
        const backAction = () => {
            setBackHandler(true);
            return true;
            //navigation.navigate('HomeDrawer');
            //return true;
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    return (
        <View style={styles.box} >
            {/* Backhandler */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={backHandler}
                onRequestClose={() => navigation.navigate('HomeDrawer')}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={styles.alertBox}>
                        <Text style={{ fontSize: 19, paddingBottom: 5 }}>{t('Tab again to exit')}</Text>

                        <View style={styles.alertButton}>
                            <TouchableOpacity onPress={() => setBackHandler(false)}>
                                <Text style={styles.alertButtonSuccess}>{t('Cancel')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={{ paddingBottom: 30, }}>
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
        </View>
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
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'flex-start',
        padding: 10,
        paddingHorizontal: 19,
        paddingTop: 15

    },
    textHeader: {
        fontSize: 20,
        fontWeight: 'bold'
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
    //-------Modal--------
    alertBox: {
        //alignItems: 'center',
        //justifyContent: 'center',
        backgroundColor: 'white',
        width: Dimensions.get('window').width - 70,
        height: 200,
        padding: 25,
        elevation: 5,
    },
    alertButtonSuccess: {
        fontSize: 19,
        color: 'black',
    },
    alertButton: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flex: 1,
        paddingRight: 15,
        flexDirection: 'row',

    },
})

export default AboutScreen;

