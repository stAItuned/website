import { browser } from "$app/environment"

export const enableScroll = () => {
    if (browser) {
        window.onscroll = () => { }
    }
}

export const disabledScroll = () => {
    if (browser) {
        const scrollTop = window.pageYOffset || window.document.documentElement.scrollTop
        const scrollLeft = window.pageXOffset || window.document.documentElement.scrollLeft
        window.onscroll = () => {
            window.scrollTo(scrollLeft, scrollTop)
        }
    }
}