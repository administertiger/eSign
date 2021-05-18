import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './screens/HomeScreen'
import DocumentsScreen from './screens/DocumentsScreen'
import WorkFlowScreen from './screens/WorkFlowScreen'
import AboutScreen from './screens/AboutScreen'
import ShowAccessTokenScreen from './screens/ShowAccessTokenScreen'
import LoginScreen from './screens/LoginScreen'

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
    return (
        <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={TabNavigator} />
            <Drawer.Screen name="About" component={AboutScreen} />
            <Drawer.Screen name="ShowAccessTokenScreen" component={ShowAccessTokenScreen} options={{ drawerLabel: 'Your Token' }} />
        </Drawer.Navigator>
    )
}

function TabNavigator() {
    return (
        <Tab.Navigator tabBarOptions={{
            showLabel: false,
            style: {
                position: 'absolute',
                marginHorizontal: 20
            }
        }}>
            <Tab.Screen name='HomeScreen' component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', }}>
                            <Icon
                                name='home'
                                style={{ color: focused ? `#e32f45` : `#748c94`, }}
                            />
                            <Text
                                style={{ color: focused ? `#e32f45` : `#748c94`, }}>HOME
                            </Text>
                        </View>
                    ),
                }} />
            <Tab.Screen name='DocumentsScreen' component={DocumentsScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Icon
                                name='folder'
                                style={{ color: focused ? `#e32f45` : `#748c94`, }}
                            />
                            <Text
                                style={{ color: focused ? `#e32f45` : `#748c94`, }}>DOCUMENTS
                        </Text>
                        </View>
                    )
                }} />
        </Tab.Navigator>
    )
}

function StackNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name='HomeScreen' component={DrawerNavigator}
                    options={{ title: 'Leciept Digital Signature' }} />
                <Stack.Screen name='WorkFlowScreen' component={WorkFlowScreen} />
                <Stack.Screen name='ShowAccessTokenScreen' component={ShowAccessTokenScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const App = () => {
    return (
        <StackNavigator />
    )
}

export default App;