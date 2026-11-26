# pico-ui – pokyny pre Claude

Zdrojový balík `@supiik/pico-ui`: spoločné UI aquaria a admin aplikácií. Popis exportov v README.md. Celé UI a komentáre po slovensky.
Bezpečnosť (prihlásenie, oprávnenia, kontrakt) je v samostatnom balíku `@supiik/pico-security` – sem nepatrí.

- **Git commity po anglicky** (conventional commits). **Kľúče a heslá nikdy do gitu.**
- **UI:** komponenty shadcn-vue (register new-york-v4, Reka UI) v `src/ui/` s relatívnymi importmi; vlastné úpravy označ komentárom
  („úprava oproti registru“). Vyššie komponenty v `src/components/` (AppShell, SidebarNav, DataTable, FormDialog, ConfirmHost, Spinner, AppIcon).
  Všetky tabuľky majú zebru (`ui/table/Table.vue`) a tabuľky s dátami zo servera tlačidlo Obnoviť (`DataTable @refresh`); každé čakanie spinner, potvrdenie cez `confirm()` (nie `window.confirm`).
- Ikony aplikácií: názov v `iconNames.ts` (bez Vue – používa ho aj syntéza CDK), komponent v `icons.ts`.
- Prístupnosť: ovládanie klávesnicou, viditeľné zameranie, texty pre čítačku, veľkosti v `rem`.
- Balík je zdrojový (Vite ho skompiluje), okrem `dist/iconNames.js` pre Node (syntéza CDK nespúšťa TypeScript z `node_modules`);
  vytvára ho `npm run build` (aj `npm test`), commituj ho s `src/`. Súbor so stavom (napr. `confirm.ts`) nikdy nedávaj do `dist/` –
  vznikli by dve inštancie.
- Verzie: zmena → `version` v package.json → commit → aplikácie si zmenia commit v závislosti `git+https://github.com/supiik/pico-ui.git#<commit>`.
- Pred commitom `npm test` a `npm run typecheck`.
