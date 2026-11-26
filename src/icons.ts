// Ikony admin aplikácií (Lucide). Názov sa uvádza v registri aquaria (config/apps.ts → icon).
import type { Component } from 'vue'
import type { AppIconName } from './iconNames.ts'
import {
  AppWindow, BookOpen, Building2, ChartColumn, GraduationCap, LayoutTemplate, Music, School, ShieldCheck, Users,
} from '@lucide/vue'

export const APP_ICONS: Record<AppIconName, Component> & Record<string, Component | undefined> = {
  app: AppWindow,
  book: BookOpen,
  building: Building2,
  chart: ChartColumn,
  graduation: GraduationCap,
  template: LayoutTemplate,
  music: Music,
  school: School,
  shield: ShieldCheck,
  users: Users,
}

export { APP_ICON_NAMES } from './iconNames.ts'
