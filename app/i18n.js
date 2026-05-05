"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "@/locales/resources";

if (!i18n.isInitialized) {
	i18n.use(initReactI18next).init({
		resources,
		fallbackLng: "en",
		supportedLngs: ["pt", "en"],
		nonExplicitSupportedLngs: true,
		interpolation: {
			escapeValue: false,
		},
		react: {
			useSuspense: false,
		},
	});
}

export default i18n;
