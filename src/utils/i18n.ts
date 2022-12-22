import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { resources } from '../translations';

const detection = {
    order: ['querystring', 'navigator'],
    lookupQuerystring: 'lang',
};

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources,
        detection,
        ns: ['plugin'],
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
