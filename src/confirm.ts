// Potvrdzovací dialóg namiesto window.confirm: `if (await confirm({ title: 'Odstrániť?' })) …`.
// Zobrazuje ho <ConfirmHost /> – vlož ho raz do koreňa aplikácie (App.vue).
// Závažné zásahy (zablokovanie zákazníka…): `confirmTyped()` – treba napísať „áno“ alebo „yes“ (aj „ano“) a voliteľne dôvod.
import { reactive } from 'vue'

export interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /** destructive = červené tlačidlo (mazanie, odpojenie, zrušenie licencie) */
  variant?: 'default' | 'destructive'
  /** potvrdenie napísaním „áno“ / „yes“ (confirmTyped) */
  typed?: boolean
  /** pole na dôvod (confirmTyped); required = bez dôvodu nejde potvrdiť */
  reason?: { label: string; required?: boolean }
}

/** slová, ktorými sa potvrdzuje závažný zásah (bez ohľadu na veľkosť písmen a medzery okolo) */
export const CONFIRM_WORDS = ['áno', 'ano', 'yes']
export const isConfirmWord = (s: string) => CONFIRM_WORDS.includes(s.trim().toLowerCase())

export const confirmState = reactive<{
  open: boolean
  options: ConfirmOptions
  typed: string
  reason: string
  resolve: ((answer: { reason: string } | null) => void) | null
}>({ open: false, options: { title: '' }, typed: '', reason: '', resolve: null })

function open(options: ConfirmOptions): Promise<{ reason: string } | null> {
  confirmState.resolve?.(null) // predchádzajúci (ak ešte visí) sa ruší
  return new Promise((resolve) => {
    Object.assign(confirmState, { open: true, options, typed: '', reason: '', resolve })
  })
}

/** otvorí potvrdzovací dialóg; true = potvrdené, false = zrušené (aj Esc, klik mimo) */
export async function confirm(options: ConfirmOptions): Promise<boolean> {
  return (await open(options)) !== null
}

/** závažný zásah: potvrdenie napísaním „áno“/„yes“; vráti dôvod (alebo '') alebo null pri zrušení */
export async function confirmTyped(options: Omit<ConfirmOptions, 'typed'>): Promise<{ reason: string } | null> {
  return open({ variant: 'destructive', ...options, typed: true })
}

/** dá sa potvrdiť? (napísané slovo, povinný dôvod) */
export function canSettle(): boolean {
  const o = confirmState.options
  if (o.typed && !isConfirmWord(confirmState.typed)) return false
  if (o.reason?.required && !confirmState.reason.trim()) return false
  return true
}

/** ukončenie dialógu (volá ConfirmHost) */
export function settleConfirm(ok: boolean) {
  if (ok && !canSettle()) return
  const r = confirmState.resolve
  const reason = confirmState.reason.trim()
  Object.assign(confirmState, { open: false, resolve: null, typed: '', reason: '' })
  r?.(ok ? { reason } : null)
}
