import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

function LoginScreen({ navigation }) {
    return (
        <View style={styles.box} >
            <Text>About this App!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    box: {
        flex: 1,
        //justifyContent: 'center',
        alignItems: 'center',
    }
})

export default LoginScreen;