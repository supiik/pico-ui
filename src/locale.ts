// Jazyk rozhrania (slovenčina / angličtina) – spoločný pre komponenty pico-ui aj pre aplikácie.
// Voľba sa pamätá v cookie `locale` (rovnako ako v orgasme, 1 rok, SameSite=Lax). Aplikácie bežia na rôznych doménach,
// preto sa voľba jazyka a témy prenáša aj v odkazoch medzi nimi (`?lang=en&theme=dark`, pozri carryPrefs) –
// pri načítaní stránky sa z adresy prečíta, uloží a z adresy odstráni.
import { ref } from 'vue'

export const LOCALES = ['sk', 'en'] as const
export type Locale = (typeof LOCALES)[number]
/** názov jazyka v ňom samom (do prepínača) */
export const LOCALE_NAMES: Record<Locale, string> = { sk: 'Slovenčina', en: 'English' }
/** jazykový tag pre Intl (dátumy, čísla) */
export const LOCALE_TAGS: Record<Locale, string> = { sk: 'sk-SK', en: 'en-GB' }
export const LOCALE_COOKIE = 'locale'

const browser = typeof document !== 'undefined'
export const isLocale = (v: unknown): v is Locale => typeof v === 'string' && (LOCALES as readonly string[]).includes(v)

function readCookie(): Locale | null {
  if (!browser) return null
  const m = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/)
  const v = m ? decodeURIComponent(m[1]) : null
  return isLocale(v) ? v : null
}

/** cookie → jazyk prehliadača (sk-SK → sk) → predvolený */
export function detectLocale(fallback: Locale = 'sk', langs: readonly string[] = browser ? navigator.languages ?? [navigator.language] : []): Locale {
  const c = readCookie()
  if (c) return c
  for (const l of langs) {
    const base = l?.split('-')[0]?.toLowerCase()
    if (isLocale(base)) return base
  }
  return fallback
}

export const locale = ref<Locale>(detectLocale())

export function setLocale(l: Locale) {
  locale.value = l
  if (!browser) return
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${LOCALE_COOKIE}=${l}; Max-Age=${60 * 60 * 24 * 365}; Path=/; SameSite=Lax${secure}`
  document.documentElement.lang = l
}

type Params = Record<string, string | number>

/**
 * Výber tvaru podľa čísla: správa „tvar1|tvar2|tvar3“ a parameter `count`.
 * slovenčina: 1 | 2–4 | 0 a 5+ ; angličtina: 1 | ostatné
 */
export function pluralIndex(l: Locale, n: number): number {
  if (l === 'sk') return n === 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2
  return n === 1 ? 0 : 1
}

export function format(l: Locale, message: string, params?: Params): string {
  let m = message
  if (params && typeof params.count === 'number' && m.includes('|')) {
    const forms = m.split('|')
    m = forms[Math.min(pluralIndex(l, params.count), forms.length - 1)]
  }
  return params ? m.replace(/\{(\w+)\}/g, (_, k: string) => (k in params ? String(params[k]) : `{${k}}`)) : m
}

/**
 * Preklady aplikácie: `const t = createT({ sk, en })`, potom `t('kluc', { n: 1 })`.
 * Číta aktuálny jazyk pri každom volaní – v šablóne a v computed sa preto prekreslí po prepnutí jazyka.
 * Chýbajúci preklad v angličtine padne na slovenčinu (test v aplikácii má strážiť rovnaké kľúče).
 */
export function createT<M extends Record<string, string>>(dict: { sk: M; en: { [K in keyof M]: string } }) {
  return (key: keyof M & string, params?: Params): string => format(locale.value, dict[locale.value][key] ?? dict.sk[key] ?? key, params)
}

/** dátum podľa jazyka: date = 26. 11. 2026, dateTime = + čas, month = november 2026 */
export function formatDate(value: string | number | Date, style: 'date' | 'dateTime' | 'month' = 'date'): string {
  const d = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  const opts: Intl.DateTimeFormatOptions = style === 'month' ? { month: 'long', year: 'numeric' }
    : style === 'dateTime' ? { dateStyle: 'short', timeStyle: 'short' } : { dateStyle: 'medium' }
  return d.toLocaleString(LOCALE_TAGS[locale.value], opts)
}

/** kľúče, ktoré chýbajú alebo prebývajú v niektorom jazyku – pre test v aplikácii */
export function missingKeys(dict: Record<Locale, Record<string, string>>): string[] {
  const all = new Set(LOCALES.flatMap((l) => Object.keys(dict[l])))
  return [...all].flatMap((k) => LOCALES.filter((l) => !(k in dict[l])).map((l) => `${l}: ${k}`))
}
