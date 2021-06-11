import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import axios from 'axios';

var fullWidth = Dimensions.get('window').width; //full width

function HomeScreen({ navigation }) {
    const API_URL = 'https://ws.esigns.cloud';

    useEffect(() => {
        getList();
        getUserProfile();
    }, []);

    const [documents, setDocuments] = useState([]);
    const [certificates, setCertificates] = useState([]);

    //--------------------Get documents--------------------
    function getList() {
        axios.get(API_URL + '/documents',  //Documents API
            {
                headers: {
                    'Authorization': 'Bearer ' + global.token
                }
            })
            .then((response) => {
                console.log('response = ', response);
                if (response.data) {
                    //console.log('Documents List: ', response.data);

                    const data = response.data;
                    const getFile = data.map((data) => data); //Get file data
                    const getCertificate = data.map((data) => data.signatures[0]);  //Get certification

                    //Merge File docs array and Certification array togethor.
                    const merge = getFile.map((a, i) => Object.assign({}, a, getCertificate[i],))
                    console.log('documents2 = ', merge)
                    setDocuments(merge);
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
        return (
            <TouchableOpacity style={styles.renderBox}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.renderText} numberOfLines={1}>{item.file.displayName}</Text>
                    <Text>{item.signedTime}</Text>
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
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Documents</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.showCount} onPress={() => navigation.navigate('CertificateDrawer')}>
                        <Text style={{ fontSize: 30, color: 'blue', opacity: 0.7 }}>{certificates.length}</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Certificate</Text>
                    </TouchableOpacity>
                </View>

                <Text style={{ padding: 10, paddingTop: 5, paddingStart: 17, fontSize: 20 }}>Your recent activity</Text>

                <View style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 15, backgroundColor: 'white', }}>

                    <FlatList data={documents.slice(0, 5)} renderItem={renderItem} />

                </View>
                <View style={styles.workBox}>
                    <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('WorkDrawer') }} >
                        <Text style={{ color: 'black' }}>
                            <Icon name='plus' /> NEW WORKFLOW
                            </Text>
                    </TouchableOpacity>
                </View>
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
        marginBottom: 70,
    },
    button: {
        //borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30,
        marginBottom: 10,
        height: 60,
        //borderRadius: 10,
        //borderStyle: 'dashed',
        backgroundColor: '#d1d1d1',
        elevation: 5,
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
        fontSize: 17,
        width: 180
    },
    renderBox: {
        //borderWidth: 1,
        marginVertical: 4,
        //marginHorizontal: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        //width: fullWidth,
        //right: 5,
        backgroundColor: 'white',
        elevation: 3,

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