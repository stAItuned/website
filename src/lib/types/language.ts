const languages = ["Italian", "English"] as const

type Language = typeof languages[number]

export default Language