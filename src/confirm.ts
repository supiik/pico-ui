// Potvrdzovací dialóg namiesto window.confirm: `if (await confirm({ title: 'Odstrániť?' })) …`.
// Zobrazuje ho <ConfirmHost /> – vlož ho raz do koreňa aplikácie (App.vue).
import { reactive } from 'vue'

export interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /** destructive = červené tlačidlo (mazanie, odpojenie, zrušenie licencie) */
  variant?: 'default' | 'destructive'
}

export const confirmState = reactive<{ open: boolean; options: ConfirmOptions; resolve: ((ok: boolean) => void) | null }>({
  open: false,
  options: { title: '' },
  resolve: null,
})

/** otvorí potvrdzovací dialóg; true = potvrdené, false = zrušené (aj Esc, klik mimo) */
export function confirm(options: ConfirmOptions): Promise<boolean> {
  confirmState.resolve?.(false) // predchádzajúci (ak ešte visí) sa ruší
  return new Promise((resolve) => {
    Object.assign(confirmState, { open: true, options, resolve })
  })
}

/** ukončenie dialógu (volá ConfirmHost) */
export function settleConfirm(ok: boolean) {
  const r = confirmState.resolve
  Object.assign(confirmState, { open: false, resolve: null })
  r?.(ok)
}
