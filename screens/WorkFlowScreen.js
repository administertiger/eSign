import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import uuid from 'react-native-uuid';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';

//Components

function WorkFlowScreen({ navigation }) {
    const API_URL = 'https://ws.esigns.cloud';

    //--------------------------handleChooseFile-----------------------------
    const [file, setFile] = useState([]) //File state
    const [status, setStatus] = useState([])

    const handleChooseFile = async () => {
        //Opening Document Picker for selection of one file
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });

            //Setting the state to show single file attributes
            setFile(prevItems => {
                return [{ id: uuid.v4(), name: res.name, uri: res.uri, type: res.type, size: res.size }, ...prevItems];
            });

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

    useEffect(() => {
        console.log('status: ', status)
        const merge = file.map((a, i) => Object.assign({}, a, status[i]));
        console.log('merge = ', merge)
        setFile(merge);
    }, [status])

    //----------------------handleUploadFile----------------------
    function handleUploadFile() {
        console.log('file = ', file);

        file.forEach(file => {
            console.log('For each =', file)

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

                                setStatus(prevStatus => {
                                    return [...prevStatus, { status: 'Complete!' }]
                                })
                            } else if (response.data.status === 'processing') {


                            } else if (response.data.status === 'fail') {
                                clearInterval(myInterval);

                                setStatus(prevStatus => {
                                    return [...prevStatus, { status: 'Fail T_T' }]
                                })
                            }
                        }), (error) => {
                            console.log(error);
                        }
                    }, 1000)


                }, (error) => {
                    console.log(error);
                })
        })
    }

    //--------------------delete item from state-------------------

    function deleteItem(id) {
        return (
            setFile(prevItems => {
                return prevItems.filter(item => item.id != id)
            })
        )
    }

    //----------------------Render Items---------------------------

    //Get current date.
    const [currentDate, setCurrentDate] = useState('')
    useEffect(() => {
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();

        setCurrentDate(date + '-' + month + '-' + year); //format: dd-mm-yy
    }, [])

    function renderItem({ item }) {
        return (
            <View>
                <View style={styles.listBox}>
                    <Text style={styles.listText} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.listBoxDetail}>
                        <Text>{item.status}</Text>
                        <Menu>
                            <MenuTrigger style={{ width: 40 }} >
                                <Icon name='align-justify' size={20} style={{ marginHorizontal: 12, width: 30 }} />
                            </MenuTrigger>
                            <MenuOptions>
                                <View style={{ borderBottomWidth: 1 }} >
                                    <MenuOption onSelect={() => alert(`Not called`)} disabled={true}  >
                                        <View style={styles.menuBox}>
                                            <Text>File Name : </Text>
                                            <Text style={{ width: 110, color: '#919191' }}>{item.name}</Text>
                                        </View>
                                        <View style={styles.menuBox}>
                                            <Text>File Size : </Text>
                                            <Text style={styles.details}>{item.size} bytes</Text>
                                        </View>
                                        <View style={styles.menuBox}>
                                            <Text>Date : </Text>
                                            <Text style={styles.details}>{currentDate}</Text>
                                        </View>
                                    </MenuOption>
                                </View>
                                <MenuOption onSelect={() => alert(`Save`)} text='Save' />
                                <MenuOption onSelect={() => { deleteItem(item.id) }} >
                                    <Text style={{ color: 'red' }}>Delete</Text>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </View>

                </View>
            </View>
        )
    }

    //-------------------------Reder-----------------------------

    return (
        <MenuProvider>

            <View style={styles.box}>
                <TouchableOpacity style={styles.buttonDropFile}
                    onPress={() => handleChooseFile()}>
                    <Icon name='folder' />
                    <Text>
                        CHOOSE FILE
                </Text>
                </TouchableOpacity>

                <View style={styles.box2}>
                    <Text style={styles.title}>Documents</Text>
                    <FlatList data={file} renderItem={renderItem} />
                    <View style={styles.title2} >
                        <Text style={{ fontSize: 25 }}>Recipents</Text>
                        <TouchableOpacity style={{ flexDirection: 'row' }} >
                            <Icon name='user-plus' style={{ marginTop: 8, marginHorizontal: 0 }} size={25} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.boxSign} >

                    <TouchableOpacity style={styles.buttonSign} onPress={() => handleUploadFile()}>
                        <Text>Sign <Icon name='arrow-right' /></Text>
                    </TouchableOpacity>
                </View>
            </View>

        </MenuProvider>
    );
}

const styles = StyleSheet.create({
    box: {
        flex: 1,
        //borderWidth: 2,
        marginTop: 10,
        marginBottom: 30,
    },
    buttonDropFile: {
        marginTop: 30,
        marginHorizontal: 30,
        borderWidth: 2,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#748c94',
        borderRadius: 4,
        borderStyle: 'dashed',
    },

    //--------------List items--------------

    box2: {
        marginHorizontal: 15,
    },
    listBox: {
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    listBoxDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 25,
        marginBottom: 5,
        marginTop: 25,
    },
    title2: {
        flexDirection: 'row',
        fontSize: 25,
        marginBottom: 5,
        marginTop: 25,
        justifyContent: 'space-between',
    },
    listText: {
        marginHorizontal: 20,
        marginBottom: 5,
        width: 150,
        fontSize: 20,
    },
    boxSign: {
        flex: 1,
        //borderWidth: 1,
        justifyContent: 'flex-end',
    },
    buttonSign: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightgrey',
        marginHorizontal: 30,
        height: 50,
    },

    //--------------Menu--------------

    menuBox: {
        flexDirection: 'row',
        marginBottom: 5
    },
    details: {
        color: '#919191',
    }
})

export default WorkFlowScreen;