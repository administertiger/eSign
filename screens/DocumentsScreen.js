import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import uuid from 'react-native-uuid';
import { TouchableOpacity } from 'react-native-gesture-handler';

function DocumentsScreen({ navigation }) {
    const API_URL = 'https://ws.esigns.cloud';

    useEffect(() => {
        getList();
    }, []);

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

                    //To get file documents only.
                    const data = response.data;

                    const getFile = data.map((data) => data);
                    const getCertificate = data.map((data) => data.signatures[0]);  //Get certification
                    //console.log('getFile =', getFile)
                    //console.log('getCer =', getCertificate)

                    //Merge File docs array and Certification array togethor.
                    const merge = getFile.map((a, i) => Object.assign({}, a, getCertificate[i], { id: uuid.v4() }))
                    console.log('merge = ', merge)
                    setDocuments(merge);
                    //console.log('data = ', documents)
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
            console.log('END!!')
            setIsLoading(!isLoading)
            console.log('isLoading = ', isLoading)
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
    function handleDownload(id) {
        axios({
            method: 'get',
            url: API_URL + '/files/' + id,
            responseType: 'blob',
            headers: {
                'Authorization': 'Bearer ' + global.token,
                'Content-Type': 'application/pdf',
                'Accept': 'application/pdf',
            },
        })
            .then(response => {
                console.log('res =', response)

            })
            .catch(error => console.log(error));
    }

    //----------------------Render Items---------------------------

    function RenderItem({ item }) {
        return (
            <View style={{ borderBottomWidth: 1, marginBottom: 30 }}>
                <View style={styles.listBox}>
                    <Text numberOfLines={1} style={styles.listText}>{item.file.displayName}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                        <TouchableOpacity onPress={() => handleDownload('ea781ee9-6d56-45e2-9c97-4d73d36d927f')}>
                            <Icon name='download' color='black' size={20} />
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
                                            <Text style={styles.details}>{item.file.size} bytes</Text>
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
                                <MenuOption onSelect={() => alert(`Save`)} text='Save' />
                                <MenuOption onSelect={() => alert(`Delete`)}>
                                    <Text style={{ color: 'red' }}>Delete</Text>
                                </MenuOption>
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
                <Button title='refresh' onPress={getList} />
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
        width: 250,
        fontSize: 25,
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