import {darkThemeCss, defaultThemeCss} from '@/styles/index.js'

import {publishThemeChange} from '@/utils/event_utils'

import {getStoreValue, setStoreValue} from '@/utils/store_utils';

import { EDIT_ICON, DARK_THEME_EDIT_ICON } from '@/ui/constants/icons'

export const getCurrentTheme = () => {

    return getStoreValue("theme")
}

export const setTheme = (theme) => {

    if (!theme) theme = getCurrentTheme() || 'default';

    let themeCss = defaultThemeCss;
    let variablesCss = '';
    switch (theme) {
        case 'dark': 
            themeCss = darkThemeCss; 
            variablesCss = `
            :root {
                --background-color: #000;
                --request-tabs-active-background: #1A1A1A;
                --request-tabs-border: #303030
            }
            `
            break;
        default: themeCss = defaultThemeCss; break;
    }
    themeCss = `
    ${variablesCss}
    ${themeCss}

    `

    let existNode = document.getElementById('theme-style-relative-position-id')
    let styleNode = document.getElementById('dynamic_antd_theme_custom_style')
    if (!styleNode) {
        styleNode = document.createElement('style')
        styleNode.id = 'dynamic_antd_theme_custom_style'
        styleNode.innerHTML = themeCss
        document.getElementsByTagName('head')[0].insertBefore(styleNode, existNode)
    } else {
        styleNode.innerHTML = themeCss
    }

    setStoreValue('theme', theme);

    publishThemeChange(theme)
}

export const getEditIcon = () => {
    return getCurrentTheme() === 'dark' ? DARK_THEME_EDIT_ICON : EDIT_ICON
}
