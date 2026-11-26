# @supiik/pico-ui

Spoločné UI aquaria a admin aplikácií produktov (admin-template, orgasm-admin, sharpn-admin, …).
Balík je zdrojový (TypeScript a Vue SFC bez buildu) – skompiluje ho Vite aplikácie. Prihlásenie a oprávnenia sú v `@supiik/pico-security`.

| Import | Obsah |
|---|---|
| `@supiik/pico-ui/ui/<komponent>` | komponenty shadcn-vue (Reka UI): button, input, label, card, table, badge, alert, dialog, sheet, native-select, textarea, separator |
| `@supiik/pico-ui/AppShell.vue`, `SidebarNav.vue`, `nav` | rám aplikácie: ľavé menu (sekcie, ikony, používateľ, odhlásenie), na mobile vysúvacie menu |
| `@supiik/pico-ui/portalNav` | `portalSections()` – spoločné ľavé menu aquaria a admin aplikácií (Prehľad, stránky aplikácie, CRM, Administrácia, Produkty) z registra aplikácií |
| `@supiik/pico-ui/DataTable.vue` | tabuľka dát: stĺpce, sloty buniek, akcie, načítanie, prázdny stav, zebra, tlačidlo Obnoviť (`@refresh`) |
| `@supiik/pico-ui/FormDialog.vue` | dialóg s formulárom (Uložiť/Zrušiť, chyba, spinner) |
| `@supiik/pico-ui/confirm` + `ConfirmHost.vue` | `await confirm({ title })` namiesto `window.confirm` |
| `@supiik/pico-ui/Spinner.vue` | indikátor asynchrónnej operácie (povinný pri každom čakaní) |
| `@supiik/pico-ui/AppIcon.vue`, `icons`, `iconNames` | ikony aplikácií podľa názvu z registra |
| `@supiik/pico-ui/utils` | `cn()` |
| `@supiik/pico-ui/theme.css` | téma Tailwind 4 (farby, zaoblenie, písmo) |

## Použitie v aplikácii

```bash
npm i git+https://github.com/supiik/pico-ui.git#<commit>
npm i reka-ui @lucide/vue @vueuse/core class-variance-authority clsx tailwind-merge tw-animate-css
```

`src/global.css`:

```css
@import "tailwindcss";
@import "@supiik/pico-ui/theme.css";
@source "../node_modules/@supiik/pico-ui/src";
```

`vite.config.ts`: `optimizeDeps: { exclude: ['@supiik/pico-ui'] }`. Raz v `App.vue`: `<ConfirmHost />`.

## Zmeny

Zmena → test (`npm test`, `npm run typecheck`) → nová verzia v `package.json` → commit (s `dist/`) → v aplikáciách
`npm i git+https://github.com/supiik/pico-ui.git#<commit>`.
