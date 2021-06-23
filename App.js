import React, { useEffect } from 'react';
import { Text, View, Dimensions, TouchableOpacity, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, useHeaderHeight } from '@react-navigation/stack';
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
            <Drawer.Screen name="HomeDrawer" component={HomeStack} options={{ unmountOnBlur: true, }} />
            <Drawer.Screen name="DocumentsDrawer" component={DocumentsStack} options={{ unmountOnBlur: true, }} />
            <Drawer.Screen name="AboutDrawer" component={AboutStack} />
            <Drawer.Screen name='CertificateDrawer' component={CertificateStack} />
            <Drawer.Screen name='GotoWorkDrawer' component={GoToWork} options={{ unmountOnBlur: true }} />
            <Drawer.Screen name='WorkDrawer' component={WorkStack} options={{ unmountOnBlur: true, swipeEnabled: false }} />

        </Drawer.Navigator>
    )
}

//-----------Tabs-----------
function TabNavigator() {
    const { t, i18n } = useTranslation();

    return (
        <Tab.Navigator tabBarOptions={{
            showLabel: false,
            style: {
                position: 'absolute',
                //marginHorizontal: 10,
                //bottom: 20,
                height: 60,
                borderTopStartRadius: 5,
                borderTopEndRadius: 5,
                elevation: 1,
                //borderWidth: 1,
            },

        }}>
            <Tab.Screen name='HomeTab' component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', width: 100 }}>
                            <Icon name='home' size={20} style={{ color: focused ? `#e32f45` : `#748c94`, }} />
                            <Text style={{ color: focused ? `#e32f45` : `#748c94`, }}>{t('Home')}</Text>
                        </View>
                    ),
                }} />

            <Tab.Screen name='DocumentsTab' component={DocumentsScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', width: 100 }}>
                            <Icon name='folder' size={20} style={{ color: focused ? `#e32f45` : `#748c94`, }} />
                            <Text style={{ color: focused ? `#e32f45` : `#748c94`, }}>{t('Documents')}</Text>
                        </View>
                    ),
                    unmountOnBlur: true,
                }} />
        </Tab.Navigator>
    )
}
function TabNavigator2() {
    const { t, i18n } = useTranslation();

    return (
        <Tab.Navigator initialRouteName='DocumentsTab' tabBarOptions={{
            showLabel: false,
            style: {
                position: 'absolute',
                //marginHorizontal: 10,
                //bottom: 20,
                height: 55,
                borderTopStartRadius: 5,
                borderTopEndRadius: 5,
                elevation: 3
            },

        }}>
            <Tab.Screen name='HomeTab' component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', width: 100 }}>
                            <Icon name='home' style={{ color: focused ? `#e32f45` : `#748c94`, }} />
                            <Text style={{ color: focused ? `#e32f45` : `#748c94`, }}>{t('Home')}</Text>
                        </View>
                    ),
                }} />

            <Tab.Screen name='DocumentsTab' component={DocumentsScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', width: 100 }}>
                            <Icon name='folder' style={{ color: focused ? `#e32f45` : `#748c94`, }} />
                            <Text style={{ color: focused ? `#e32f45` : `#748c94`, }}>{t('Documents')}</Text>
                        </View>
                    ),
                    unmountOnBlur: true,
                }} />
        </Tab.Navigator>
    )
}

//----------Stacks----------
function HomeStack({ navigation }) {
    const headerHeight = useHeaderHeight();
    const headerWidth = Dimensions.get('window').width;

    return (
        <Stack.Navigator >
            <Stack.Screen name='HomeStack' component={TabNavigator}
                options={
                    {
                        headerTitle: () => <HomeHeader navigation={navigation} />,
                        headerLeft: null,
                        headerBackground: () => <LinearGradient
                            colors={['#2C5364', '#99f2c8']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 2, y: 0 }}
                            style={{ width: headerWidth, height: headerHeight, }} />

                    }} />
        </Stack.Navigator>

    )
}
function DocumentsStack({ navigation }) {
    const headerHeight = useHeaderHeight();
    const headerWidth = Dimensions.get('window').width;

    return (
        <Stack.Navigator >
            <Stack.Screen name='DocumentsStack' component={TabNavigator2}
                options={
                    {
                        headerTitle: () => <HomeHeader navigation={navigation} />,
                        headerLeft: null,
                        headerBackground: () => <LinearGradient
                            colors={['#2C5364', '#99f2c8']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 2, y: 0 }}
                            style={{ width: headerWidth, height: headerHeight, }} />

                    }} />
        </Stack.Navigator>

    )
}

function AboutStack({ navigation }) {
    const headerHeight = useHeaderHeight();
    const headerWidth = Dimensions.get('window').width;

    return (
        <Stack.Navigator>
            <Stack.Screen name='AboutStack' component={AboutScreen}
                options={
                    {
                        headerTitle: () => <AboutHeader navigation={navigation} />,
                        headerLeft: null,
                        headerBackground: () => <LinearGradient
                            colors={['#2C5364', '#99f2c8']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 2, y: 0 }}
                            style={{ width: headerWidth, height: headerHeight, }} />
                    }} />
        </Stack.Navigator>
    )
}
function CertificateStack({ navigation }) {
    const headerHeight = useHeaderHeight();
    const headerWidth = Dimensions.get('window').width;

    return (
        <Stack.Navigator>
            <Stack.Screen name='CertificateStack' component={Certificate}
                options={
                    {
                        headerTitle: () => <CertificateHeader navigation={navigation} />,
                        headerLeft: null,
                        headerBackground: () => <LinearGradient
                            colors={['#2C5364', '#99f2c8']}
                            start={{ x: 0.1, y: 0 }}
                            end={{ x: 2, y: 0 }}
                            style={{ width: headerWidth, height: headerHeight, }} />
                    }} />
        </Stack.Navigator>
    )
}
function WorkStack({ navigation }) {
    const headerHeight = useHeaderHeight();
    const headerWidth = Dimensions.get('window').width;

    return (
        <Stack.Navigator>
            <Stack.Screen
                name={'WorkStack'}
                component={WorkScreen}
                options={
                    {
                        headerTitle: () => <WorkHeader navigation={navigation} />,
                        headerLeft: null,
                        headerBackground: () => <LinearGradient
                            colors={['#2C5364', '#99f2c8']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 2, y: 0 }}
                            style={{ width: headerWidth, height: headerHeight, }} />
                    }}
            />
        </Stack.Navigator>
    )
}


//-------------------------------------------------------------------------
function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={'LoginScreen'}>
                <Stack.Screen name='LoginScreen' component={LoginScreen}
                    options={
                        {
                            headerShown: false,
                        }} />

                <Stack.Screen
                    name='MainScreen'
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

export default App;