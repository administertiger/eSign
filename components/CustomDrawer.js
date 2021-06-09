import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

function SideBar({ ...props }) {
    return (

        <DrawerContentScrollView {...props}>
            <View style={styles.headerContainer}>
                <Text style={styles.name}>{global.firstName} {global.lastName}</Text>
                <Text style={styles.detail}>{global.email}</Text>
                <Text style={styles.detail}>{global.country}</Text>
            </View>
            <DrawerItem label='Home' icon={() => <Icon name='home' size={25} />} onPress={() => props.navigation.navigate('HomeTab')} />
            <DrawerItem label='About' icon={() => <Icon name='info-circle' size={25} />} onPress={() => props.navigation.navigate('AboutDrawer')} />
            <DrawerItem label='Certificate' icon={() => <Icon name='address-card' size={25} />} onPress={() => props.navigation.navigate('CertificateDrawer')} />
        </DrawerContentScrollView>

    )
}

const styles = StyleSheet.create({
    headerContainer: {
        padding: 10,
        margin: 10,
        borderBottomWidth: 0.5,
    },
    name: {
        fontSize: 23,
        fontWeight: 'bold',
        //paddingBottom: 5,
    },
    detail: {
        color: '#a2acbd',
    }
})

export default SideBar;