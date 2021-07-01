import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View, Text, ActivityIndicator, TouchableOpacity, Alert, Modal, BackHandler, ScrollView } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { refreshToken } from '../components/refreshToken';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import a11yDark from 'react-syntax-highlighter/dist/esm/styles/prism/a11y-dark';

import Pdf from 'react-native-pdf';

var RNFS = require('react-native-fs');

function WorkScreen({ navigation }) {
    const API_URL = 'https://ws.esigns.cloud';

    const { t, i18n } = useTranslation();

    const [file, setFile] = useState({});
    const [loading, setLoading] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [p12lModal, setP12Modal] = useState(false);
    const [xmlText, setXmlText] = useState('')

    //-------------------Backhandler handle-------------------
    useEffect(() => {
        //Handle back button
        const backAction = () => {
            navigation.navigate('HomeDrawer');
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    //------------------------handle choose file--------------------------

    useEffect(() => {
        handleChooseFile();
        refreshToken();

    }, [])
    //useEffect(() => {
    //    console.log('file = ', file)
    //
    //}, [file])

    const handleChooseFile = async () => {
        //Opening Document Picker for selection of one file
        try {
            const results = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            })

            console.log(results);
            setFile(results)

            if (results.type === 'text/xml') {

                RNFS.readFile(results.uri)
                    .then((file) => {
                        setXmlText(file)
                        console.log(file)
                        console.log('XML!!!')
                    })
                    .catch((error) => console.log('err: ' + error));
            } else if (results.type === 'application/pdf') {

                console.log('PDF!!!')
            } else {
                setP12Modal(true);
            }



        } catch (err) {
            //Handling any exception (If any)
            if (DocumentPicker.isCancel(err)) {
                //If user canceled the document selection
                //alert('Canceled from single doc picker');
                console.log('cancel')
                navigation.navigate('HomeDrawer')
            } else {
                //For Unknown Error
                alert('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    };

    //----------------------------Show selected file-----------------------------

    function ShowPdf() {
        const source = { uri: file.uri, cache: true };

        return (
            <View>
                <Pdf
                    source={source}
                    onLoadComplete={(numberOfPages, filePath) => {
                        console.log(`number of pages: ${numberOfPages}`);
                        //setTotalPage(numberOfPages);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        console.log(`current page: ${page}`);
                        //setCurrentPage(page);  //set the cuurentPage
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link presse: ${uri}`)
                    }}
                    style={styles.pdf} />
                <View style={styles.singButtonBox} >
                    <TouchableOpacity style={styles.singButton} onPress={() => handleUpload()}>
                        <Text style={styles.signText}>{t('Sign')} </Text>
                        <Icon2 name='pen' size={20} style={{ color: 'white' }} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    function ShowXml() {
        return (
            <View style={{ backgroundColor: 'rgba(43, 43, 43, 0.9)' }}>
                <View style={{ flex: 1, margin: -7, marginTop: -22, marginBottom: 5 }}>
                    <SyntaxHighlighter
                        //language='javascript'
                        //style={a11yDark}
                        highlighter={"prism" || "hljs"}>
                        {xmlText}
                    </SyntaxHighlighter>
                </View>
                <View style={{ alignItems: 'center', marginBottom: 25 }} >
                    <TouchableOpacity style={styles.singButton} onPress={() => handleUpload()}>
                        <Text style={styles.signText}>{t('Sign')} </Text>
                        <Icon2 name='pen' size={20} style={{ color: 'white' }} />
                    </TouchableOpacity>
                </View>
            </View>

        )
    }

    function DisplayFile() {
        if (file.type === 'application/pdf') {
            return ShowPdf();
        } else if ((file.type === 'text/xml')) {
            return ShowXml();
        }
        return true;
    }

    //----------------------handleUploadFile----------------------
    function handleUploadPdf() {
        console.log('file = ', file);
        setLoading(true);

        let formData = new FormData();
        formData.append('file', file);

        console.log('formData = ', formData)

        axios({
            method: 'POST',
            url: API_URL + '/documents/pdf/digitalsign',
            data: formData._parts.length > 0 ? formData : null,
            headers: {
                'Authorization': 'Bearer ' + global.token,
                "content-type": "multipart/form-data"
            },
        })
            .then((response) => {
                console.log('responsePost = ', response);
                console.log('Done? = ', 'DONE!!');

                //Get status of the file.
                let myInterval = setInterval(() => {
                    axios({
                        method: 'GET',
                        url: API_URL + '/jobs/' + response.data.id,
                        headers: { 'Authorization': 'Bearer ' + global.token }
                    }).then((response) => {
                        console.log('Jobs = ', response.data.status)
                        if (response.data.status === 'complete') {
                            clearInterval(myInterval);
                            console.log('Complete!')
                            setSuccessModal(true);
                            setLoading(false);
                            //navigation.navigate('DocumentsDrawer')
                        } else if (response.data.status === 'fail') {
                            clearInterval(myInterval);
                            console.log('Fail T_T')
                            Alert.alert('Fail T_T')
                            setLoading(false);
                        }
                    }), (error) => {
                        console.log(error);
                    }
                }, 1000)

            }, (error) => {
                console.log(error);
            })
    }
    function handleUploadXml() {
        console.log('file = ', file);
        setLoading(true);

        let formData = new FormData();
        formData.append('file', file);

        console.log('formData = ', formData)

        axios({
            method: 'POST',
            url: API_URL + '/documents/xml/digitalsign',
            data: formData._parts.length > 0 ? formData : null,
            headers: {
                'Authorization': 'Bearer ' + global.token,
                "content-type": "multipart/form-data"
            },
        })
            .then((response) => {
                console.log('responsePost = ', response);
                console.log('Done? = ', 'DONE!!');

                //Get status of the file.
                let myInterval = setInterval(() => {
                    axios({
                        method: 'GET',
                        url: API_URL + '/jobs/' + response.data.id,
                        headers: { 'Authorization': 'Bearer ' + global.token }
                    }).then((response) => {
                        console.log('Jobs = ', response.data.status)
                        if (response.data.status === 'complete') {
                            clearInterval(myInterval);
                            console.log('Complete!')
                            setSuccessModal(true);
                            setLoading(false);
                            //navigation.navigate('DocumentsDrawer')
                        } else if (response.data.status === 'fail') {
                            clearInterval(myInterval);
                            console.log('Fail T_T')
                            Alert.alert('Fail T_T')
                            setLoading(false);
                        }
                    }), (error) => {
                        console.log(error);
                    }
                }, 1000)

            }, (error) => {
                console.log(error);
            })
    }

    function handleUpload() {
        if (file.type === 'application/pdf') {
            handleUploadPdf();
        } else {
            handleUploadXml();
            console.log('XML');
        }
    }

    return (
        <View style={styles.container} >
            {file.uri ? (
                <View >
                    {/* Loading modal */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={loading}>
                        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', flex: 1, justifyContent: 'center' }}>
                            <ActivityIndicator size='large' color='white' animating={true} />
                        </View>
                    </Modal>
                    {/* Complete modal */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={successModal}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={styles.alertBox}>
                                <Text style={styles.alertText}>{t('Digital sign success')}</Text>
                                <View style={styles.alertButton}>
                                    <TouchableOpacity style={{ paddingRight: 20 }} onPress={() => navigation.navigate('GotoWorkDrawer')}>
                                        <Text style={{ fontSize: 17, color: '#54c489', }}><Icon name='plus' size={15} /> {t('New file')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.navigate('DocumentsDrawer')}>
                                        <Text style={{ fontSize: 17, color: '#595959', }}><Icon name='folder' size={15} /> {t('Go to document')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    {/* pleaseSelectModal */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={p12lModal}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={styles.alertBox}>
                                <Text style={styles.alertText}>{t('Please choose only PDF or XML file')}</Text>
                                <TouchableOpacity style={styles.alertButton} onPress={() => { handleChooseFile(), setP12Modal(false) }}>
                                    <Text style={styles.alertButtonText}>{t('Ok')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <DisplayFile />

                </View>
            ) : null}
        </View>
    )
}

//Header---------
export function WorkHeader({ navigation }) {
    const { t, i18n } = useTranslation();

    return (
        <View style={styles.homeHeader}>
            <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.navigate('HomeDrawer')} >
                <Icon name='home' size={25} color='white' />
            </TouchableOpacity>
            <Text style={styles.homeHeaderText}>{t('Your work')}</Text>
            <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('GotoWorkDrawer')} >
                <Icon name='folder-open' size={25} color='white' />
            </TouchableOpacity>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'flex-start',
        alignItems: 'center',
        //borderWidth: 3,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    addFileButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 35,
        width: 200,
        borderRadius: 10,
        backgroundColor: 'rgba(157, 255, 77, 0.6)',
        flexDirection: 'row'
    },
    singButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 50,
        width: 250,
        borderRadius: 10,
        backgroundColor: '#54c489',
        elevation: 3,
    },
    signText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    },
    singButtonBox: {
        position: 'absolute',
        left: 0,
        bottom: 25,
        right: 0,
        alignItems: 'center',
    },

    //Header---------
    homeHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        //left: -30,
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
        //padding: 7,
        //borderRadius: 10,
    },
    homeHeaderText: {
        fontSize: 23,
        color: 'white'
    },
    //-------Modal---------------
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
        fontSize: 22,

    },
    alertButton: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flex: 1,
        paddingRight: 15,
        flexDirection: 'row',

    },
    alertButtonText: {
        fontSize: 19,
        color: '#d44253',
    },
});

export default WorkScreen;



