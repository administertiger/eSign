import React, { useEffect } from 'react';
import { View } from 'react-native';

function GoToWork({ navigation }) {
    useEffect(() => {
        navigation.navigate('WorkDrawer')
    }, [])
    return (
        <View>

        </View>
    )
}

export default GoToWork;