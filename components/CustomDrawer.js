import React, { useState, useEffect, useCallback } from 'react';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Dimensions, Modal, ScrollView, TouchableOpacity, Alert, BackHandler, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { authorize, revoke, } from 'react-native-app-auth';
import { Configs } from '../components/configs';

function SideBar({ ...props }) {

    const API_URL = 'https://ws.esigns.cloud';
    const { t, i18n } = useTranslation();

    //Get the cuurent route.
    const { state } = props
    const { routes, index } = state;
    const focusedRoute = routes[index];

    //Color of each item.
    const [HomeFocusedColor, setHomeFocusedColor] = useState();
    const [AboutFocusedColor, setAboutFocusedColor] = useState();
    const [CertificateFocusedColor, setCertificateFocusedColor] = useState();

    //Modal
    const [languageModal, setlanguageModal] = useState(false);
    //Dynamic color of each item.
    useEffect(() => {
        if (focusedRoute.name === 'HomeDrawer') {
            setHomeFocusedColor('rgba(0, 0, 0, 0.5)');
            setAboutFocusedColor();
            setCertificateFocusedColor()
        } else if (focusedRoute.name === 'AboutDrawer') {
            setHomeFocusedColor();
            setAboutFocusedColor('rgba(0, 0, 0, 0.5)');
            setCertificateFocusedColor()
        } else if (focusedRoute.name === 'CertificateDrawer') {
            setHomeFocusedColor();
            setAboutFocusedColor();
            setCertificateFocusedColor('rgba(0, 0, 0, 0.5)')
        } else {
            setHomeFocusedColor();
            setAboutFocusedColor();
            setCertificateFocusedColor()
        }
    }, [focusedRoute])

    function changeLanguage(language) {
        i18n.changeLanguage(language)
        setlanguageModal(false);
        patchLanguage(language)
        props.navigation.closeDrawer();
    }

    //--------------------Get current certification.------------------
    function patchLanguage(language) {
        axios({
            method: 'PATCH',
            url: API_URL + '/accounts',
            headers: {
                'Authorization': 'Bearer ' + global.token,
                "content-type": "application/json",
            },
            data: {
                "replace": "/settings/language",
                "value": language
            }
        }).then((response) => {
            console.log(response);
            if (response.data) {

            }
            //console.log(certificate);

        }, (error) => {
            console.log(error);
        })
    }
    //-------------------------Get logout--------------------------
    async function logout() {
        const result = await revoke(Configs.adb2c, {
            tokenToRevoke: global.token,
            includeBasicAuth: true,
            sendClientId: true,
        });

        global.token = '';
        props.navigation.navigate('LoginScreen')
        console.log("result = ", result)
    }

    //const handleAuthorize = useCallback(
    //    async provider => {
    //        try {
    //            //const config = Configs[provider];
    //            const config = provider
    //            const newAuthState = await authorize(config);
    //
    //            global.token = newAuthState.accessToken; //Get accessToken
    //            global.refreshToken = newAuthState.refreshToken
    //            getUserProfile(newAuthState.accessToken)
    //            console.log('User token: ', newAuthState);
    //
    //        } catch (error) {
    //            //Alert.alert('Failed to log in', error.message);
    //            BackHandler.exitApp();
    //        }
    //    }
    //);

    return (
        <View style={{ flex: 1 }}>
            {/* language modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={languageModal}>
                <View style={styles.languageContainer}>
                    <View style={styles.languageBox}>
                        <TouchableOpacity style={{ alignItems: 'center', padding: 10 }} onPress={() => setlanguageModal(false)}>
                            <Text style={{ color: 'black' }}>{t('Close')}</Text>
                        </TouchableOpacity>
                        <ScrollView>
                            <View style={styles.scroll}>
                                <TouchableOpacity style={styles.language} onPress={() => changeLanguage('en')}>
                                    <Text style={styles.languageText}>{t('English')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.language} onPress={() => changeLanguage('th')}>
                                    <Text>{t('Thai')}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <View style={{ backgroundColor: '#616060' }}>
                <View style={styles.headerContainer}>
                    <Text style={styles.name}>{global.firstName} {global.lastName}</Text>
                    <Text style={styles.detail}>{global.email}</Text>
                    <Text style={styles.detail}>{global.country}</Text>
                </View>
            </View>

            <DrawerContentScrollView {...props} style={{ backgroundColor: '#616060', }}>

                <DrawerItem
                    label={t('Home')}
                    labelStyle={{ color: 'white', }}
                    style={{ backgroundColor: HomeFocusedColor }}
                    icon={() => <Icon name='home' size={25} color='white' />}
                    onPress={() => props.navigation.navigate('HomeDrawer')} />
                <DrawerItem
                    label={t('About')}
                    labelStyle={{ color: 'white' }}
                    style={{ backgroundColor: AboutFocusedColor }}
                    icon={() => <Icon name='info-circle' size={25} color='white' />}
                    onPress={() => props.navigation.navigate('AboutDrawer')} />
                <DrawerItem
                    label={t('Certificates')}
                    labelStyle={{ color: 'white' }}
                    style={{ backgroundColor: CertificateFocusedColor }}
                    icon={() => <Icon2 name='pen-nib' size={23} color='white' />}
                    onPress={() => props.navigation.navigate('CertificateDrawer')} />

            </DrawerContentScrollView>

            <View style={styles.bottomContainer}>
                <DrawerItem
                    label={t('Change language')}
                    labelStyle={{ color: 'white', }}
                    icon={() => <Icon2 name='globe' size={21} color='white' />}
                    onPress={() => setlanguageModal(true)} />
            </View>
            <View style={{ backgroundColor: '#616068' }}>
                <View style={{ borderBottomWidth: 0.5, borderColor: 'white', marginHorizontal: 15 }} />
            </View>
            <View style={styles.bottomContainer}>
                <DrawerItem
                    label={t('Edit profile')}
                    labelStyle={{ color: 'white', }}
                    icon={() => <Icon2 name='user-edit' size={21} color='white' />} />
                <DrawerItem
                    label={t('Signout')}
                    labelStyle={{ color: 'white', }}
                    icon={() => <Icon2 name='sign-out-alt' size={23} color='white' />}
                    onPress={() => { logout(), props.navigation.push('LoginScreen') }} />
            </View>

        </View>

    )
}

const styles = StyleSheet.create({
    headerContainer: {
        padding: 10,
        marginTop: 9,
        marginHorizontal: 10,
        borderBottomWidth: 0.5,
        borderColor: 'white',
        backgroundColor: '#616060',
    },
    name: {
        fontSize: 23,
        fontWeight: 'bold',
        //paddingBottom: 5,
        color: 'white'
    },
    detail: {
        color: 'white',
        opacity: 0.5,
    },
    bottomContainer: {
        //alignItems: 'center',
        paddingBottom: 10,
        //marginHorizontal: 10,
        backgroundColor: '#616060',
        //borderTopWidth: 0.7,
        borderColor: 'white',
    },
    //Modal---------
    languageContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        //backgroundColor: 'white'
    },
    languageBox: {
        height: 200,
        width: Dimensions.get('window').width,
        backgroundColor: '#f0f0f0',
    },
    scroll: {
        paddingHorizontal: 10,
        alignItems: 'center',
        backgroundColor: 'white',
        height: 200,
    },
    language: {
        margin: 5,
        //borderWidth: 1,
        width: Dimensions.get('window').width - 40,
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 13,
        //elevation: 3,
        borderBottomWidth: 0.5,
    },
    languageText: {
        fontSize: 17,
    }
})

export default SideBar;