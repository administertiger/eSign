import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';

import HomeScreen from './screens/HomeScreen'
import DocumentsScreen from './screens/DocumentsScreen'
import AboutScreen from './screens/AboutScreen'
import LoginScreen from './screens/LoginScreen'
import WorkScreen from './screens/WorkScreen'
import Certificate from './screens/Certificate'

import { HomeHeader } from './screens/HomeScreen'
import { AboutHeader } from './screens/AboutScreen'
import { CertificateHeader } from './screens/Certificate'
import { WorkHeader } from './screens/WorkScreen'

//------------------------Navigation-----------------------
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

//----------Drawer----------
function DrawerNavigator({ navigation }) {
    return (
        <Drawer.Navigator initialRouteName="Home" drawerType='slide' drawerContent={props => {
            return (

                <DrawerContentScrollView {...props}>
                    <DrawerItemList {...props} />
                </DrawerContentScrollView>
            )
        }}>
            <Drawer.Screen name="Home" component={StackNavigator} options={{ title: 'Home', drawerIcon: () => <Icon name='home' size={25} onPress={navigation.navigate('HomeScreen')} /> }} />
            <Drawer.Screen name="About" component={AboutStack} options={{ title: 'About', drawerIcon: () => <Icon name='info-circle' size={25} /> }} />
            <Drawer.Screen name='CertificateScreen' component={CertificateStack} options={{ unmountOnBlur: true, title: 'Certification', drawerIcon: () => <Icon name='address-card' size={25} /> }} />
        </Drawer.Navigator>
    )
}

//-----------Tabs-----------
function TabNavigator() {
    return (
        <Tab.Navigator tabBarOptions={{
            showLabel: false,
            style: {
                position: 'absolute',
                marginHorizontal: 20
            },

        }}>
            <Tab.Screen name='HomeScreen' component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', }}>
                            <Icon name='home' style={{ color: focused ? `#e32f45` : `#748c94`, }} />
                            <Text style={{ color: focused ? `#e32f45` : `#748c94`, }}>HOME</Text>
                        </View>
                    ),
                }} />
            <Tab.Screen name='DocumentsScreen' component={DocumentsScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Icon name='folder' style={{ color: focused ? `#e32f45` : `#748c94`, }} />
                            <Text style={{ color: focused ? `#e32f45` : `#748c94`, }}>DOCUMENTS</Text>
                        </View>
                    ),
                    unmountOnBlur: true,
                }} />
        </Tab.Navigator>
    )
}

//----------Stacks----------
function StackNavigator({ navigation }) {
    return (

        <Stack.Navigator >
            <Stack.Screen name='HomeScreen' component={TabNavigator}
                options={
                    {
                        headerTitle: () => <HomeHeader navigation={navigation} />,
                        headerLeft: null,
                    }} />
            <Stack.Screen name='ShowAccessTokenScreen' component={DrawerNavigator} />
        </Stack.Navigator>

    )
}

function AboutStack({ navigation }) {
    return (
        <Stack.Navigator>
            <Stack.Screen name='AboutScreen' component={AboutScreen}
                options={
                    {
                        headerTitle: () => <AboutHeader navigation={navigation} />,
                        headerLeft: null
                    }} />
        </Stack.Navigator>
    )
}
function CertificateStack({ navigation }) {
    return (
        <Stack.Navigator>
            <Stack.Screen name='CertificateScreen' component={Certificate}
                options={
                    {
                        headerTitle: () => <CertificateHeader navigation={navigation} />,
                        headerLeft: null
                    }} />
        </Stack.Navigator>
    )
}


//-------------------------------------------------------------------------
const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={'LoginScreen'}>
                <Stack.Screen name='LoginScreen' component={LoginScreen}
                    options={
                        {
                            headerShown: false,
                        }} />
                <Stack.Screen
                    name='HomeScreen'
                    component={DrawerNavigator}
                    options={
                        {
                            headerShown: null
                        }
                    }
                />

                <Stack.Screen
                    name={'WorkScreen'}
                    component={WorkScreen}
                    options={
                        {
                            headerTitle: () => <WorkHeader />,
                            //headerLeft: null,
                        }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({

})

export default App;