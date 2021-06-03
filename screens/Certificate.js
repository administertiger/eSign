import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Button, Modal, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import * as RNFS from 'react-native-fs';
import base64 from 'react-native-base64'

const forge = require('node-forge');

function Certificate() {
    const API_URL = 'https://ws.esigns.cloud';

    const [certificate, setCertificate] = useState({});
    const [isLoading, setIsLoading] = useState(true)
    const [text, onChangeText] = useState('');
    const [selectedFile, setSelectedFile] = useState({})

    //Modal
    const [uploadModalLoading, setUploadModalLoading] = useState(false)
    const [passwordModalState, setPasswordModalState] = useState(false)

    useState(() => {
        getUserProfile();
    }, [])

    useEffect(() => {
        console.log('password = ', text);
    }, [text])


    //--------------------Get current certification.------------------
    function getUserProfile() {
        axios.get(API_URL + '/accounts',  //Account API
            {
                headers: {
                    'Authorization': 'Bearer ' + global.token
                }
            })
            .then((response) => {
                //console.log(response);
                if (response.data) {
                    console.log('certificate = ', response.data.certificates)
                    setCertificate(response.data.certificates)
                    setIsLoading(false)
                }
                //console.log(certificate);

            }, (error) => {
                console.log(error);

            })
    }

    //-------------------handleChoosefile---------------------
    useEffect(() => {
        console.log('selectedFile = ', selectedFile);
    }, [selectedFile])

    const handleChooseFile = async () => {
        //Opening Document Picker for selection of one file
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });

            if (res.type === 'application/x-pkcs12') {
                console.log('res = ', res)
                //Setting the state to show single file attributes
                setSelectedFile(res)
                setPasswordModalState(true)
            } else {
                console.log('Wrong file type');
                Alert.alert('Please choose only p12 file')
                setSelectedFile({})

            }
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

    //---------------------handleSubmit-------------------------

    //--------Upload----------
    function uploadFile() {
        //Encode base64            
        const base64pwd = base64.encode(text);

        let formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('password', base64pwd);

        axios({
            method: 'post',
            url: API_URL + '/certificates',
            data: formData._parts.length > 0 ? formData : null,
            headers: {
                'Authorization': 'Bearer ' + global.token,
                "content-type": "multipart/form-data"
            },
        }).then((response) => {
            console.log('response = ', response);
            console.log('Upload Success!!');
            getUserProfile();
            setSelectedFile({});
            setUploadModalLoading(false);
            Alert.alert('Upload success!')
        }, (error) => {
            console.log(error);
            console.log('Upload Fail T_T')
        })
    }

    //----------Submit-----------
    function handleSubmit() {

        if (text) {
            //console.log('test');

            RNFS.readFile(selectedFile.uri, 'ascii').then(res => {
                //console.log('File = ', res)

                try {
                    // get p12 as ASN.1 object
                    var p12Asn1 = forge.asn1.fromDer(res);
                    var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, text);

                    // get bags by type
                    var certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
                    var pkeyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });

                    // fetching certBag
                    var certBag = certBags[forge.pki.oids.certBag][0];

                    // fetching keyBag
                    var keybag = pkeyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0];

                    // generate pem from private key
                    //var privateKeyPem = forge.pki.privateKeyToPem(keybag.key);

                    // generate pem from cert
                    //var certificate = forge.pki.certificateToPem(certBag.cert);

                    if (certBag && keybag) {
                        //console.log(certBag.cert);
                        console.log('Success then upload file!');
                        setPasswordModalState(false);
                        uploadFile();
                        setUploadModalLoading(true);
                    }

                } catch (error) {

                    console.log(error);
                    console.log('Fail!555');
                    setPasswordModalState(false);
                    Alert.alert('Invalid password')
                    setSelectedFile({})

                };
            })
                .catch(err => {
                    console.log(err.message, err.code);
                });
        } else {
            console.log('Type the password')
            Alert.alert('Type the password')
        }
    }

    //----------------Render flatlist------------------
    function renderItem({ item }) {
        return (
            <View>
                <Text> {'=> '} {item.certificateName}</Text>
            </View>
        )
    }

    //-------------Modal-----------
    function CancleModal() {
        return (
            onChangeText(''),
            setPasswordModalState(false),
            setSelectedFile({}),
            Alert.alert('Cancel!')
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <Modal
                nimationType="fade"
                transparent={true}
                visible={uploadModalLoading}>
                <View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                    <View>
                        <ActivityIndicator size='large' color='white' animating={true} />
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={passwordModalState}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalBox}>
                        <Text>Password</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChangeText}
                            value={text}
                        />
                        <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                            <Button title='cancel' onPress={() => CancleModal()} />
                            <Text>  </Text>
                            <Button title='submit' onPress={() => handleSubmit()} />
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={styles.showCertificate}>
                <Text style={styles.headerText}>Your certificate</Text>
                <Text />
                <FlatList data={certificate} renderItem={renderItem} />
                <ActivityIndicator size='large' color='black' animating={isLoading} />
            </View>
            <View style={styles.buttonBox}>
                <Text>{selectedFile.name}</Text>
                <TouchableOpacity style={styles.buttonAdd} onPress={() => handleChooseFile()}>
                    <Text><Icon name='folder' /> Choose File</Text>
                </TouchableOpacity>
                <Text />
            </View>
        </View >
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
        paddingBottom: 30,
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

    //Modal---------
    input: {
        height: 50,
        width: 150,
        borderWidth: 2,
        marginVertical: 10,
    },
    modalContainer: {
        flex: 1,
        //borderWidth: 1,
        backgroundColor: 'rgba(135, 135, 135, 0.8)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalBox: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 50,
        backgroundColor: 'white',
        width: 300,
        height: 200,
        borderRadius: 15,
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
