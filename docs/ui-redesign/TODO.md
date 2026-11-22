# TODO (fuori dal solo restyling: richiedono backend/DB, da discutere)

- [ ] **Preset di ruoli salvabili** (newGame): salvare/caricare composizioni di ruoli per utente → tabella DB + endpoint REST. Nel mock: solo stato locale.
- [ ] **Colore utente personalizzato** (profile): default = hash del nome (solo frontend); la scelta personalizzata va salvata → colonna su `player` + endpoint. Nel mock: solo stato locale.
- [ ] **Ordine dei posti** (newGame): verificare che il backend conservi l'ordine dei `player` inviati a `game/create` e che le viste di gioco lo usino (cerchio giocatori).
- [ ] **Icona per ruolo a DB**: colonna `icon` (classe Font Awesome) sulla tabella `role` + esposta in `/api/rules/roles` e nelle risposte di gioco; finché non c'è, il frontend usa la mappa `ROLE_ICONS` del kit.
- [ ] **CurrentGame in React** (scelta concept F2): riscrivere azioni/cerchio/log come componenti React mantenendo chiamate REST e WebSocket identici; serve un piano dedicato + e2e completo (notte/giorno/voto/fine partita).
- [ ] **Fazione dei ruoli nelle statistiche**: `user/<u>/statistic` non restituisce il tipo del ruolo → `UserStatistics.jsx` usa una mappa statica (`// shortcut:`). Aggiungere il tipo alla risposta (o usare `/api/rules/roles`).
- [ ] **`CHART_URL` in `components/user/externalScripts.js`** non è più usato (le statistiche non caricano più Chart.js): rimuovere. `sorttable` serve ancora a `FriendsPanel` finché non viene migrato.
- [ ] **Data di registrazione** dell'utente (profilo e statistiche nei mock): l'API non la fornisce → non mostrata.
- [ ] **Pulizia `components/user/shared.js`**: export non più usati dopo la migrazione (`INPUT`, `LABEL`, `SECTION_BOX`, `HR`, `SHOW_PASSWORD_BTN`, `FORM_GROUP`).
