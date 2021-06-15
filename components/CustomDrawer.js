import React, { useState, useEffect } from 'react';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Dimensions, Modal, Button, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';

function SideBar({ ...props }) {

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


    return (
        <View style={{ flex: 1 }}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={languageModal}>
                <View style={styles.languageContainer}>
                    <View style={styles.languageBox}>
                        <TouchableOpacity style={{ alignItems: 'center', padding: 10 }} onPress={() => setlanguageModal(false)}>
                            <Text style={{ color: 'blue', }}>Close</Text>
                        </TouchableOpacity>
                        <ScrollView>
                            <View style={styles.scroll}>
                                <TouchableOpacity style={styles.language} onPress={() => i18n.changeLanguage('en')}>
                                    <Text>English</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.language} onPress={() => i18n.changeLanguage('th')}>
                                    <Text>Thai</Text>
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
                    icon={() => <Icon2 name='flag-usa' size={21} color='white' />}
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
                    icon={() => <Icon2 name='sign-out-alt' size={23} color='white' />} />
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
        height: 250,
        width: Dimensions.get('window').width,
        backgroundColor: '#f0f0f0',
    },
    scroll: {
        paddingHorizontal: 10,
        alignItems: 'center',
        //backgroundColor: '#e8e8e8'
    },
    language: {
        margin: 5,
        //borderWidth: 1,
        width: Dimensions.get('window').width - 40,
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        elevation: 3,
    }
})

export default SideBar;