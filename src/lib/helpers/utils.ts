export const toSentenceCase = (str: string): string => {
    return str[0].toUpperCase() + str.slice(1)
}

export const getTabsFromPathname = (pathname: string): string[] => {
    return pathname.split('/').slice(1).map((tab) => toSentenceCase(tab))
}

export const getPathnameFromTabs = (tabs: string[], end: number): string => {
    return "/" + tabs.slice(0, end).join("/").toLowerCase()
}