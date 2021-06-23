import React from 'react'

export const Configs = {
    adb2c: {
        // From https://openidconnect.net/
        issuer: 'https://esignatures.b2clogin.com/2b003b95-b16c-452a-a489-b111b8091ac9/v2.0',
        //issuer: 'https://esignatures.b2clogin.com',
        clientId: '0c9e06eb-c2c3-4330-84b1-9bf458cded01',
        //redirectUrl: 'https://youtube.com',
        redirectUrl: 'esignatures://callback',
        additionalParameters: {
            prompt: 'login'
        },
        //scopes: ['openid', '0c9e06eb-c2c3-4330-84b1-9bf458cded01', 'offline_access', 'https://esignatures.onmicrosoft.com/api/user_impersonation'],
        scopes: ['openid', '0c9e06eb-c2c3-4330-84b1-9bf458cded01', 'offline_access'],

        serviceConfiguration: {
            authorizationEndpoint: 'https://esignatures.b2clogin.com/esignatures.onmicrosoft.com/B2C_1_SignUpSignIn/oauth2/v2.0/authorize',
            tokenEndpoint: 'https://esignatures.b2clogin.com/esignatures.onmicrosoft.com/B2C_1_SignUpSignIn/oauth2/v2.0/token',
            revocationEndpoint: 'https://esignatures.b2clogin.com/esignatures.onmicrosoft.com/B2C_1_SignUpSignIn/oauth2/v2.0/logout',
            registrationEndpoint: 'https://esignatures.b2clogin.com/esignatures.onmicrosoft.com/B2C_1_ProfileEditing'
        }
    },

};

