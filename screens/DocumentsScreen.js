import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';

function DocumentsScreen({ navigation }) {
    const API_URL = 'https://ws.esigns.cloud';

    useEffect(() => {
        getList();
    });

    const [doucuments, setDocuments] = useState([])

    function getList() {
        axios.get(API_URL + '/documents',  //Documents API
            {
                headers: {
                    'Authorization': 'Bearer ' + global.token
                }
            })
            .then((response) => {
                //console.log(response);
                if (response.data) {
                    //console.log('Documents List: ', response.data);

                    //To get file documents only.
                    const data = response.data;
                    let getFile = data.map((data) => data.file);
                    //console.log('File = ', getFile)

                    setDocuments(getFile);
                    //console.log('doc = ', doucuments)
                }

            }, (error) => {
                console.log(error);
            })
    }

    //----------------------Render Items---------------------------

    function RenderItem({ item }) {
        return (
            <View style={{ borderBottomWidth: 1, marginBottom: 15 }}>
                <View style={styles.listBox}>
                    <Text numberOfLines={1} style={styles.listText}>{item.displayName}</Text>

                    <Menu>
                        <MenuTrigger style={{ width: 40 }} >
                            <Icon name='align-justify' size={15} style={{ marginHorizontal: 12 }} />
                        </MenuTrigger>
                        <MenuOptions>
                            <View style={{ borderBottomWidth: 1 }} >
                                <MenuOption onSelect={() => alert(`Not called`)} disabled={true}  >
                                    <View style={styles.menuBox}>
                                        <Text>File Name : </Text>
                                        <Text style={{ width: 110, color: '#919191' }}>{item.displayName}</Text>
                                    </View>
                                    <View style={styles.menuBox}>
                                        <Text>File Size : </Text>
                                        <Text style={styles.details}>{item.size}kb</Text>
                                    </View>
                                    <View style={styles.menuBox}>
                                        <Text>Date : </Text>
                                        <Text style={styles.details}>{item.lastModified}</Text>
                                    </View>
                                </MenuOption>
                            </View>
                            <MenuOption onSelect={() => alert(`Save`)} text='Save' />
                            <MenuOption onSelect={() => alert(`Save`)}>
                                <Text style={{ color: 'red' }}>Delete</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </View>
            </View>
        )
    }
    //-------------------------------------------------------------

    return (
        <MenuProvider>
            <View style={styles.box}>
                <Text style={styles.header}>Your Documents</Text>


                <FlatList data={doucuments} renderItem={RenderItem} keyExtractor={(item => item.lastModified)} />

            </View>
        </MenuProvider>
    );
}

const styles = StyleSheet.create({
    box: {
        flex: 1,
        paddingHorizontal: 10,
        marginBottom: 50,
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
        fontSize: 20,
    },
    header: {
        textAlign: 'center',
        paddingVertical: 15,
        fontSize: 25,
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