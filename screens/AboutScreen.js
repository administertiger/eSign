import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

function LoginScreen({ navigation }) {
    return (
        <View style={styles.box} >
            <Text />
            <Text>About this App!</Text>
        </View>
    )
}

//Header---------
export function AboutHeader({ navigation }) {
    return (
        <View style={styles.homeHeader}>
            <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.openDrawer()} >
                <Icon name='align-left' size={25} color='black' />
            </TouchableOpacity>
            <Text style={styles.homeHeaderText}>About this App</Text>
        </View >
    )
}

const styles = StyleSheet.create({
    box: {
        flex: 1,
        //justifyContent: 'center',
        alignItems: 'center',
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

export default LoginScreen;

