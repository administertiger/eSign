import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { authorize, refresh } from 'react-native-app-auth';
import { Configs } from '../components/configs';
import { ButtonContainer, Button } from '../components';

const initialState = {
    hasLoggedInOnce: false,
    provider: '',
    accessToken: '',
    accessTokenExpirationDate: '',
    refreshToken: ''
};

function ShowAccessTokenScreen() {

    useEffect(() => {
        handleAuthorize(Configs.adb2c);
    }, [])

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

                console.log(newAuthState);

            } catch (error) {
                Alert.alert('Failed to log in', error.message);
            }
        },
        [authState]
    );

    const handleRefresh = useCallback(async () => {
        try {
            const config = authState.provider;
            const newAuthState = await refresh(config, {
                refreshToken: authState.refreshToken
            });

            setAuthState(current => ({
                ...current,
                ...newAuthState,
                refreshToken: newAuthState.refreshToken || current.refreshToken
            }));

            console.log(authState)

        } catch (error) {
            Alert.alert('Failed to refresh token', error.message);
        }
    }, [authState]);

    return (
        <View style={{ flex: 1, }} >
            <ScrollView>
                <Text style={styles.header}>accessToken</Text>
                <Text style={styles.detail}>{authState.accessToken}</Text>
                <Text style={styles.header}>accessTokenExpirationDate</Text>
                <Text style={styles.detail}>{authState.accessTokenExpirationDate}</Text>
                <Text style={styles.header}>refreshToken</Text>
                <Text style={styles.detail}>{authState.refreshToken}</Text>
                <View style={{ marginBottom: 100 }} />

            </ScrollView>
            <ButtonContainer>
                {!!authState.refreshToken ? (
                    <Button onPress={handleRefresh} text="Refresh" color="#24C2CB" />
                ) : null}
            </ButtonContainer>
        </View>

    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 10,
    },
    detail: {
        paddingHorizontal: 20,
        marginBottom: 10,
    }
})


export default ShowAccessTokenScreen;