// i18n exports for Learn and Home pages
export { LearnLocaleProvider, useLearnLocale, LearnLocaleToggle } from './LearnLocaleContext'
export { translations } from './learn-translations'
export type { LearnLocale, LearnTranslations } from './learn-translations'

// Home page translations
export { homeTranslations } from './home-translations'
export type { HomeTranslations } from './home-translations'

// Legal translations
export { legalTranslations } from './legal-translations'
export type { LegalTranslations } from './legal-translations'

// Account translations
export { accountTranslations } from './account-translations'
export type { AccountTranslations } from './account-translations'

// Career OS translations
export {
  careerOSTranslations,
  CAREER_OS_DEFAULT_LOCALE,
  CAREER_OS_QUERY_PARAM,
  getCareerOSTranslations,
  isCareerOSLocale,
  normalizeCareerOSLocale,
} from './career-os-translations'
export type { CareerOSLocale, CareerOSTranslations } from './career-os-translations'
