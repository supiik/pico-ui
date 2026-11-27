// Spoločné ľavé menu aquaria a všetkých admin aplikácií: Prehľad, stránky aktuálnej aplikácie, CRM, Administrácia, Produkty.
// Každá aplikácia ho skladá sama z registra aplikácií (SSM /aquarium/<vetva>/apps, pri builde) – aplikácie ostávajú
// samostatné, spoločný je len vzhľad a SSO. Zoznam `apps` musí byť už odfiltrovaný pravidlom canOpen (pico-security).
import { Contact, LayoutDashboard, Megaphone, UserCog, Users } from '@lucide/vue'
import { APP_ICONS } from './icons.ts'
import { pt } from './messages.ts'
import { carryPrefs } from './prefs.ts'
import type { NavItem, NavSection } from './nav.ts'

export interface PortalNavApp {
  id: string
  name: string
  url: string
  icon?: string
  product?: { name: string; icon?: string; url: string }
}

/** stránky rozcestníka (hash router aquaria) */
export type PortalPage = 'home' | 'customers' | 'contacts' | 'notices' | 'operators'

export interface PortalNavOptions {
  /** adresa aquaria; prázdna = sme v aquariu (odkazy len #/…) */
  portalUrl: string
  /** admin aplikácie, kam operátor smie (bez rozcestníka) */
  apps: PortalNavApp[]
  /** zobraziť CRM a Prevádzku (superadmin a nasadené CRM) */
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
  // odkazy do iných aplikácií nesú jazyk a tému (rôzne domény, pozri prefs.ts)
  const portal = (path: string) => (base ? carryPrefs(`${base}/#/${path}`) : `#/${path}`)
  const out: NavSection[] = [{ items: [{ href: portal(''), label: pt('navHome'), icon: LayoutDashboard, current: o.portalPage === 'home' }] }]
  if (o.current?.pages.length) out.push({ title: o.current.name, items: o.current.pages })
  if (o.crm) {
    out.push({ title: pt('navCrm'), items: [
      { href: portal('zakaznici'), label: pt('navCustomers'), icon: Users, current: o.portalPage === 'customers' },
      { href: portal('kontakty'), label: pt('navContacts'), icon: Contact, current: o.portalPage === 'contacts' },
    ] })
    // prevádzka (oznámenia, údržba, operátori a ich skupiny) – tiež len superadmin, v aquariu
    out.push({ title: pt('navOps'), items: [
      { href: portal('oznamenia'), label: pt('navNotices'), icon: Megaphone, current: o.portalPage === 'notices' },
      { href: portal('operatori'), label: pt('navOperators'), icon: UserCog, current: o.portalPage === 'operators' },
    ] })
  }
  if (o.apps.length) {
    out.push({ title: pt('navAdmin'), items: o.apps.map((a) => ({ href: carryPrefs(a.url), label: a.name, icon: appIcon(a.icon) })) })
  }
  const products = o.apps.flatMap((a) => (a.product ? [a.product] : []))
  if (products.length) {
    out.push({ title: pt('navProducts'), items: products.map((p) => ({ href: carryPrefs(p.url), label: p.name, icon: appIcon(p.icon), external: true })) })
  }
  return out
}
