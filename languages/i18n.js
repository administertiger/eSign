import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import thai from './thai.json';
import english from './english.json';


i18next.use(initReactI18next).init({
    lng: 'en',
    resources: {
        en: english,
        th: thai
    },
    react: {
        useSuspense: false,
    }
})

export default i18next;