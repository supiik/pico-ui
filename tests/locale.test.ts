import { describe, expect, it } from 'vitest'
import { createT, detectLocale, format, locale, missingKeys, pluralIndex, setLocale } from '../src/locale.ts'
import { PICO_MESSAGES } from '../src/messages.ts'
import { carryPrefs, takePrefsFromUrl } from '../src/prefs.ts'
import { colorTheme, nextColorTheme } from '../src/colorTheme.ts'

describe('jazyk', () => {
  it('texty komponentov majú v oboch jazykoch rovnaké kľúče', () => {
    expect(missingKeys(PICO_MESSAGES)).toEqual([])
  })
  it('tvary podľa čísla: slovenčina 1 | 2–4 | 0 a 5+, angličtina 1 | ostatné', () => {
    expect([0, 1, 2, 4, 5].map((n) => pluralIndex('sk', n))).toEqual([2, 0, 1, 1, 2])
    expect([0, 1, 2].map((n) => pluralIndex('en', n))).toEqual([1, 0, 1])
    expect(format('sk', '{count} kontakt|{count} kontakty|{count} kontaktov', { count: 3 })).toBe('3 kontakty')
    expect(format('en', '{count} contact|{count} contacts', { count: 1 })).toBe('1 contact')
  })
  it('createT prepína jazyk a dopĺňa parametre', () => {
    const t = createT({ sk: { hi: 'Ahoj {meno}' }, en: { hi: 'Hi {meno}' } })
    locale.value = 'sk'
    expect(t('hi', { meno: 'Peter' })).toBe('Ahoj Peter')
    locale.value = 'en'
    expect(t('hi', { meno: 'Peter' })).toBe('Hi Peter')
    locale.value = 'sk'
  })
  it('jazyk prehliadača sk-SK → sk, neznámy → predvolený', () => {
    expect(detectLocale('sk', ['en-US'])).toBe('en')
    expect(detectLocale('en', ['de-DE'])).toBe('en')
    expect(detectLocale('sk', ['sk-SK', 'en'])).toBe('sk')
  })
})

describe('prenos jazyka a témy medzi aplikáciami', () => {
  it('odkaz do inej aplikácie nesie jazyk a tému, hash ostane na konci', () => {
    setLocale('en')
    colorTheme.value = 'dark'
    expect(carryPrefs('https://a.example/#/licencie')).toBe('https://a.example/?lang=en&theme=dark#/licencie')
    expect(carryPrefs('#/kontakty')).toBe('#/kontakty')
    setLocale('sk')
    colorTheme.value = 'system'
  })
  it('stránka prevezme ?lang a ?theme a odstráni ich z adresy', () => {
    let replaced = ''
    takePrefsFromUrl({ href: 'https://a.example/?lang=en&theme=light#/x' }, (u) => (replaced = u))
    expect(locale.value).toBe('en')
    expect(colorTheme.value).toBe('light')
    expect(replaced).toBe('https://a.example/#/x')
    setLocale('sk')
  })
  it('téma sa prepína svetlá → tmavá → podľa zariadenia', () => {
    expect(['light', 'dark', 'system'].map((t) => nextColorTheme(t as 'light'))).toEqual(['dark', 'system', 'light'])
  })
})
