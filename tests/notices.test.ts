import { describe, expect, it } from 'vitest'
import { effectScope } from 'vue'
import { activeNotices, dismissible, noticeText, useNotices } from '../src/notices.ts'
import type { PublicNotice } from '../src/notices.ts'

const n = (id: string, kind: PublicNotice['kind'], products = ['*'], from = '2026-12-01T10:00:00Z', to = '2026-12-01T12:00:00Z'): PublicNotice =>
  ({ id, kind, products, from, to, text: { sk: `sk ${id}`, en: `en ${id}` } })
const at = Date.parse('2026-12-01T11:00:00Z')

describe('oznámenia v aplikácii', () => {
  it('len platné teraz a pre produkt, údržba a výpadok prvé', () => {
    const list = [n('i', 'info'), n('w', 'warning', ['sharpn']), n('m', 'maintenance', ['orgasm']), n('o', 'outage'), n('old', 'info', ['*'], '2026-11-01T00:00:00Z', '2026-11-02T00:00:00Z')]
    expect(activeNotices(list, at, 'orgasm').map((x) => x.id)).toEqual(['m', 'o', 'i'])
    expect(activeNotices(list, at).map((x) => x.id)).toEqual(['m', 'o', 'w', 'i'])
  })
  it('text podľa jazyka, bez anglického slovenský; zavrieť len info a upozornenie', () => {
    expect(noticeText({ ...n('a', 'info'), text: { sk: 'len sk' } }, 'en')).toBe('len sk')
    expect(noticeText(n('a', 'info'), 'en')).toBe('en a')
    expect(['info', 'warning', 'outage', 'maintenance'].map((k) => dismissible(n('x', k as PublicNotice['kind'])))).toEqual([true, true, false, false])
  })
  it('načíta súbor, zahodí neplatné položky, pri chybe siete ponechá stav', async () => {
    let ok = true
    const fetchFn = (async () => (ok ? { ok: true, json: async () => [n('a', 'info', ['*'], '2000-01-01T00:00:00Z', '2999-01-01T00:00:00Z'), { id: 1 }] } : Promise.reject(new Error('net')))) as unknown as typeof fetch
    const scope = effectScope()
    const s = scope.run(() => useNotices({ url: 'https://cdn/notices/', file: 'operators.json', fetchFn }))!
    await s.load()
    expect(s.active.value.map((x) => x.id)).toEqual(['a'])
    ok = false
    await s.load()
    expect(s.active.value.map((x) => x.id)).toEqual(['a'])
    s.dismiss('a')
    expect(s.visible.value).toEqual([])
    s.restore()
    expect(s.visible.value.map((x) => x.id)).toEqual(['a'])
    scope.stop()
  })
})
