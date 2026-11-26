# pico-ui – pokyny pre Claude

Zdrojový balík `@supiik/pico-ui`: spoločné UI aquaria a admin aplikácií. Popis exportov v README.md. Celé UI a komentáre po slovensky.
Bezpečnosť (prihlásenie, oprávnenia, kontrakt) je v samostatnom balíku `@supiik/pico-security` – sem nepatrí.

- **Git commity po anglicky** (conventional commits). **Kľúče a heslá nikdy do gitu.**
- **UI:** komponenty shadcn-vue (register new-york-v4, Reka UI) v `src/ui/` s relatívnymi importmi; vlastné úpravy označ komentárom
  („úprava oproti registru“). Vyššie komponenty v `src/components/` (AppShell, SidebarNav, DataTable, FormDialog, ConfirmHost, Spinner, AppIcon).
  Všetky tabuľky majú zebru (`ui/table/Table.vue`), každé čakanie spinner, potvrdenie cez `confirm()` (nie `window.confirm`).
- Ikony aplikácií: názov v `iconNames.ts` (bez Vue – používa ho aj syntéza CDK), komponent v `icons.ts`.
- Prístupnosť: ovládanie klávesnicou, viditeľné zameranie, texty pre čítačku, veľkosti v `rem`.
- Verzie: zmena → `version` v package.json → tag `vX.Y.Z` → aplikácie si zvýšia verziu. Bez buildu – balík je zdrojový.
- Pred commitom `npm test` a `npm run typecheck`.
