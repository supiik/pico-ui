// Svetlá / tmavá téma: trieda `dark` na <html> (premenné v theme.css). Voľba v localStorage `theme`
// (rovnako ako v orgasme); `system` = podľa nastavenia zariadenia (prefers-color-scheme), sleduje jeho zmeny.
import { ref } from 'vue'

export const THEMES = ['light', 'dark', 'system'] as const
export type ColorTheme = (typeof THEMES)[number]
export const isColorTheme = (v: unknown): v is ColorTheme => typeof v === 'string' && (THEMES as readonly string[]).includes(v)

const browser = typeof window !== 'undefined'
const KEY = 'theme'

function read(): ColorTheme {
  try {
    const v = browser ? localStorage.getItem(KEY) : null
    return isColorTheme(v) ? v : 'system'
  } catch {
    return 'system' // úložisko môže byť zakázané
  }
}

export const colorTheme = ref<ColorTheme>(read())

const media = browser && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null
export const isDark = (t: ColorTheme = colorTheme.value) => t === 'dark' || (t === 'system' && !!media?.matches)

export function applyColorTheme() {
  if (browser) document.documentElement.classList.toggle('dark', isDark())
}

export function setColorTheme(t: ColorTheme) {
  colorTheme.value = t
  try {
    if (t === 'system') localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, t)
  } catch {
    // bez úložiska platí voľba len do zatvorenia stránky
  }
  applyColorTheme()
}

/** svetlá → tmavá → podľa zariadenia → svetlá */
export const nextColorTheme = (t: ColorTheme): ColorTheme => (t === 'light' ? 'dark' : t === 'dark' ? 'system' : 'light')

media?.addEventListener?.('change', () => colorTheme.value === 'system' && applyColorTheme())
applyColorTheme()
