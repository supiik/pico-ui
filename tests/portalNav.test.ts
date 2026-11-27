import { describe, expect, it } from 'vitest'
import { portalSections } from '../src/portalNav.ts'

const apps = [
  { id: 'orgasm', name: 'Orgasm admin', url: 'https://o.example/', icon: 'users', product: { name: 'Orgasm', icon: 'music', url: 'https://orgasm.example/' } },
  { id: 'sharpn', name: 'Sharpn admin', url: 'https://s.example/' },
]
const titles = (s: ReturnType<typeof portalSections>) => s.map((x) => x.title ?? '')

describe('spoločné menu', () => {
  it('v aquariu: hash odkazy, CRM a aktuálna stránka', () => {
    const s = portalSections({ portalUrl: '', apps, crm: true, portalPage: 'contacts' })
    expect(titles(s)).toEqual(['', 'CRM', 'Prevádzka', 'Administrácia'])
    expect(s[0].items[0]).toMatchObject({ href: '#/', current: false })
    expect(s[1].items[1]).toMatchObject({ href: '#/kontakty', current: true })
    expect(s[2].items[0]).toMatchObject({ href: '#/oznamenia', current: false })
    expect(s[2].items[1]).toMatchObject({ href: '#/operatori', label: 'Operátori' })
    expect(s[4].items).toEqual([expect.objectContaining({ href: 'https://orgasm.example/?lang=sk&theme=system', external: true })])
  })

  it('v admin aplikácii len vlastné: späť do aquaria, stránky aplikácie a jej produkt – bez CRM a iných aplikácií aj pre superadmina', () => {
    const pages = [{ href: '#/licencie', label: 'Licencie', current: true }]
    const s = portalSections({ portalUrl: 'https://aq.example/', apps, crm: true, current: { id: 'orgasm', name: 'Orgasm admin', pages } })
    expect(titles(s)).toEqual(['', '', 'Produkt'])
    expect(s[0].items).toEqual([expect.objectContaining({ href: 'https://aq.example/?lang=sk&theme=system#/', label: 'Späť do aquaria' })])
    expect(s[1].items).toBe(pages)
    expect(s[2].items).toEqual([expect.objectContaining({ label: 'Orgasm', href: 'https://orgasm.example/?lang=sk&theme=system', external: true })])
    // aplikácia bez produktu: len späť a stránky
    expect(titles(portalSections({ portalUrl: 'https://aq.example/', apps, crm: true, current: { id: 'sharpn', name: 'Sharpn admin', pages } }))).toEqual(['', ''])
  })

  it('bez aplikácií a produktov sa prázdne sekcie nezobrazia', () => {
    expect(titles(portalSections({ portalUrl: '', apps: [], crm: false }))).toEqual([''])
  })
})
