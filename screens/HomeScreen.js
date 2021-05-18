import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import axios from 'axios';

function HomeScreen({ navigation }) {
    const API_URL = 'https://ws.esigns.cloud';

    useEffect(() => {
        getUserProfile();
    }, [])

    //----------------------User profile-------------------------
    const [user, setUser] = useState({
        country: '',
        email: '',
        firstName: '',
        lastName: '',
        name: ''
    })

    function getUserProfile() {
        axios.get(API_URL + '/accounts',
            {
                headers: {
                    'Authorization': 'Bearer ' + global.token
                }
            })
            .then((response) => {
                console.log(response);
                if (response.data) {
                    //console.log(JSON.stringify(response.data));
                    console.log('User profile: ', response.data.profiles);
                    setUser(response.data.profiles)
                }

            }, (error) => {
                console.log(error);

            })

    }
    //------------------------------------------------------
    return (
        <View style={{ flex: 1 }}>

            <View style={styles.box}>
                <Text style={styles.text}>Welcome {user.firstName} {user.lastName}</Text>
                <Text style={{ textAlign: 'center' }}>{user.email}</Text>
                <Text style={{ textAlign: 'center' }}>{user.country}</Text>
                <View style={styles.workBox}>
                    <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('WorkFlowScreen') }} >
                        <Text>
                            <Icon name='plus' /> NEW WORKFLOW
                            </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
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
        fontSize: 20,
        fontFamily: 'sans-serif-medium',
        fontWeight: 'bold',

    }
})

export default HomeScreen;