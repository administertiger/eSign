import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Button, ActivityIndicator, Modal, Dimensions } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'rn-fetch-blob'
import base64 from 'base64-js'
import { authorize } from 'react-native-app-auth';
import { Configs } from '../components/configs';

const initialState = {
    hasLoggedInOnce: false,
    provider: '',
    accessToken: '',
    accessTokenExpirationDate: '',
    refreshToken: ''
};

function DocumentsScreen({ navigation }) {
    const API_URL = 'https://ws.esigns.cloud';

    const [authState, setAuthState] = useState(initialState);
    const [showModalPdf, setShowModalPdf] = useState(false);

    useEffect(() => {
        //handleAuthorize(Configs.adb2c);
        getList();
    }, []);

    //---------------------------Get user token-------------------------
    const handleAuthorize = useCallback(
        async provider => {
            try {
                //const config = Configs[provider];
                const config = provider
                const newAuthState = await authorize(config);

                setAuthState({
                    hasLoggedInOnce: false,
                    provider: provider,
                    ...newAuthState
                });

                getList(newAuthState.accessToken);
                console.log('User token: ', newAuthState);

            } catch (error) {
                Alert.alert('Failed to log in', error.message);
            }
        }
    );

    //-----------------------Get & Limit list items---------------------
    const [documents, setDocuments] = useState([]);
    const [itemCount, setItemCount] = useState(9);
    const [isLoading, setIsLoading] = useState(true)

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
                    console.log('documents = ', merge)
                    setDocuments(merge);
                }

            }, (error) => {
                console.log(error);
            })
    }

    function handleLoadMore() {
        const addNumber = 10;

        if (itemCount < documents.length) {
            setItemCount(itemCount + addNumber);
            console.log('count = ', itemCount)
            console.log('isLoading = ', isLoading)
        } else if ((itemCount + addNumber) >= documents.length) {
            console.log("You've reached the end!!")
            console.log('isLoading = ', isLoading)
            setIsLoading(false);
        }
    }

    function renderFooter() {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size='large' color='black' animating={isLoading} />
            </View>
        )
    }

    //-----------------------Handle download------------------------
    function handleDownload(item) {

        //Get file name without extension (.pdf)
        let filename = ''
        const name = item.file.displayName;
        for (let i = 0; i < name.length - 4; i++) {
            //console.log('i = ', i)
            //console.log('letter = ', name[i])
            filename += name[i];
            //console.log('filename =', filename)
        }

        const { fs } = RNFetchBlob
        let DownloadDir = fs.dirs.DownloadDir // this is the Downloads directory.
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true, //uses the device's native download manager.
                notification: true,
                title: item.file.displayName, // Title of download notification.
                path: DownloadDir + '/' + filename + "." + item.file.extension, // this is the path where your download file will be in
                description: 'Downloading file.',

            }
        }
        RNFetchBlob.config(options)
            .fetch('GET', "https://ws.esigns.cloud/files/" + item.id, { 'Authorization': 'Bearer ' + global.token, })
            .then((res) => {
                console.log("Success = ", res);
            })
            .catch((err) => { console.log('error', err) }) // To execute when download cancelled and other errors
    }

    //----------------------Render Items---------------------------

    function RenderItem({ item }) {
        return (
            <View style={{ borderBottomWidth: 1, marginBottom: 25, paddingBottom: 10 }}>
                <View style={styles.listBox}>
                    <Text numberOfLines={1} style={styles.listText}>{item.file.displayName}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity>
                            <Icon name='search' color='black' size={25} />
                        </TouchableOpacity>
                        <Text>       </Text>
                        <TouchableOpacity onPress={() => handleDownload(item)}>
                            <Icon name='download' color='black' size={25} />
                        </TouchableOpacity>
                        <Text>   </Text>
                        <Menu>
                            <MenuTrigger style={{ width: 40 }} >
                                <Icon name='align-justify' size={25} style={{ marginHorizontal: 12, width: 30 }} />
                            </MenuTrigger>
                            <MenuOptions>
                                <View style={{ borderBottomWidth: 1 }} >
                                    <MenuOption onSelect={() => alert(`Not called`)} disabled={true}>
                                        <View style={styles.menuBox}>
                                            <Text>File Name : </Text>
                                            <Text style={{ width: 110, color: '#919191' }}>{item.file.displayName}</Text>
                                        </View>
                                        <View style={styles.menuBox}>
                                            <Text>File Size : </Text>
                                            <Text style={styles.details}>{Math.ceil(item.file.size / 1000)} kb</Text>
                                        </View>
                                        <View style={styles.menuBox}>
                                            <Text>Date : </Text>
                                            <Text style={styles.details}>{item.file.lastModified}</Text>
                                        </View>
                                        <View style={styles.menuBox}>
                                            <Text>Certificate by : </Text>
                                            <Text style={styles.details}>{item.certificateName}</Text>
                                        </View>
                                    </MenuOption>
                                </View>
                            </MenuOptions>
                        </Menu>
                    </View>
                </View>
            </View>
        )
    }
    //-------------------------------------------------------------

    return (
        <MenuProvider>
            <View style={styles.box}>
                <Text style={styles.header}>Your Documents</Text>
                <Text />
                <FlatList
                    data={documents.slice(0, itemCount)}
                    renderItem={RenderItem}
                    ListFooterComponent={renderFooter}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0} />
            </View>
        </MenuProvider>
    );
}

const styles = StyleSheet.create({
    box: {
        flex: 1,
        paddingHorizontal: 10,
        marginBottom: 50,
        //justifyContent: 'center',
        //borderWidth: 1,
    },
    listBox: {
        //borderBottomWidth: 1,
        marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    listText: {
        width: 230,
        fontSize: 25,
        fontFamily: 'Verdana'
    },
    header: {
        textAlign: 'center',
        paddingVertical: 15,
        fontSize: 25,
        fontWeight: 'bold',
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

export default DocumentsScreen;