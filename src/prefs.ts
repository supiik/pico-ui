// Prenos jazyka a témy medzi aplikáciami (rôzne domény → cookie ani localStorage sa nezdieľajú):
// odkaz do inej aplikácie dostane `?lang=…&theme=…`, cieľová stránka ich pri načítaní prevezme a z adresy odstráni.
import { colorTheme, isColorTheme, setColorTheme } from './colorTheme.ts'
import { isLocale, locale, setLocale } from './locale.ts'

/** doplní do absolútnej adresy (http/https) aktuálny jazyk a tému; hash (#/…) ostane na konci */
export function carryPrefs(url: string): string {
  if (!/^https?:\/\//.test(url)) return url
  const u = new URL(url)
  u.searchParams.set('lang', locale.value)
  u.searchParams.set('theme', colorTheme.value)
  return u.toString()
}

/** prevezme ?lang= a ?theme= z adresy stránky (volá sa raz pri štarte, kým ešte nebeží router) */
export function takePrefsFromUrl(loc: Pick<Location, 'href'> = location, replace = (u: string) => history.replaceState(history.state, '', u)) {
  const u = new URL(loc.href)
  const lang = u.searchParams.get('lang')
  const theme = u.searchParams.get('theme')
  if (!lang && !theme) return
  if (isLocale(lang)) setLocale(lang)
  if (isColorTheme(theme)) setColorTheme(theme)
  u.searchParams.delete('lang')
  u.searchParams.delete('theme')
  replace(u.toString())
}

if (typeof window !== 'undefined') takePrefsFromUrl()
