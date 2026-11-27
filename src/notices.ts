// Oznámenia a režim údržby na strane aplikácie: zadáva ich superadmin v aquariu, zverejňujú sa ako statické JSON
// (CloudFront): `<url>/operators.json` (aquarium a admin aplikácie), `<url>/customers-<produkt>.json` (používateľské aplikácie).
// Aplikácia si súbor načíta pri štarte, každú minútu a pri návrate na kartu; čas od–do vyhodnocuje sama.
// Chyba siete = žiadne oznámenia (aplikácia kvôli nim nesmie prestať fungovať).
import { computed, getCurrentScope, onScopeDispose, ref } from 'vue'
import type { Locale } from './locale.ts'

export type NoticeKind = 'info' | 'warning' | 'outage' | 'maintenance'
export interface PublicNotice {
  id: string
  kind: NoticeKind
  products: string[]
  from: string
  to: string
  text: { sk: string; en?: string }
}

const KINDS: NoticeKind[] = ['info', 'warning', 'outage', 'maintenance']
const RANK: Record<NoticeKind, number> = { maintenance: 0, outage: 1, warning: 2, info: 3 }

export function isNotice(v: unknown): v is PublicNotice {
  const n = v as PublicNotice
  return !!n && typeof n.id === 'string' && KINDS.includes(n.kind) && Array.isArray(n.products)
    && typeof n.from === 'string' && typeof n.to === 'string' && typeof n.text?.sk === 'string'
}

/** platné teraz, pre daný produkt (bez produktu = všetky), najzávažnejšie prvé */
export function activeNotices(list: PublicNotice[], now: number, product?: string): PublicNotice[] {
  return list
    .filter((n) => Date.parse(n.from) <= now && now < Date.parse(n.to))
    .filter((n) => !product || n.products.includes('*') || n.products.includes(product))
    .sort((a, b) => RANK[a.kind] - RANK[b.kind] || a.from.localeCompare(b.from))
}

export const noticeText = (n: PublicNotice, l: Locale) => (l === 'en' && n.text.en) || n.text.sk
/** výpadok a údržba sa zavrieť nedajú */
export const dismissible = (n: PublicNotice) => n.kind === 'info' || n.kind === 'warning'

const KEY = 'notices-dismissed'
function readDismissed(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[])
  } catch {
    return new Set()
  }
}
function writeDismissed(s: Set<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...s].slice(-100)))
  } catch {
    // bez úložiska platí len do zatvorenia stránky
  }
}

export interface NoticesOptions {
  /** základná adresa (VITE_NOTICES_URL); bez nej nič nenačíta */
  url?: string
  /** operators.json alebo customers-<produkt>.json; viac súborov (zákazník s viacerými produktmi) sa spojí */
  file: string | string[]
  /** len oznámenia pre tento produkt (admin aplikácia: jej id); bez neho všetky */
  product?: string
  /** ako často znova načítať (ms) */
  interval?: number
  fetchFn?: typeof fetch
}

export function useNotices(o: NoticesOptions) {
  const all = ref<PublicNotice[]>([])
  const now = ref(Date.now())
  const dismissed = ref(readDismissed())
  const fetchFn = o.fetchFn ?? ((...a: Parameters<typeof fetch>) => fetch(...a))
  let byFile: PublicNotice[][] = []

  async function load() {
    now.value = Date.now()
    if (!o.url) return
    const base = o.url.replace(/\/+$/, '')
    const files = Array.isArray(o.file) ? o.file : [o.file]
    // každý súbor zvlášť: pri chybe jedného ostane jeho posledný známy stav, ostatné sa obnovia
    const lists = await Promise.all(files.map(async (f, i) => {
      try {
        // no-store: bez overovania uloženej kópie (304) – pri nej mohla chýbať hlavička CORS
        const r = await fetchFn(`${base}/${f}`, { cache: 'no-store' })
        if (!r.ok) return byFile[i] ?? []
        const data = (await r.json()) as unknown
        return Array.isArray(data) ? data.filter(isNotice) : []
      } catch {
        return byFile[i] ?? [] // sieť alebo neplatný súbor
      }
    }))
    byFile = lists
    // to isté oznámenie môže byť vo viacerých súboroch (napr. pre všetky produkty)
    const seen = new Set<string>()
    all.value = lists.flat().filter((n) => !seen.has(n.id) && seen.add(n.id))
  }

  if (typeof window !== 'undefined' && o.url) {
    void load()
    const timer = setInterval(load, o.interval ?? 60_000)
    const onVisible = () => document.visibilityState === 'visible' && load()
    document.addEventListener('visibilitychange', onVisible)
    if (getCurrentScope()) {
      onScopeDispose(() => {
        clearInterval(timer)
        document.removeEventListener('visibilitychange', onVisible)
      })
    }
  }

  const active = computed(() => activeNotices(all.value, now.value, o.product))
  const visible = computed(() => active.value.filter((n) => !dismissible(n) || !dismissed.value.has(n.id)))
  const maintenance = computed(() => active.value.find((n) => n.kind === 'maintenance') ?? null)

  function dismiss(id: string) {
    dismissed.value = new Set([...dismissed.value, id])
    writeDismissed(dismissed.value)
  }
  /** znova ukáže zatvorené (zvonček) */
  function restore() {
    const ids = new Set(active.value.map((n) => n.id))
    dismissed.value = new Set([...dismissed.value].filter((id) => !ids.has(id)))
    writeDismissed(dismissed.value)
  }
  return { all, active, visible, maintenance, dismiss, restore, load }
}

export type Notices = ReturnType<typeof useNotices>
