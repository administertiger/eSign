import React, { useState, useCallback } from 'react';
import { View, Button, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { authorize } from 'react-native-app-auth';
import { Configs } from '../components/configs';

const initialState = {
    hasLoggedInOnce: false,
    provider: '',
    accessToken: '',
    accessTokenExpirationDate: '',
    refreshToken: ''
};

function LoginScreen({ navigation }) {

    const [authState, setAuthState] = useState(initialState);

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

                global.token = newAuthState.accessToken; //Get accessToken
                console.log('User token: ', newAuthState);

            } catch (error) {
                Alert.alert('Failed to log in', error.message);
            }
        }
    );

    function deleteToken() {
        setTimeout(() => {
            console.log('This wii appear after 1 second!!')
            navigation.navigate('HomeScreen')
        }, 500);
    }
    //------------------------------------------------------

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            {!!authState.accessToken ? (
                <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                    <Text style={styles.text}>WELCOME</Text>
                </TouchableOpacity>
            ) : null}
            <View style={{ justifyContent: 'center' }}>
                {!authState.accessToken ? (
                    <View style={{ marginHorizontal: 40 }}>
                        <Text style={styles.text}>Who are you???</Text>
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