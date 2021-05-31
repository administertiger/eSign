import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';

function Certificate() {
    const API_URL = 'https://ws.esigns.cloud';

    const [certificate, setCertificate] = useState({});
    const [isLoading, setIsLoading] = useState(true)

    useState(() => {
        getUserProfile();
    }, [])

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
                    console.log('certificate = ', response.data.certificates)
                    setCertificate(response.data.certificates)
                    setIsLoading(false)
                }
                console.log(certificate);

            }, (error) => {
                console.log(error);

            })
    }

    const handleChooseFile = async () => {
        //Opening Document Picker for selection of one file
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });

            console.log('res = ', res)
            //Setting the state to show single file attributes
            //setFile({ name: res.name, uri: res.uri, type: res.type, size: res.size });

        } catch (err) {
            //Handling any exception (If any)
            if (DocumentPicker.isCancel(err)) {
                //If user canceled the document selection
                alert('Canceled from single doc picker');
            } else {
                //For Unknown Error
                alert('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    };

    function renderItem({ item }) {
        return (
            <View>
                <Text> {'=> '} {item.certificateName}</Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.showCertificate}>
                <Text style={styles.headerText}>Your certificate</Text>
                <Text />
                <FlatList data={certificate} renderItem={renderItem} />
                <ActivityIndicator size='large' color='black' animating={isLoading} />
            </View>
            <View style={styles.buttonBox}>
                <TouchableOpacity style={styles.buttonAdd} onPress={() => handleChooseFile()}>
                    <Text><Icon name='plus' /> Add Certificate</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

//Header---------
export function CertificateHeader({ navigation }) {
    return (
        <View style={styles.homeHeader}>
            <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.openDrawer()} >
                <Icon name='align-left' size={25} color='black' />
            </TouchableOpacity>
            <Text style={styles.homeHeaderText}>Certification</Text>
        </View >
    )
}

const styles = StyleSheet.create({
    showCertificate: {
        alignItems: 'center',
        //borderWidth: 1,
        paddingTop: 20,
    },
    buttonBox: {
        //borderWidth: 1,
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 50,
    },
    buttonAdd: {
        borderWidth: 2,
        padding: 10,
        paddingHorizontal: 50,
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold',
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
    }
})

export default Certificate;
