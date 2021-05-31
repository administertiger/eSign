import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View, Text, Button, TouchableOpacity, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

import Pdf from 'react-native-pdf';

function WorkScreen({ navigation }) {
    const API_URL = 'https://ws.esigns.cloud';

    const [file, setFile] = useState([])

    //------------------------handle choos file--------------------------

    useEffect(() => {
        handleChooseFile();
    }, [])

    const handleChooseFile = async () => {
        //Opening Document Picker for selection of one file
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });

            console.log('res = ', res)
            //Setting the state to show single file attributes
            setFile({ name: res.name, uri: res.uri, type: res.type, size: res.size });
            global.fileName = res.name;
        } catch (err) {
            //Handling any exception (If any)
            if (DocumentPicker.isCancel(err)) {
                //If user canceled the document selection
                alert('Canceled from single doc picker');
                navigation.navigate('HomeScreen')
            } else {
                //For Unknown Error
                alert('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    };

    //----------------------------Show PDF-----------------------------

    const ShowPdf = () => {
        const source = { uri: file.uri, cache: true };

        return (
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
        )
    }

    //----------------------handleUploadFile----------------------
    function handleUploadFile() {
        console.log('file = ', file);

        let formData = new FormData();
        formData.append('file', file);

        axios({
            method: 'post',
            url: API_URL + '/documents/pdf/digitalsign',
            data: formData._parts.length > 0 ? formData : null,
            headers: {
                'Authorization': 'Bearer ' + global.token,
                "content-type": "multipart/form-data"
            },
        })
            .then((response) => {
                console.log('response = ', response);
                console.log('Done? = ', 'DONE!!');

                //Get status of each file.
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
                            Alert.alert('complete')
                            navigation.navigate('DocumentsScreen')
                        } else if (response.data.status === 'fail') {
                            clearInterval(myInterval);
                            console.log('Fail T_T')
                            Alert.alert('Fail T_T')
                        }
                    }), (error) => {
                        console.log(error);
                    }
                }, 1000)

            }, (error) => {
                console.log(error);
            })
    }

    return (
        <View style={styles.container} >
            {file.uri ? (
                <View >
                    <ShowPdf />
                    <View style={{ position: 'absolute', top: 20, left: 0, right: 0, alignItems: 'center' }}>
                        <TouchableOpacity style={styles.addFileButton} onPress={() => handleChooseFile()}>
                            <Text style={styles.signText}>New File </Text>
                            <Icon name='folder-open' size={18} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.singButtonBox} >
                        <TouchableOpacity style={styles.singButton} onPress={() => handleUploadFile()}>
                            <Text style={styles.signText}>Sign </Text>
                            <Icon name='pencil' size={20} />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : null}
        </View>
    )
}

//Header---------
export function WorkHeader() {
    return (
        <View style={styles.homeHeader}>
            <Text style={styles.homeHeaderText}>Your Work</Text>
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
        backgroundColor: 'rgba(196, 196, 196, 0.7)'
    },
    signText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'rgba(46, 46, 46, 1)'
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
        left: -30,
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
});

export default WorkScreen;



