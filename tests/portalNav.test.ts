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
    expect(titles(s)).toEqual(['', 'CRM', 'Administrácia', 'Produkty'])
    expect(s[0].items[0]).toMatchObject({ href: '#/', current: false })
    expect(s[1].items[1]).toMatchObject({ href: '#/kontakty', current: true })
    expect(s[3].items).toEqual([expect.objectContaining({ href: 'https://orgasm.example/?lang=sk&theme=system', external: true })])
  })

  it('v admin aplikácii: odkazy do aquaria, sekcia aplikácie hneď pod prehľadom, bez CRM pre bežného operátora', () => {
    const pages = [{ href: '#/licencie', label: 'Licencie', current: true }]
    const s = portalSections({ portalUrl: 'https://aq.example/', apps, crm: false, current: { id: 'orgasm', name: 'Orgasm admin', pages } })
    expect(titles(s)).toEqual(['', 'Orgasm admin', 'Administrácia', 'Produkty'])
    expect(s[0].items[0].href).toBe('https://aq.example/?lang=sk&theme=system#/')
    expect(s[1].items).toBe(pages)
  })

  it('bez aplikácií a produktov sa prázdne sekcie nezobrazia', () => {
    expect(titles(portalSections({ portalUrl: '', apps: [], crm: false }))).toEqual([''])
  })
})
