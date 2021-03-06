import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Button, Modal, TextInput, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Icon2 from 'react-native-vector-icons/dist/FontAwesome5';
import IconAnt from 'react-native-vector-icons/dist/AntDesign';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import * as RNFS from 'react-native-fs';
import base64 from 'react-native-base64'
import { useTranslation } from 'react-i18next';
import { refreshToken } from '../components/refreshToken';

const forge = require('node-forge');

function Certificate({ navigation }) {



    const API_URL = 'https://ws.esigns.cloud';

    const { t, i18n } = useTranslation();

    const [certificate, setCertificate] = useState([]);
    const [text, onChangeText] = useState('');
    const [selectedFile, setSelectedFile] = useState({});
    const [currentCertificate, setCerrentCertificate] = useState({});
    const [currentCertificateDate, setCurrentCertificateDate] = useState({});
    const [selectedCertificate, setSelectedCertificate] = useState({})

    //Modal
    const [uploadModalLoading, setUploadModalLoading] = useState(false);
    const [passwordModalState, setPasswordModalState] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [p12lModal, setP12Modal] = useState(false);
    const [emptyPasswordlModal, setEmptyPasswordModal] = useState(false);
    const [invalidPasswordlModal, setInvalidPasswordModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [beforeDeleteModal, setBeforeDeleteModal] = useState(false)


    useState(() => {
        //Refrsh token
        refreshToken();

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
                console.log(response);
                if (response.data) {
                    console.log('certificate = ', response.data.certificates)
                    setCertificate(response.data.certificates)
                    setUploadModalLoading(false);
                    setFooterLoading(false);

                    const testCer = response.data.certificates
                    const obj = testCer.find(item => item.id === response.data.settings.defaultCertificateId)
                    console.log('obj = ', obj)
                    console.log('obj validity = ', obj.validity)
                    console.log('Current certificate = ', obj.certificateName)
                    setCerrentCertificate(obj);
                    const createTimeFormat = obj.validity.notBefore[11] + obj.validity.notBefore[12] + obj.validity.notBefore[13] + obj.validity.notBefore[14] + obj.validity.notBefore[15] + obj.validity.notBefore[16] + obj.validity.notBefore[17] + obj.validity.notBefore[18]
                    const createDateFormat = obj.validity.notBefore[8] + obj.validity.notBefore[9] + '/' + obj.validity.notBefore[5] + obj.validity.notBefore[6] + '/' + obj.validity.notBefore[0] + obj.validity.notBefore[1] + obj.validity.notBefore[2] + obj.validity.notBefore[3]
                    const expireDateFormat = obj.validity.notAfter[8] + obj.validity.notAfter[9] + '/' + obj.validity.notAfter[5] + obj.validity.notAfter[6] + '/' + obj.validity.notAfter[0] + obj.validity.notAfter[1] + obj.validity.notAfter[2] + obj.validity.notAfter[3]
                    const expireTimeFormat = obj.validity.notAfter[11] + obj.validity.notAfter[12] + obj.validity.notAfter[13] + obj.validity.notAfter[14] + obj.validity.notAfter[15] + obj.validity.notAfter[16] + obj.validity.notAfter[17] + obj.validity.notAfter[18]
                    setCurrentCertificateDate({ 'notBefore': createDateFormat + ' ' + createTimeFormat, 'notAfter': expireDateFormat + ' ' + expireTimeFormat })
                    console.log(currentCertificateDate);


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
                setP12Modal(true)
                setSelectedFile({})

            }
        } catch (err) {
            //Handling any exception (If any)
            if (DocumentPicker.isCancel(err)) {
                //If user canceled the document selection
                //alert('Canceled from single doc picker');
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
            //Alert.alert('Upload success!')
            setSuccessModal(true);
            setSelectedCertificate({})
        }, (error) => {
            console.log(error);
            console.log('Upload Fail T_T')
        })
    }

    //----------Submit-----------
    function handleSubmit() {
        refreshToken();

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
                        onChangeText('')
                    }

                } catch (error) {

                    console.log(error);
                    console.log('Fail!555');
                    setPasswordModalState(false);
                    //Alert.alert('Invalid password')
                    setInvalidPasswordModal(true);
                    setSelectedFile({});
                    onChangeText('');

                };
            })
                .catch(err => {
                    console.log(err.message, err.code);
                });
        } else {
            console.log('Type the password')
            //Alert.alert('Type the password')
            setEmptyPasswordModal(true);
        }
    }

    //---------------------------Delete certificate---------------------------
    function DeleteModal(item) {
        setBeforeDeleteModal(true);
        setSelectedCertificate(item);
        console.log('selected =', selectedCertificate)
    }

    function DeleteCertificate(id) {
        setBeforeDeleteModal(false)
        setUploadModalLoading(true)
        axios({
            method: 'DELETE',
            url: API_URL + '/accounts/certificates/' + id,
            headers: {
                'Authorization': 'Bearer ' + global.token,
            }
        }).then((response) => {
            console.log('delete = ', response)
            getUserProfile();
            //Alert.alert('Delete!')
            setDeleteModal(true);
        }, (error) => {
            console.log(error);
            console.log('Upload Fail T_T')
        })
    }

    function cancelDeleteModal() {
        setBeforeDeleteModal(false);
        setSelectedCertificate({});
    }

    //------------------------------Change Certification--------------------------
    function changeCertification(id) {
        setUploadModalLoading(true);

        axios({
            method: 'PATCH',
            url: API_URL + '/accounts',
            headers: {
                'Authorization': 'Bearer ' + global.token,
                "content-type": "application/json",
            },
            data: {
                "replace": "/settings/defaultCertificateId",
                "value": id
            }
        }).then((response) => {
            console.log('response = ', response)
            getUserProfile();
            //Alert.alert('Success!')
        }, (error) => {
            console.log(error)
        })
    }

    function Detail() {
        setDetailModal(true)
    }

    //----------------Render flatlist------------------
    function renderItem({ item }) {

        const createDateFormat = item.validity.notBefore[8] + item.validity.notBefore[9] + '/' + item.validity.notBefore[5] + item.validity.notBefore[6] + '/' + item.validity.notBefore[0] + item.validity.notBefore[1] + item.validity.notBefore[2] + item.validity.notBefore[3]
        const createTimeFormat = item.validity.notBefore[11] + item.validity.notBefore[12] + item.validity.notBefore[13] + item.validity.notBefore[14] + item.validity.notBefore[15] + item.validity.notBefore[16] + item.validity.notBefore[17] + item.validity.notBefore[18]
        const expireDateFormat = item.validity.notAfter[8] + item.validity.notAfter[9] + '/' + item.validity.notAfter[5] + item.validity.notAfter[6] + '/' + item.validity.notAfter[0] + item.validity.notAfter[1] + item.validity.notAfter[2] + item.validity.notAfter[3]
        const expireTimeFormat = item.validity.notAfter[11] + item.validity.notAfter[12] + item.validity.notAfter[13] + item.validity.notAfter[14] + item.validity.notAfter[15] + item.validity.notAfter[16] + item.validity.notAfter[17] + item.validity.notAfter[18]

        if (item.id === currentCertificate.id) {
            return <View />
        }

        return (

            <View style={styles.renderBox}>

                <View >
                    <Text numberOfLines={1} style={{ fontSize: 20, marginRight: 0, paddingRight: 50 }} >{item.certificateName}</Text>
                    <View style={{ paddingLeft: 5, marginRight: 0, }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.headerDetail}>{t('Serial number')}: </Text>
                            <Text style={styles.detail}>{item.serialNumber}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.headerDetail}>{t('Email')}: </Text>
                            <Text style={styles.detail}>{item.email}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.headerDetail}>{t('Start date')}: </Text>
                            <Text style={styles.detail}>{createDateFormat} {createTimeFormat}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.headerDetail}>{t('Expired date')}: </Text>
                            <Text style={styles.detail}>{expireDateFormat} {expireTimeFormat}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', position: 'absolute', right: 10 }}>
                    <TouchableOpacity onPress={() => changeCertification(item.id)} >
                        <IconAnt name='checkcircle' size={40} />
                    </TouchableOpacity>
                    <Text>  </Text>
                    <TouchableOpacity onPress={() => DeleteModal(item)} >
                        <IconAnt name='closecircle' size={40} />
                    </TouchableOpacity>
                </View>

            </View >

        )
    }

    //-------------Modal-----------
    function CancleModal() {
        return (
            onChangeText(''),
            setPasswordModalState(false),
            setSelectedFile({})
            //Alert.alert('Cancel!')
        )
    }
    //--------------Footer---------------
    const [footerLoading, setFooterLoading] = useState(true)

    function renderFooter() {
        return (
            <View>
                <ActivityIndicator size='large' color='black' animating={footerLoading} />
                <View style={{ marginBottom: 50 }} />
            </View>
        )
    }

    function handleLoadMore() {
        setFooterLoading(false);
    }

    //-------------------------------------
    function ShowCurrentCertificate() {
        if (currentCertificate == {}) {
            return null;
        } else {
            return (
                <TouchableOpacity style={{ paddingVertical: 15, backgroundColor: 'white', elevation: 3, marginHorizontal: 10 }} onPress={() => Detail()} >
                    <Text style={styles.currentCertificate}><Icon2 name='user-check' size={14} color='#54c489' />  {currentCertificate.certificateName}</Text>
                </TouchableOpacity>
            )
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {/* uploadModalLoading */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={uploadModalLoading}>
                <View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                    <View>
                        <ActivityIndicator size='large' color='white' animating={true} />
                    </View>
                </View>
            </Modal>
            {/* passwordModal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={passwordModalState}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalBox}>
                        <Text style={styles.fileName}>{selectedFile.name}</Text>
                        <Text style={{ fontSize: 16 }}>{t('Password')}</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChangeText}
                            value={text}
                        />
                        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                            <TouchableOpacity onPress={() => handleSubmit()}>
                                <Text style={styles.modalSubmitButton}>{t('Submit')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => CancleModal()}>
                                <Text style={styles.modalCancelButton}>{t('Cancel')}</Text>
                            </TouchableOpacity>


                        </View>
                    </View>
                </View>
            </Modal>
            {/* detailModal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={detailModal}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                    <View style={styles.modalBox}>

                        <Text style={{ fontSize: 20, textAlign: 'center', paddingBottom: 5 }} >{currentCertificate.certificateName}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.headerDetail}>{t('Serial number')}: </Text>
                            <Text style={styles.detail}>{currentCertificate.serialNumber}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.headerDetail}>{t('Email')}: </Text>
                            <Text style={styles.detail}>{currentCertificate.email}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.headerDetail}>{t('Start date')}: </Text>
                            <Text style={styles.detail}>{currentCertificateDate.notBefore}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.headerDetail}>{t('Expired date')}: </Text>
                            <Text style={styles.detail}>{currentCertificateDate.notAfter}</Text>
                        </View>

                        <View style={{ paddingTop: 10 }}>
                            <Button title='         OK         ' onPress={() => setDetailModal(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
            {/* pleaseSelecteP12lModal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={p12lModal}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={styles.alertBox}>
                        <Text style={styles.alertText}>{t('Please choose only p12 file')}</Text>
                        <TouchableOpacity style={styles.alertButton} onPress={() => setP12Modal(false)}>
                            <Text style={styles.alertButtonText}>{t('Ok')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* emptyPasswordlModal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={emptyPasswordlModal}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={styles.alertBox}>
                        <Text style={styles.alertText}>{t('Type the password')}</Text>
                        <TouchableOpacity style={styles.alertButton} onPress={() => setEmptyPasswordModal(false)}>
                            <Text style={styles.alertButtonText}>{t('Ok')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* invalidPasswordlModal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={invalidPasswordlModal}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={styles.alertBox}>
                        <Text style={styles.alertText}>{t('Invalid password')}</Text>
                        <TouchableOpacity style={styles.alertButton} onPress={() => setInvalidPasswordModal(false)}>
                            <Text style={styles.alertButtonText}>{t('Ok')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* successModal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={successModal}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={styles.alertBox}>
                        <Text style={styles.alertText}>{t('SuccessCertificate')}</Text>
                        <TouchableOpacity style={styles.alertButton} onPress={() => setSuccessModal(false)}>
                            <Text style={styles.alertButtonSuccess}>{t('Ok')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* deleteModal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={deleteModal}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={styles.alertBox}>
                        <Text style={styles.alertText}>{t('DeleteCertificate')}</Text>
                        <TouchableOpacity style={styles.alertButton} onPress={() => setDeleteModal(false)}>
                            <Text style={styles.alertButtonSuccess}>{t('Ok')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* BeforeDeleteModal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={beforeDeleteModal}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={styles.alertBox}>
                        <Text style={{ fontSize: 19, paddingBottom: 5 }}>{t('Do you want to delete')} ? </Text>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>"{selectedCertificate.certificateName}" </Text>

                        <View style={styles.alertButton}>
                            <TouchableOpacity style={{ paddingRight: 20 }} onPress={() => DeleteCertificate(selectedCertificate.id)}>
                                <Text style={styles.alertButtonSuccess}>{t('Ok')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => cancelDeleteModal()}>
                                <Text style={styles.alertButtonText}>{t('Cancel')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={{ paddingVertical: 10, marginBottom: 10, }}>
                <Text style={{ textAlign: 'center', paddingVertical: 10, fontSize: 22 }}>Your certificate</Text>
                <ShowCurrentCertificate />
            </View>

            <View style={styles.showCertificate}>
                <FlatList data={certificate}
                    renderItem={renderItem}
                    ListFooterComponent={renderFooter}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0} />
            </View>
            <View style={styles.buttonBox}>
                <TouchableOpacity style={styles.buttonAdd} onPress={() => handleChooseFile()}>
                    <Text style={{ color: 'white', fontSize: 17 }}><Icon name='folder' size={20} />  {t('Choose file')}</Text>
                </TouchableOpacity>

            </View>
        </View >
    )
}

//Header---------
export function CertificateHeader({ navigation }) {
    const { t, i18n } = useTranslation();

    return (
        <View style={styles.homeHeader}>
            <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.openDrawer()} >
                <Icon name='align-left' size={25} color='white' />
            </TouchableOpacity>
            <Text style={styles.homeHeaderText}><Icon2 name='pen-nib' size={25} />  {t('Certificates')}</Text>
        </View >
    )
}

const styles = StyleSheet.create({
    showCertificate: {
        //alignItems: 'center',
        //borderWidth: 1,
        //paddingTop: 10,
        paddingHorizontal: 20,
        flex: 1,
        //marginBottom: 90,
    },
    buttonBox: {
        //borderWidth: 1,
        //flex: 1,
        //justifyContent: 'flex-end',
        alignItems: 'center',
        //paddingBottom: 30,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    buttonAdd: {
        //borderWidth: 2,
        padding: 20,
        paddingHorizontal: 30,
        //height: 60,
        justifyContent: 'center',
        backgroundColor: '#54c489',
        elevation: 3,
        borderRadius: 20,
        position: 'absolute',
        bottom: 20,
        //right: 20

    },
    currentCertificate: {
        fontSize: 20,
        textAlign: 'center',
        paddingHorizontal: 10
    },

    //Modal---------
    input: {
        height: 40,
        width: 185,
        //borderWidth: 1,
        marginVertical: 10,
        //borderRadius: 20,
        elevation: 3,
        backgroundColor: '#e8e8e8'
    },
    modalContainer: {
        flex: 1,
        //borderWidth: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        //borderRadius: 10,
    },
    modalBox: {
        alignItems: 'center',
        justifyContent: 'center',
        //margin: 50,
        backgroundColor: 'white',
        width: Dimensions.get('window').width - 30,
        height: 220,
        //borderRadius: 5,
        elevation: 5,
        paddingHorizontal: 10,
    },
    fileName: {
        paddingBottom: 20,
        fontSize: 22,
        fontWeight: 'bold'
    },
    alertBox: {
        //alignItems: 'center',
        //justifyContent: 'center',
        backgroundColor: 'white',
        width: Dimensions.get('window').width - 70,
        height: 200,
        padding: 25,
        elevation: 5,
    },
    alertText: {
        fontSize: 19,

    },
    alertButtonText: {
        fontSize: 19,
        color: '#d44253',
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
    modalSubmitButton: {
        fontSize: 17,
        paddingHorizontal: 20,
        color: 'black',
    },
    modalCancelButton: {
        fontSize: 17,
        paddingHorizontal: 20,
        color: '#d44253',
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
    //Render items-------
    renderBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 3,
        //borderWidth: 1,
        borderRadius: 0,
        marginBottom: 15,
        padding: 10,
        //height: 80,
        paddingHorizontal: 15,
        backgroundColor: 'white',

    },
    detail: {
        color: 'black',
        opacity: 0.5,
        fontSize: 13,
    },
    headerDetail: {
        color: 'black',
    }
})

export default Certificate;
