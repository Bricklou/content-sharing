import i18next from "i18next";
import enLocale from "./locales/en.json";
import frLocale from "./locales/fr.json";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";

export async function setupI18n() {
  return i18next
    .use(I18nextBrowserLanguageDetector)
    .init({
      resources: {
        en: { translation: enLocale },
        fr: { translation: frLocale },
      },
      fallbackLng: "en",
      defaultNS: "translation",
    })
    .then(() => i18next);
}
