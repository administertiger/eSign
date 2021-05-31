import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import axios from 'axios';
import { authorize } from 'react-native-app-auth';
import { Configs } from '../components/configs';

function HomeScreen({ navigation }) {
    useEffect(() => {
        //console.log('token =', global.token)
        //console.log('name: ', global.name)
    }, [])

    function editProfile() {
        axios
    }

    return (
        <View style={{ flex: 1 }}>

            <View style={styles.box}>
                <Text style={styles.text}>Welcome {global.firstName} {global.lastName}</Text>
                <Text style={{ textAlign: 'center', fontSize: 17 }}>{global.email}</Text>
                <Text style={{ textAlign: 'center' }}>{global.country}</Text>
                <TouchableOpacity style={{ paddingVertical: 10, }} onPress={() => editProfile()}>
                    <Text style={{ textAlign: 'center', color: 'blue' }}>edit profile</Text>
                </TouchableOpacity>
                <View style={styles.workBox}>
                    <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('WorkScreen') }} >
                        <Text>
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
                <Icon name='align-left' size={25} color='black' />
            </TouchableOpacity>
            <Text style={styles.homeHeaderText}>eSigns </Text>
            <Icon size={25} name='address-card' color='black' />
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
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 30,
        //marginBottom: 80,
        height: 60,
        borderRadius: 4,
        borderStyle: 'dashed',
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

export default HomeScreen;