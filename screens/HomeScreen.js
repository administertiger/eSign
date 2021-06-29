import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, BackHandler, ActivityIndicator, Alert, DeviceEventEmitter } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import IconAnt from 'react-native-vector-icons/dist/AntDesign';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import { refreshToken } from '../components/refreshToken';

function HomeScreen({ navigation }) {
    const API_URL = 'https://ws.esigns.cloud';

    const { t, i18n } = useTranslation();

    useEffect(() => {
        //Refrsh token
        refreshToken();

        //Back button
        const backAction = () => {
            BackHandler.exitApp();
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        DeviceEventEmitter.addListener(
            'ON_RECENT_APP_BUTTON_PRESSED',
            () => {
                console.log('You tapped the home button!')
            })

    })

    useEffect(() => {
        getList();
        getUserProfile();
        console.log('Token = ', global.token)
    }, []);

    const [documents, setDocuments] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [isLoading, setIsLoading] = useState(true)

    //--------------------Get documents--------------------
    function getList() {
        axios.get(API_URL + '/documents',  //Documents API
            {
                headers: {
                    'Authorization': 'Bearer ' + global.token
                }
            })
            .then((response) => {
                //console.log('response = ', response);
                if (response.data) {
                    //console.log('Documents List: ', response.data);

                    const data = response.data;
                    const getFile = data.map((data) => data); //Get file data
                    const getCertificate = data.map((data) => data.signatures[0]);  //Get certification

                    //Merge File docs array and Certification array togethor.
                    const merge = getFile.map((a, i) => Object.assign({}, a, getCertificate[i],))
                    console.log('documents = ', merge)
                    setDocuments(merge);
                    setIsLoading(false);
                }

            }, (error) => {
                console.log(error);
            })
    }

    //-----------------------Get Certificates-----------------------
    function getUserProfile() {
        axios.get(API_URL + '/accounts',  //Account API
            {
                headers: {
                    'Authorization': 'Bearer ' + global.token
                }
            })
            .then((response) => {
                console.log(response);
                if (response.data) {
                    setCertificates(response.data.certificates)
                }

            }, (error) => {
                console.log(error);

            })
    }

    function renderItem({ item }) {

        const createDateFormat = item.signedTime[8] + item.signedTime[9] + '/' + item.signedTime[5] + item.signedTime[6] + '/' + item.signedTime[0] + item.signedTime[1] + item.signedTime[2] + item.signedTime[3]
        //console.log(createDateFormat);
        const createTimeFormat = item.signedTime[11] + item.signedTime[12] + item.signedTime[13] + item.signedTime[14] + item.signedTime[15] + item.signedTime[16] + item.signedTime[17] + item.signedTime[18]
        //console.log(createTimeFormat);

        return (
            <TouchableOpacity style={styles.renderBox}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.renderText} numberOfLines={1}>{item.file.displayName}</Text>
                    <Text style={{ paddingLeft: 0 }}>{createDateFormat} {createTimeFormat}</Text>
                </View>
                <Text style={{ opacity: 0.5, color: 'black' }}>{item.certificateName}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{ flex: 1 }}>

            <View style={styles.box}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 5 }}>
                    <TouchableOpacity style={styles.showCount} onPress={() => navigation.navigate('DocumentsTab')}>
                        <Text style={{ fontSize: 30, color: 'blue', opacity: 0.7 }}>{documents.length}</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{t('Documents')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.showCount} onPress={() => navigation.navigate('CertificateDrawer')}>
                        <Text style={{ fontSize: 30, color: 'blue', opacity: 0.7 }}>{certificates.length}</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{t('Certificates')}</Text>
                    </TouchableOpacity>
                </View>

                <Text style={{ padding: 10, paddingTop: 5, paddingStart: 17, fontSize: 20 }}>{t('Your recent activity')}</Text>



                <FlatList data={documents.slice(0, 10)} renderItem={renderItem} ListFooterComponent={
                    <View>
                        <View style={{ marginBottom: 10, }} />
                        <ActivityIndicator size='large' color='black' animating={isLoading} />
                        <View style={{ marginBottom: 15, }} />
                    </View>
                } />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => { navigation.navigate('WorkDrawer') }}>
                    <IconAnt name='pluscircle' size={65} style={{ color: '#54c489' }} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

//Header---------
export function HomeHeader({ navigation }) {
    return (
        <View style={styles.homeHeader}>
            <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.openDrawer()} >
                <Icon name='align-left' size={25} color='white' />
            </TouchableOpacity>
            <Text style={styles.homeHeaderText}>eSigns </Text>
            <Icon size={25} name='address-card' color='white' />
        </View >
    )
}

const styles = StyleSheet.create({
    box: {
        flex: 1,
        //justifyContent: 'center',
        //borderWidth: 1,
        marginBottom: 50,
        paddingBottom: 5
    },
    button: {
        position: 'absolute',
        bottom: 25,
        right: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 50,
        elevation: 5
    },
    workBox: {
        //borderWidth: 1,
        flex: 1,
        justifyContent: 'flex-end',
        //alignItems: 'center',
    },
    text: {
        textAlign: 'center',
        paddingTop: 20,
        fontSize: 23,
        fontFamily: 'sans-serif-medium',
        fontWeight: 'bold',
    },
    showCount: {
        justifyContent: 'center',
        alignItems: 'center',
        //borderWidth: 1,
        flex: 1,
        //paddingVertical: 50,
        margin: 20,
        borderRadius: 5,
        backgroundColor: 'white',
        height: 100,
        elevation: 3,
    },
    renderText: {
        fontSize: 18,
        width: 180
    },
    renderBox: {
        //borderWidth: 1,
        marginVertical: 4,
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginHorizontal: 20,
        backgroundColor: 'white',
        elevation: 3,
        //width: Dimensions.get('window').width - 30,

    },

    //Header---------
    homeHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: '#2b44bd',

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
        color: 'white'
    }
})

export default HomeScreen;