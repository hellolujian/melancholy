import {darkThemeCss, defaultThemeCss} from '@/styles/index.js'

import {publishThemeChange} from '@/utils/event_utils'

import {getStoreValue, setStoreValue, setStoreValueWithCallback} from '@/utils/store_utils';

import { EDIT_ICON, DARK_THEME_EDIT_ICON , DARK_THEME_ELLIPSIS_ICON, 
    ELLIPSIS_ICON, CLOSE_SVG, DARK_THEME_CLOSE_SVG} from '@/ui/constants/icons'

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
                --request-tabs-border: #303030;
                --common-border-color: #434343;
                --tree-item-selected-background-color: #282828
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

export const getEllipsisIcon = () => {
    return getCurrentTheme() === 'dark' ? DARK_THEME_ELLIPSIS_ICON : ELLIPSIS_ICON
}

export const getByTheme = (defaultCom, darkCom) => {
    return getCurrentTheme() === 'dark' ? darkCom : defaultCom
}

export const getCloseSvg = () => {
    return getByTheme(CLOSE_SVG, DARK_THEME_CLOSE_SVG)
}
