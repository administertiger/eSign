import React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

//Screens
import HomeScreen from './screens/HomeScreen'
import DocumentsScreen from './screens/DocumentsScreen'
import AboutScreen from './screens/AboutScreen'
import LoginScreen from './screens/LoginScreen'
import WorkScreen from './screens/WorkScreen'
import Certificate from './screens/Certificate'
import GoToWork from './screens/DummyPage'

import { HomeHeader } from './screens/HomeScreen'
import { AboutHeader } from './screens/AboutScreen'
import { CertificateHeader } from './screens/Certificate'
import { WorkHeader } from './screens/WorkScreen'

import SideBar from './components/CustomDrawer'

//------------------------Navigation-----------------------
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

//----------Drawer----------
function DrawerNavigator() {
    return (
        <Drawer.Navigator initialRouteName='HomeDrawer' drawerType='slide' drawerContent={props => <SideBar {...props} />} >
            <Drawer.Screen name="HomeDrawer" component={HomeStack} />
            <Drawer.Screen name="AboutDrawer" component={AboutStack} />
            <Drawer.Screen name='CertificateDrawer' component={CertificateStack} />
            <Drawer.Screen name='GotoWorkDrawer' component={GoToWork} options={{ unmountOnBlur: true }} />
            <Drawer.Screen name='WorkDrawer' component={WorkStack} options={{ unmountOnBlur: true, swipeEnabled: false }} />

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
            <Tab.Screen name='HomeTab' component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', }}>
                            <Icon name='home' style={{ color: focused ? `#e32f45` : `#748c94`, }} />
                            <Text style={{ color: focused ? `#e32f45` : `#748c94`, }}>HOME</Text>
                        </View>
                    ),
                }} />
            <Tab.Screen name='DocumentsTab' component={DocumentsScreen}
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
function HomeStack({ navigation }) {
    return (
        <Stack.Navigator >
            <Stack.Screen name='HomeStack' component={TabNavigator}
                options={
                    {
                        headerTitle: () => <HomeHeader navigation={navigation} />,
                        headerLeft: null,
                        headerStyle: {
                            backgroundColor: '#3944BC'
                        }

                    }} />
        </Stack.Navigator>

    )
}

function AboutStack({ navigation }) {
    return (
        <Stack.Navigator>
            <Stack.Screen name='AboutStack' component={AboutScreen}
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
            <Stack.Screen name='CertificateStack' component={Certificate}
                options={
                    {
                        headerTitle: () => <CertificateHeader navigation={navigation} />,
                        headerLeft: null,
                    }} />
        </Stack.Navigator>
    )
}
function WorkStack({ navigation }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={'WorkStack'}
                component={WorkScreen}
                options={
                    {
                        headerTitle: () => <WorkHeader navigation={navigation} />,
                        headerLeft: null,
                        headerStyle: {
                            backgroundColor: '#3944BC'
                        },
                    }}
            />
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


            </Stack.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({

})

export default App;