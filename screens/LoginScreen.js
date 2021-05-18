import React, { useState, useCallback } from 'react';
import { View, Button, StyleSheet, Text, ImageBackground } from 'react-native';
import { authorize } from 'react-native-app-auth';
import { Configs } from '../components/configs';

const initialState = {
    hasLoggedInOnce: false,
    provider: '',
    accessToken: '',
    accessTokenExpirationDate: '',
    refreshToken: ''
};

function HomeScreen({ navigation }) {

    /*
        useEffect(() => {
            handleAuthorize(Configs.adb2c);
        }, [])
    */
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
                console.log(global.token)

                console.log('User token: ', newAuthState);

            } catch (error) {
                Alert.alert('Failed to log in', error.message);
            }
        },
        [authState]
    );

    return (
        <ImageBackground
            source={require('../assets/background.jpg')}
            style={[styles.background, { width: '100%', height: '100%' }]}
        >
            <View style={{ flex: 1, justifyContent: 'center' }}>
                {!!authState.accessToken ? (
                    <View style={{ marginHorizontal: 40 }}>
                        <Text style={styles.text}>OH, It's you!</Text>
                        <Button title='Go to home page'
                            onPress={() => {
                                navigation.navigate('HomeScreen')
                            }} />
                    </View>
                ) : null}

                {!authState.accessToken ? (
                    <View style={{ marginHorizontal: 40 }}>
                        <Text style={styles.text}>Who are you???</Text>
                        <Button title='Login' onPress={() => handleAuthorize(Configs.adb2c)} />
                    </View>
                ) : null}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 15,
        textAlign: 'center',
        paddingBottom: 10
    }
})

export default HomeScreen;