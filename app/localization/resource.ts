import en from '~/../public/locales/en';
import ar from '~/../public/locales/ar';

const languages = ['en', 'ar'] as const;

export type Language = (typeof languages)[number];
export type Resource = typeof en | typeof ar; // default language

export const languagesDefault = 'en' as Language;
export const languagesSupported = [...languages];

//
//

export const resources: Record<Language, Resource> = {
  en,
  ar,
};

//

export const getSupportedLanguage = (val?: string) => {
  if (!val) return undefined;
  const lang = String(val).toLowerCase() as Language;

  return languagesSupported.includes(lang) ? lang : undefined;
};

export const getSupportedLanguageFromRequest = (request: Request) => {
  const {pathname} = new URL(request.url);
  const pathLang = pathname.split('/')?.[1];

  return getSupportedLanguage(pathLang); // || await i18next.getLocale(request);
};
