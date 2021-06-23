import { refresh } from 'react-native-app-auth';
import { Configs } from '../components/configs';

export async function refreshToken() {
    const result = await refresh(Configs.adb2c, {
        refreshToken: global.refreshToken,
    });
    global.token = result.accessToken
    global.refreshToken = result.refreshToken

    //console.log('refresh555 = ', result)
}