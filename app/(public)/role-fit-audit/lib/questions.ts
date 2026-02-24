/**
 * Role Fit Audit - Question Metadata and Localization Helpers
 */

import {
  roleFitAuditTranslations,
  type RoleFitLocale,
  normalizeRoleFitLocale,
} from '@/lib/i18n/role-fit-audit-translations'

export type Dimension = 'code' | 'data' | 'product' | 'genai' | 'readiness' | 'proof'

export interface QuestionOption {
  value: number
  optionKey: string
  /** Points to add to each dimension */
  scoring: Partial<Record<Dimension, number>>
}

export interface Question {
  id: string
  section: number
  sectionKey: keyof typeof roleFitAuditTranslations.it.sections
  questionKey: string
  helpTextKey?: string
  options: QuestionOption[]
}

export interface LocalizedQuestion {
  id: string
  section: number
  sectionTitle: string
  question: string
  helpText?: string
  options: Array<{
    label: string
    value: number
    scoring: Partial<Record<Dimension, number>>
  }>
}

export const SECTIONS = [
  { id: 1, key: 'section1', icon: '👤' },
  { id: 2, key: 'section2', icon: '⚙️' },
  { id: 3, key: 'section3', icon: '📊' },
  { id: 4, key: 'section4', icon: '💡' },
  { id: 5, key: 'section5', icon: '🤖' },
] as const

function makeOptions(
  questionId: string,
  scoreByOption: Array<Partial<Record<Dimension, number>>>
): QuestionOption[] {
  return scoreByOption.map((scoring, index) => ({
    value: index,
    optionKey: `${questionId}.option.${index}`,
    scoring,
  }))
}

export const QUESTIONS: Question[] = [
  {
    id: 'Q1',
    section: 1,
    sectionKey: 'section1',
    questionKey: 'Q1',
    options: makeOptions('Q1', [{ readiness: 0 }, { readiness: 1 }, { readiness: 2 }, { readiness: 3 }, { readiness: 4 }]),
  },
  {
    id: 'Q2',
    section: 1,
    sectionKey: 'section1',
    questionKey: 'Q2',
    helpTextKey: 'Q2.helpText',
    options: makeOptions('Q2', [{}, {}, {}, {}, {}, {}, {}]),
  },
  {
    id: 'Q3',
    section: 2,
    sectionKey: 'section2',
    questionKey: 'Q3',
    options: makeOptions('Q3', [{ code: 0 }, { code: 1 }, { code: 2 }, { code: 3 }, { code: 4 }]),
  },
  {
    id: 'Q4',
    section: 2,
    sectionKey: 'section2',
    questionKey: 'Q4',
    options: makeOptions('Q4', [
      { code: 0 },
      { code: 1 },
      { code: 2 },
      { code: 3, readiness: 1 },
      { code: 4, readiness: 2 },
    ]),
  },
  {
    id: 'Q5',
    section: 2,
    sectionKey: 'section2',
    questionKey: 'Q5',
    options: makeOptions('Q5', [
      { code: 0, product: 0 },
      { code: 1, product: 1 },
      { code: 1, product: 1 },
      { code: 2, product: 2 },
      { code: 2, product: 2 },
    ]),
  },
  {
    id: 'Q6',
    section: 2,
    sectionKey: 'section2',
    questionKey: 'Q6',
    options: makeOptions('Q6', [
      { readiness: 0 },
      { readiness: 1 },
      { readiness: 2, code: 1 },
      { readiness: 3, code: 1 },
      { readiness: 4, code: 2 },
    ]),
  },
  {
    id: 'Q7',
    section: 2,
    sectionKey: 'section2',
    questionKey: 'Q7',
    options: makeOptions('Q7', [
      { readiness: 0 },
      { readiness: 1 },
      { readiness: 2, code: 1 },
      { readiness: 3, code: 2 },
      { readiness: 4, code: 2 },
    ]),
  },
  {
    id: 'Q8',
    section: 3,
    sectionKey: 'section3',
    questionKey: 'Q8',
    options: makeOptions('Q8', [{ data: 0 }, { data: 1 }, { data: 2 }, { data: 3 }, { data: 4 }]),
  },
  {
    id: 'Q9',
    section: 3,
    sectionKey: 'section3',
    questionKey: 'Q9',
    helpTextKey: 'Q9.helpText',
    options: makeOptions('Q9', [{ data: 0 }, { data: 1 }, { data: 2 }, { data: 3 }, { data: 4 }]),
  },
  {
    id: 'Q10',
    section: 3,
    sectionKey: 'section3',
    questionKey: 'Q10',
    options: makeOptions('Q10', [
      { data: 0 },
      { data: 1 },
      { data: 2 },
      { data: 3, readiness: 1 },
      { data: 4, readiness: 2 },
    ]),
  },
  {
    id: 'Q11',
    section: 4,
    sectionKey: 'section4',
    questionKey: 'Q11',
    helpTextKey: 'Q11.helpText',
    options: makeOptions('Q11', [{ product: 0 }, { product: 1 }, { product: 2 }, { product: 3 }, { product: 4 }]),
  },
  {
    id: 'Q12',
    section: 4,
    sectionKey: 'section4',
    questionKey: 'Q12',
    options: makeOptions('Q12', [{ product: 0 }, { product: 1 }, { product: 2 }, { product: 3 }, { product: 4 }]),
  },
  {
    id: 'Q13',
    section: 4,
    sectionKey: 'section4',
    questionKey: 'Q13',
    options: makeOptions('Q13', [
      { product: 0, readiness: 0 },
      { product: 1, readiness: 1 },
      { product: 1, readiness: 2 },
      { product: 2, readiness: 3 },
      { product: 2, readiness: 4 },
    ]),
  },
  {
    id: 'Q14',
    section: 5,
    sectionKey: 'section5',
    questionKey: 'Q14',
    options: makeOptions('Q14', [{ genai: 0 }, { genai: 1 }, { genai: 2 }, { genai: 3 }, { genai: 4 }]),
  },
  {
    id: 'Q15',
    section: 5,
    sectionKey: 'section5',
    questionKey: 'Q15',
    options: makeOptions('Q15', [{ genai: 0 }, { genai: 1 }, { genai: 2 }, { genai: 3 }, { genai: 4 }]),
  },
  {
    id: 'Q16',
    section: 5,
    sectionKey: 'section5',
    questionKey: 'Q16',
    options: makeOptions('Q16', [{ genai: 0 }, { genai: 1 }, { genai: 2 }, { genai: 3 }, { genai: 4 }]),
  },
  {
    id: 'Q17',
    section: 5,
    sectionKey: 'section5',
    questionKey: 'Q17',
    options: makeOptions('Q17', [
      { genai: 0, readiness: 0 },
      { genai: 1, readiness: 1 },
      { genai: 2, readiness: 2 },
      { genai: 3, readiness: 3 },
      { genai: 4, readiness: 4 },
    ]),
  },
  {
    id: 'Q18',
    section: 5,
    sectionKey: 'section5',
    questionKey: 'Q18',
    options: makeOptions('Q18', [
      { genai: 0, readiness: 0 },
      { genai: 1, readiness: 1 },
      { genai: 1, readiness: 2 },
      { genai: 2, readiness: 3 },
      { genai: 2, readiness: 4 },
    ]),
  },
  {
    id: 'Q19',
    section: 5,
    sectionKey: 'section5',
    questionKey: 'Q19',
    options: makeOptions('Q19', [
      { genai: 0, readiness: 0 },
      { genai: 1, readiness: 1 },
      { genai: 1, readiness: 2 },
      { genai: 2, readiness: 3 },
      { genai: 2, readiness: 4 },
    ]),
  },
  {
    id: 'Q20',
    section: 5,
    sectionKey: 'section5',
    questionKey: 'Q20',
    options: makeOptions('Q20', [
      { proof: 0, readiness: 0 },
      { proof: 1, readiness: 1 },
      { proof: 2, readiness: 2 },
      { proof: 3, readiness: 3 },
      { proof: 4, readiness: 4 },
    ]),
  },
]

