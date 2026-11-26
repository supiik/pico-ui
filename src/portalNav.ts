// Spoločné ľavé menu aquaria a všetkých admin aplikácií: Prehľad, stránky aktuálnej aplikácie, CRM, Administrácia, Produkty.
// Každá aplikácia ho skladá sama z registra aplikácií (SSM /aquarium/<vetva>/apps, pri builde) – aplikácie ostávajú
// samostatné, spoločný je len vzhľad a SSO. Zoznam `apps` musí byť už odfiltrovaný pravidlom canOpen (pico-security).
import { Contact, LayoutDashboard, Users } from '@lucide/vue'
import { APP_ICONS } from './icons.ts'
import type { NavItem, NavSection } from './nav.ts'

export interface PortalNavApp {
  id: string
  name: string
  url: string
  icon?: string
  product?: { name: string; icon?: string; url: string }
}

/** stránky rozcestníka (hash router aquaria) */
export type PortalPage = 'home' | 'customers' | 'contacts'

export interface PortalNavOptions {
  /** adresa aquaria; prázdna = sme v aquariu (odkazy len #/…) */
  portalUrl: string
  /** admin aplikácie, kam operátor smie (bez rozcestníka) */
  apps: PortalNavApp[]
  /** zobraziť CRM (superadmin a nasadené CRM) */
  crm: boolean
  /** aktuálna stránka aquaria – len v aquariu */
  portalPage?: PortalPage | null
  /** aktuálna admin aplikácia a jej stránky – len v admin aplikácii */
  current?: { id: string; name: string; pages: NavItem[] }
}

export const appIcon = (name?: string) => APP_ICONS[name ?? ''] ?? APP_ICONS.app

export function portalSections(o: PortalNavOptions): NavSection[] {
  const base = o.portalUrl.replace(/\/+$/, '')
  // v aquariu stačí hash, v admin aplikácii plná adresa aquaria
  const portal = (path: string) => (base ? `${base}/#/${path}` : `#/${path}`)
  const out: NavSection[] = [{ items: [{ href: portal(''), label: 'Prehľad', icon: LayoutDashboard, current: o.portalPage === 'home' }] }]
  if (o.current?.pages.length) out.push({ title: o.current.name, items: o.current.pages })
  if (o.crm) {
    out.push({ title: 'CRM', items: [
      { href: portal('zakaznici'), label: 'Zákazníci', icon: Users, current: o.portalPage === 'customers' },
      { href: portal('kontakty'), label: 'Kontakty', icon: Contact, current: o.portalPage === 'contacts' },
    ] })
  }
  if (o.apps.length) {
    out.push({ title: 'Administrácia', items: o.apps.map((a) => ({ href: a.url, label: a.name, icon: appIcon(a.icon) })) })
  }
  const products = o.apps.flatMap((a) => (a.product ? [a.product] : []))
  if (products.length) {
    out.push({ title: 'Produkty', items: products.map((p) => ({ href: p.url, label: p.name, icon: appIcon(p.icon), external: true })) })
  }
  return out
}
