import React, { useState, useEffect, useCallback } from 'react';
import { DrawerContentScrollView, DrawerItem, } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Dimensions, Modal, ScrollView, TouchableOpacity, Alert, BackHandler, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import IconAnt from 'react-native-vector-icons/AntDesign';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { authorize, revoke, refresh } from 'react-native-app-auth';
import { Configs } from './configs';
import { refreshToken } from './refreshToken'

function SideBar({ ...props }) {

    const API_URL = 'https://ws.esigns.cloud';
    const { t, i18n } = useTranslation();

    const [profile, setProfile] = useState({ country: global.country, email: global.email, firstName: global.firstName, lastName: global.lastName, name: global.name })

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

    useEffect(() => {
        refreshToken();
        //getUserProfile(global.token);
    }, [])

    function changeLanguage(language) {
        i18n.changeLanguage(language)
        setlanguageModal(false);

        //Patch current language.
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
                global.language = response.data.settings.language;
                console.log('Language set! = ', language)
            }
        }, (error) => {
            console.log(error);
        })

        props.navigation.closeDrawer();
    }

    //-------------------------Get logout--------------------------
    async function logout() {
        const result = await revoke(Configs.adb2c, {
            tokenToRevoke: global.token,
            includeBasicAuth: true,
            sendClientId: true,
        });

        global.token = '';
        global.refreshToken = '';

        //Set Global profile
        global.country = '';
        global.email = '';
        global.firstName = '';
        global.lastName = '';
        global.name = '';

        props.navigation.push('LogoutScreen')
        console.log("result = ", result)
    }

    //------------------------Profile-----------------------
    const handleEditProfile = useCallback(
        async provider => {
            try {
                //const config = Configs[provider];
                const config = provider
                const newAuthState = await authorize(config);
                console.log('result = ', newAuthState);
                console.log('NEW AUTH TOKEN = ', newAuthState.accessToken);
                console.log('Current TOKEN = ', global.token);

                //global.refreshToken = newAuthState.refreshToken;
                //global.token = newAuthState.accessToken;

                axios({
                    method: 'PATCH',
                    url: API_URL + '/accounts',
                    headers: {
                        'Authorization': 'Bearer ' + newAuthState.accessToken,
                        "content-type": "application/json",
                    },
                    data: {
                        "replace": "/profiles",
                    }
                }).then((response) => {
                    //console.log('PATCH TOKEN = ', response)
                    console.log('patch user = ', response)

                    setProfile(response.data.profiles);
                    //props.navigation.push('LoadingScreen')
                }, (error) => {
                    console.log(error)
                })

                //getUserProfile();
                //global.token = newAuthState.accessToken;
                //global.refreshToken = newAuthState.refreshToken;

            } catch (error) {
                console.log(error)

            }
        }
    );
    //------------------------Password-----------------------
    const handleResetassword = useCallback(
        async provider => {
            try {
                //const config = Configs[provider];
                const config = provider
                const newAuthState = await authorize(config);
                console.log('result = ', newAuthState);


                global.token = newAuthState.accessToken;
                global.refreshToken = newAuthState.refreshToken;

            } catch (error) {
                console.log(error)

            }
        }
    );

    return (
        <View style={{ flex: 1 }}>
            {/* language modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={languageModal}
                onRequestClose={() => setlanguageModal(false)}>
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
                    <View>
                        <Text style={styles.name}>{profile.name}</Text>
                        <Text style={styles.detail}>{profile.email}</Text>
                        <Text style={styles.detail}>{profile.country}</Text>
                    </View>
                </View>

            </View>

            <DrawerContentScrollView {...props} style={{ backgroundColor: '#616060', }}>

                <DrawerItem
                    label={t('Home')}
                    labelStyle={{ color: 'white', left: -15 }}
                    style={{ backgroundColor: HomeFocusedColor }}
                    icon={() => <Icon name='home' size={25} color='white' />}
                    onPress={() => props.navigation.navigate('HomeDrawer')} />
                <DrawerItem
                    label={t('About')}
                    labelStyle={{ color: 'white', left: -15 }}
                    style={{ backgroundColor: AboutFocusedColor }}
                    icon={() => <Icon name='info-circle' size={25} color='white' />}
                    onPress={() => props.navigation.navigate('AboutDrawer')} />
                <DrawerItem
                    label={t('Certificates')}
                    labelStyle={{ color: 'white', left: -15 }}
                    style={{ backgroundColor: CertificateFocusedColor }}
                    icon={() => <Icon2 name='pen-nib' size={23} color='white' />}
                    onPress={() => props.navigation.navigate('CertificateDrawer')} />

            </DrawerContentScrollView>

            <View style={styles.bottomContainer}>
                <DrawerItem
                    label={t('Change language')}
                    labelStyle={{ color: 'white', left: -10 }}
                    icon={() => <Icon2 name='globe' size={21} color='white' />}
                    onPress={() => setlanguageModal(true)} />
            </View>
            <View style={{ backgroundColor: '#616068' }}>
                <View style={{ borderBottomWidth: 0.5, borderColor: 'white', marginHorizontal: 15 }} />
            </View>
            <View style={styles.bottomContainer}>
                {/*<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 18, paddingVertical: 10 }}>
                    <Icon name='home' size={26} color='white' />
                    <Text>Reset</Text>
                </TouchableOpacity>*/}
                <DrawerItem
                    label={t('Edit profile')}
                    labelStyle={{ color: 'white', left: -15 }}
                    icon={() => <Icon2 name='user-edit' size={21} color='white' />}
                    onPress={() => { handleEditProfile(Configs.profile) }} />
                <DrawerItem
                    label={t('Reset password')}
                    labelStyle={{ color: 'white', left: -10 }}
                    icon={() => <Icon2 name='key' size={21} color='white' />}
                    onPress={() => { handleResetassword(Configs.password) }} />
                <DrawerItem
                    label={t('Signout')}
                    labelStyle={{ color: 'white', left: -10 }}
                    icon={() => <Icon2 name='sign-out-alt' size={23} color='white' />}
                    onPress={() => { logout() }} />
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
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    name: {
        fontSize: 23,
        fontWeight: 'bold',
        paddingBottom: 3,
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