export function getLocalizedSections(locale: RoleFitLocale) {
  const t = roleFitAuditTranslations[locale]
  return SECTIONS.map((section) => ({
    id: section.id,
    icon: section.icon,
    title: t.sections[section.key],
  }))
}

export function getLocalizedQuestions(locale: RoleFitLocale): LocalizedQuestion[] {
  const t = roleFitAuditTranslations[locale]

  return QUESTIONS.map((question) => {
    const i18nQuestion = t.questions[question.questionKey]
    const sectionTitle = t.sections[question.sectionKey]

    return {
      id: question.id,
      section: question.section,
      sectionTitle,
      question: i18nQuestion.question,
      helpText: i18nQuestion.helpText,
      options: question.options.map((option, index) => ({
        label: i18nQuestion.options[index],
        value: option.value,
        scoring: option.scoring,
      })),
    }
  })
}

export function getQuestionsForSection(sectionId: number, locale?: RoleFitLocale): LocalizedQuestion[] {
  const resolvedLocale = normalizeRoleFitLocale(locale)
  return getLocalizedQuestions(resolvedLocale).filter((q) => q.section === sectionId)
}

export function getRoleOptions(locale: RoleFitLocale): string[] {
  return roleFitAuditTranslations[locale].roleOptions
}

export function getAnswerLabelByQuestionId(questionId: string, answerValue: number, locale?: RoleFitLocale): string | null {
  const resolvedLocale = normalizeRoleFitLocale(locale)
  const question = getLocalizedQuestions(resolvedLocale).find((q) => q.id === questionId)
  if (!question) return null
  const option = question.options.find((opt) => opt.value === answerValue)
  return option?.label ?? null
}

/**
 * Get the maximum possible score for each dimension
 */
export function getMaxScores(): Record<Dimension, number> {
  return {
    code: 14,
    data: 12,
    product: 12,
    genai: 20,
    readiness: 36,
    proof: 4,
  }
}
