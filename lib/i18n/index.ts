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

// AI EU Act translations
export {
  aiEuActTranslations,
  AI_EU_ACT_DEFAULT_LOCALE,
  AI_EU_ACT_QUERY_PARAM,
  isAiEuActLocale,
  normalizeAiEuActLocale,
} from './ai-eu-act-translations'
export type { AiEuActLocale, AiEuActTranslations } from './ai-eu-act-translations'
