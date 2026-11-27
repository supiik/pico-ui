import { describe, expect, it } from 'vitest'
import { confirm, confirmState, settleConfirm } from '../src/confirm.ts'
import { APP_ICON_NAMES } from '../src/iconNames.ts'

describe('confirm', () => {
  it('potvrdenie a zrušenie', async () => {
    const a = confirm({ title: 'Odstrániť?' })
    expect(confirmState).toMatchObject({ open: true, options: { title: 'Odstrániť?' } })
    settleConfirm(true)
    expect(await a).toBe(true)
    expect(confirmState.open).toBe(false)
    const b = confirm({ title: 'Iné' })
    settleConfirm(false)
    expect(await b).toBe(false)
  })
  it('nový dialóg zruší starý, ktorý ešte visí', async () => {
    const first = confirm({ title: '1' })
    const second = confirm({ title: '2' })
    expect(await first).toBe(false)
    settleConfirm(true)
    expect(await second).toBe(true)
  })
})

describe('ikony aplikácií', () => {
  it('každý názov má ikonu', async () => {
    const { APP_ICONS } = await import('../src/icons.ts')
    for (const n of APP_ICON_NAMES) expect(APP_ICONS[n]).toBeTruthy()
  })
})

describe('confirmTyped', () => {
  it('potvrdí sa až po napísaní „áno“/„yes“ a povinnom dôvode; vráti dôvod', async () => {
    const { confirmTyped, confirmState, settleConfirm, isConfirmWord } = await import('../src/confirm.ts')
    expect(['áno', ' ANO ', 'Yes'].every(isConfirmWord)).toBe(true)
    expect(isConfirmWord('y')).toBe(false)
    const p = confirmTyped({ title: 'Zablokovať?', reason: { label: 'Dôvod', required: true } })
    expect(confirmState.options.variant).toBe('destructive')
    settleConfirm(true) // nič nenapísané – ostane otvorený
    expect(confirmState.open).toBe(true)
    confirmState.typed = 'áno'
    settleConfirm(true) // chýba dôvod
    expect(confirmState.open).toBe(true)
    confirmState.reason = '  porušenie pravidiel '
    settleConfirm(true)
    expect(await p).toEqual({ reason: 'porušenie pravidiel' })
    const q = confirmTyped({ title: 'Zrušiť?' })
    settleConfirm(false)
    expect(await q).toBeNull()
  })
})
