// Položky ľavého menu (AppShell). Admin aplikácie majú hash router, preto odkazy `#/cesta`.
import type { Component } from 'vue'

export interface NavItem {
  href: string
  label: string
  icon?: Component
  /** aktuálna stránka (zvýrazní sa, aria-current) */
  current?: boolean
  /** otvorí sa v novom okne (napr. produktová aplikácia) */
  external?: boolean
}

export interface NavSection {
  /** nadpis skupiny v menu (voliteľný) */
  title?: string
  items: NavItem[]
}
