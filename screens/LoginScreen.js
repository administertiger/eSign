import React, { useState, useCallback, useEffect } from 'react';
import { View, Button, StyleSheet, Text, Alert, ActivityIndicator } from 'react-native';
import { authorize } from 'react-native-app-auth';
import { Configs } from '../components/configs';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const initialState = {
    hasLoggedInOnce: false,
    provider: '',
    accessToken: '',
    accessTokenExpirationDate: '',
    refreshToken: ''
};

function LoginScreen({ navigation }) {
    const API_URL = 'https://ws.esigns.cloud';

    const { t, i18n } = useTranslation();

    const [authState, setAuthState] = useState(initialState);

    //----------------------User profile-------------------------
    function getUserProfile(token) {
        axios.get(API_URL + '/accounts',  //Account API
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then((response) => {
                console.log(response);
                if (response.data) {
                    //Set Global profile
                    global.country = response.data.profiles.country;
                    global.email = response.data.profiles.email;
                    global.firstName = response.data.profiles.firstName;
                    global.lastName = response.data.profiles.lastName;
                    global.name = response.data.profiles.name

                    console.log('Profile set!!', global.name);
                    navigation.navigate('MainScreen');
                }

            }, (error) => {
                console.log(error);

            })
    }

    //-------------------------Get login--------------------------
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

                getUserProfile(newAuthState.accessToken)
                global.token = newAuthState.accessToken; //Get accessToken
                console.log('User token: ', newAuthState);

            } catch (error) {
                Alert.alert('Failed to log in', error.message);
            }
        }
    );



    //------------------------------------------------------

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            {!!authState.accessToken ? (
                <View>
                    <ActivityIndicator size='large' color='black' />
                    <Text style={styles.text}>{t('Bringing you to the homepage')}</Text>
                </View>
            ) : null}
            <View style={{ justifyContent: 'center' }}>
                {!authState.accessToken ? (
                    <View style={{ marginHorizontal: 40 }}>
                        <Text style={styles.text}>{t('Who are you')}</Text>
                        <Button title='Login' onPress={() => handleAuthorize(Configs.adb2c)} />
                    </View>
                ) : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
        paddingTop: 20,
        fontSize: 23,
        fontFamily: 'sans-serif-medium',
        fontWeight: 'bold',
    },
    //----------------2nd Page----------------
    box: {
        borderWidth: 1,
        padding: 15,
        //flex: 1,
    },
    buttonBox: {
        padding: 25,
        //alignItems: 'center',
        flexDirection: 'row',
        //borderWidth: 1,
        justifyContent: 'center'

    },
    buttonText: {
        fontSize: 15,
        fontFamily: 'sans-serif-medium',
        fontWeight: 'bold',
        marginHorizontal: 20
    }
})

export default LoginScreen;