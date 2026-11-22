# Concept: deploy di una web app full-stack (Docker + GHCR + self-hosted)

> Documento da passare a un agente che deve impostare **da zero** l'infrastruttura di
> deploy di una web app con la stessa architettura di questo repo (FinanceWebApp).
> Descrive *cosa* costruire e *perché*; i blocchi di codice sono template da adattare.
> Sostituisci `<app>`, `<owner>`, porte e nomi servizio con quelli del nuovo progetto.

---

## 0. Obiettivi e principi

1. **Un solo repo (monorepo)**, un servizio per cartella, ognuno col proprio `Dockerfile`.
2. **Dev = `docker compose up`**: tutto lo stack in hot-reload, codice montato come volume.
3. **Prod = immagini già costruite** (GHCR) e solo `pull` + `up -d` sul server. Il server
   non compila mai backend/frontend.
4. **Una sola immagine per tutti gli ambienti** (demo, prod): ciò che cambia tra ambienti
   arriva a **runtime** dal `.env` del server, non dal build.
5. **Un solo `.env` alla root** alimenta tutti i servizi via Compose. Mai committato.
6. **La versione nasce dal nome del branch di release** (`release/vX.Y.Z`) → diventa un
   git tag → viene letta al deploy e mostrata nell'app.
7. **Feature opzionali disattivate se la loro env è vuota** (push, open banking, backup,
   email…): l'app e i test partono anche senza segreti.

---

## 1. Struttura del repo

```
/
├── backend/                 # API (qui: Spring Boot 3, Java 21, Gradle)
│   └── Dockerfile           # multi-stage: base → development → builder → production
├── frontend/                # SPA (qui: React + Vite + TS, PWA)
│   ├── Dockerfile           # multi-stage: base → development → build-prod → production (nginx)
│   ├── nginx.conf
│   ├── docker-entrypoint.d/40-config.sh   # genera /config.js a runtime
│   └── public/config.js     # placeholder dev: window.__ENV__ = {};
├── mcp-server/              # servizio ausiliario (qui: Python FastMCP)
│   └── Dockerfile
├── docker-compose.yml       # DEV: build locale, volumi, hot-reload, DB incluso
├── docker-compose.prod.yml  # PROD: image da GHCR, nessun volume di codice
├── .env                     # git-ignored, unico per tutti i servizi
├── .env.example             # committato: tutte le chiavi, nessun valore segreto
├── secrets/                 # git-ignored: file segreti (PEM, chiavi) montati read-only
└── .github/workflows/deploy.yml
```

`.gitignore` deve includere almeno: `.env`, `.env*` (tranne `.env.example`), `secrets/`,
`postgres_data/`, `node_modules/`, `dist/`, `build/`.

---

## 2. Dockerfile (pattern multi-stage)

Regola: **uno stage `development`** (usato da compose dev) e **uno stage `production`**
(usato dalla CI con `target: production`). Le dipendenze si installano in uno stage `base`
condiviso per sfruttare la cache.

### Backend (JVM)

```dockerfile
FROM gradle:9-jdk21 AS base
WORKDIR /app
COPY build.gradle settings.gradle ./
RUN gradle dependencies --no-daemon

FROM base AS development
COPY src ./src
EXPOSE 8080
CMD ["gradle", "bootRun", "--no-daemon"]

FROM base AS builder
COPY src ./src
RUN gradle build -x test --no-daemon        # i test girano in CI prima, non qui

FROM eclipse-temurin:21-jre-alpine AS production
WORKDIR /app
RUN apk add --no-cache postgresql-client openssl gzip   # solo se serve (backup pg_dump)
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Frontend (SPA servita da nginx)

```dockerfile
FROM node:22-slim AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM base AS development
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

FROM base AS build-prod
# Solo ciò che DEVE essere cotto nel bundle (flag di build). Niente URL/versione qui.
ARG VITE_DEMO_ENABLED
ARG VITE_ALLOWED_HOSTS
ENV VITE_DEMO_ENABLED=$VITE_DEMO_ENABLED VITE_ALLOWED_HOSTS=$VITE_ALLOWED_HOSTS
RUN npm run build

FROM nginx:alpine AS production
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-prod /app/dist /usr/share/nginx/html
COPY docker-entrypoint.d/40-config.sh /docker-entrypoint.d/40-config.sh
RUN chmod +x /docker-entrypoint.d/40-config.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Servizio Python

Stessa forma: `base` (pip install da `requirements.txt`) → `development` / `production`
(`COPY . .` + `CMD`).

---

## 3. Config runtime del frontend (chiave del "una immagine per tutti")

Le variabili `VITE_*` sono **cotte al build**: se l'API URL finisse lì servirebbe
un'immagine per ambiente. Invece:

1. `frontend/public/config.js` (dev): `window.__ENV__ = {};`
2. `index.html` lo carica **prima** del bundle: `<script src="/config.js"></script>`
3. In prod, `nginx:alpine` esegue automaticamente `/docker-entrypoint.d/*.sh` all'avvio;
   lo script sovrascrive `config.js` dalle env del container:

```sh
#!/bin/sh
set -eu
cat > /usr/share/nginx/html/config.js <<EOF
window.__ENV__ = {"apiUrl":"${APP_API_URL:-}","version":"${APP_VERSION:-dev}","date":"${APP_BUILD_DATE:-}","mcpUrl":"${APP_MCP_URL:-}"};
EOF
```

4. Il codice legge con fallback al dev: `window.__ENV__?.apiUrl ?? import.meta.env.VITE_API_URL`.
5. `nginx.conf`: SPA fallback `try_files $uri $uri/ /index.html;` e **no-cache** su
   `config.js`, `sw.js`, `registerSW.js` (altrimenti versioni/URL vecchi restano in cache);
   cache aggressiva sugli altri asset con hash.
6. Se è una PWA, il service worker deve trattare `/config.js` come network-first.
7. Dichiarare il tipo: `interface Window { __ENV__?: { apiUrl?: string; version?: string; ... } }`.

---

## 4. Docker Compose

### `docker-compose.yml` (dev)

- `db`: `postgres:16-alpine`, porta 5432 esposta (per DBeaver ecc.), volume
  `./postgres_data`, **healthcheck** `pg_isready`.
- `backend`: `build: {context: ./backend, target: development}`, volume `./backend/src:/app/src`,
  `./secrets:/run/secrets:ro`, `env_file: .env`, `depends_on: db: condition: service_healthy`,
  `SPRING_PROFILES_ACTIVE: dev`.
- `frontend`: `target: development`, volumi `./frontend:/app` **+ `/app/node_modules`**
  (volume anonimo per non sovrascrivere i moduli dell'immagine), porta 5173.
- servizi ausiliari: `target: development`, codice montato, URL interni via nome servizio
  (`BACKEND_URL: http://backend:8080`).

### `docker-compose.prod.yml` (prod)

- **Nessun `build`** per i servizi principali: `image: ghcr.io/${GHCR_OWNER}/<app>-backend:${APP_TAG:-prod}`.
- `restart: always`, nessun volume di codice.
- **DB fuori dallo stack** (istanza/LXC separata, raggiunta via `DB_HOST`/`DB_PORT`): così
  un `docker compose down` o la pulizia del runner non toccano i dati. Se il DB sta nello
  stesso host, usare un **named volume**, mai una cartella nel workspace del runner.
- Segreti su file montati da **fuori dal workspace del runner**
  (`/home/deployer/secrets:/run/secrets:ro`): il checkout cancella il workspace.
- Frontend: porta `3000:80`, env `APP_API_URL`, `APP_VERSION`, `APP_BUILD_DATE`, `APP_MCP_URL`.
- TLS/dominio pubblico: davanti c'è un reverse proxy o tunnel (fuori da questo compose)
  che instrada `FRONTEND_URL`, `BACKEND_URL`, `MCP_SERVER_URL` sulle porte esposte.

---

## 5. `.env`

Un unico file alla root; Compose lo usa sia per l'interpolazione `${VAR}` sia come
`env_file`. Committare **solo `.env.example`** con tutte le chiavi e commenti su come
generarle. Gruppi tipici:

```dotenv
# --- Database ---
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
DB_HOST=            # prod: host del DB esterno; dev: db
DB_PORT=5432

# --- Admin creato al primo avvio ---
ADMIN_USERNAME=
ADMIN_EMAIL=
ADMIN_PASSWORD=

# --- Auth ---
JWT_SECRET_KEY=     # openssl rand -base64 32
JWT_EXPIRATION=900000          # 15 min (ms)
JWT_REFRESH_EXPIRATION=2592000000  # 30 giorni (ms)

# --- URL pubblici (usati per CORS, link nelle email, config.js) ---
FRONTEND_URL=
BACKEND_URL=
MCP_SERVER_URL=

# --- Frontend build-time (solo flag) ---
VITE_API_URL=       # usato solo in dev come fallback
VITE_ALLOWED_HOSTS=
VITE_DEMO_ENABLED=false
DEMO_ENABLED=false

# --- Email (SMTP) ---
MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=

# --- Feature opzionali: vuote = feature disattivata ---
VAPID_PUBLIC_KEY=   # npx web-push generate-vapid-keys
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=
R2_ENABLED=false    # backup DB cifrati su object storage S3-compatibile
R2_ACCESS_KEY=
R2_SECRET_KEY=
R2_ENDPOINT=
R2_BUCKET=
BACKUP_ENCRYPTION_PASS=
```

Regole:
- Lato backend ogni proprietà ha un **default sensato** (`${FRONTEND_URL:http://localhost:5173}`)
  e le feature opzionali verificano "env vuota → disabilitata".
- In compose usare `${VAR:-default}` per le opzionali, così l'assenza non rompe l'avvio.
- Sul server il `.env` vive in `/home/deployer/.env` (fuori dal repo) e la CI lo copia nel
  workspace a ogni deploy, aggiungendo le variabili calcolate (vedi §7).
- Test backend: profilo di test con DB in-memory (H2) e nessuna env obbligatoria.

---

## 6. Branching e versionamento

| Branch | Ruolo | Cosa fa la CI |
|---|---|---|
| `feat/*`, `dev` | sviluppo | niente (o solo test, opzionale) |
| `release/vX.Y.Z` | candidato di rilascio | test + build + push immagini (`:prod`, `:X.Y.Z`, `:sha-…`), crea **tag `vX.Y.Z`**, **auto-merge in `main`** |
| `main` | produzione | **nessun build**: solo deploy su runner `prod` delle immagini `:prod` già costruite |
| `demo` | ambiente demo | test + build immagini `:demo` (con `VITE_DEMO_ENABLED=true`) + deploy su runner `demo` |

Flusso di rilascio:
1. `git checkout -b release/v1.4.0` da `dev`/feature, push.
2. CI verde → tag annotato `v1.4.0` sul commit (idempotente: se esiste, skip).
3. **Solo dopo il tag**, merge `--no-ff` in `main` con un **PAT** (`secrets.PAT_PROMOTE`):
   un push fatto col `GITHUB_TOKEN` non ritriggera workflow, quindi il deploy prod non partirebbe.
4. Il push su `main` lancia il deploy prod, che legge la versione con
   `git describe --tags --abbrev=0` (serve `fetch-depth: 0` + `fetch-tags: true`).

Semver: `X` breaking/redesign, `Y` feature, `Z` fix. La versione **non** sta in
`package.json`/`build.gradle`: l'unica fonte è il tag.

---

## 7. CI/CD (`.github/workflows/deploy.yml`)

Trigger: `push` su `demo`, `main`, `release/*` + `workflow_dispatch`.

Job, in ordine:

1. **`changes`** — `dorny/paths-filter`: output `backend`/`frontend` = la cartella è cambiata.
   Build solo di ciò che è cambiato.
2. **`build-backend`** (se `ref != main` e backend cambiato, o dispatch):
   setup JDK → `./gradlew check` (formattazione + test + soglia coverage) →
   `docker/metadata-action` → `docker/build-push-action` con `target: production`.
   Permessi: `packages: write`.
3. **`build-frontend`** (stesse condizioni): `npm ci` → `npm run lint` → `npm test` →
   build/push immagine con `build-args` solo per i flag (`VITE_DEMO_ENABLED` vero su `demo`).
4. **`tag-release`** (solo `release/*`, build non falliti): crea/pusha `vX.Y.Z` da
   `${GITHUB_REF_NAME#release/}`. Permessi: `contents: write`.
5. **`promote-to-main`** (solo `release/*`, dopo `tag-release` success): checkout con
   `token: ${{ secrets.PAT_PROMOTE }}`, merge `--no-ff` in `main`, push.
6. **`deploy`** (solo `demo`/`main`, build `success` o `skipped`):
   `runs-on: [self-hosted, demo|prod]`.

Tag immagine (metadata-action):

```yaml
tags: |
  type=sha
  type=ref,event=branch
  type=raw,value=demo,enable=${{ github.ref == 'refs/heads/demo' }}
  type=raw,value=prod,enable=${{ startsWith(github.ref, 'refs/heads/release/') }}
  type=match,pattern=release/(.*),group=1
```

Condizioni: usare `always() && needs.X.result != 'failure' && != 'cancelled'` perché un
job *skipped* (cartella non cambiata) non deve bloccare tag/promote/deploy.

Step del deploy:

```yaml
- uses: actions/checkout@v5
  with: { fetch-depth: 0, fetch-tags: true }
- name: Setup environment variables
  run: |
    cp /home/deployer/.env .
    echo "GHCR_OWNER=$(echo '${{ github.repository_owner }}' | tr '[:upper:]' '[:lower:]')" >> .env
    echo "APP_TAG=${{ github.ref == 'refs/heads/demo' && 'demo' || 'prod' }}" >> .env
    echo "APP_VERSION=$(git describe --tags --abbrev=0 2>/dev/null || echo dev)" >> .env
    echo "APP_BUILD_DATE=$(date -u +'%Y-%m-%d')" >> .env
- run: echo "${{ secrets.GITHUB_TOKEN }}" | docker login ghcr.io -u ${{ github.actor }} --password-stdin
- run: docker compose -f docker-compose.prod.yml pull
- run: docker compose -f docker-compose.prod.yml up -d
- run: docker image prune -f
```

Nota: GHCR richiede owner/nome immagine **minuscoli** (da qui il `tr`).

---

## 8. Infrastruttura server

- Un host (o LXC/VM) **per ambiente**: `demo` e `prod`, ognuno con un **GitHub Actions
  self-hosted runner** con label `demo` o `prod`, utente `deployer` nel gruppo `docker`.
- Su ogni host: `/home/deployer/.env` (valori di quell'ambiente) e `/home/deployer/secrets/`.
- PostgreSQL su host/LXC separato, raggiungibile dalla rete interna.
- Reverse proxy o tunnel per HTTPS e domini pubblici verso le porte 3000 (frontend),
  8080 (backend), 8000 (servizi ausiliari).
- Schema DB: qui evolve da `ddl-auto=update` (nessuna migrazione). Per un progetto nuovo
  è consigliato Flyway/Liquibase.
- Backup: job schedulato nel backend → `pg_dump` → gzip → cifratura `openssl` → upload su
  object storage S3-compatibile (R2). Disattivato con `R2_ENABLED=false`.

Secrets/vars GitHub necessari: `GITHUB_TOKEN` (automatico), `PAT_PROMOTE` (PAT con
`contents: write` sul repo), variabile di repo `VITE_ALLOWED_HOSTS`.

---

## 9. Checklist per l'agente

1. Crea la struttura del §1 e il `.gitignore`.
2. Scrivi i tre Dockerfile multi-stage (§2); verifica `docker build --target production` di ognuno.
3. Implementa la config runtime del frontend (§3): `public/config.js`, `<script>` in
   `index.html`, entrypoint, `nginx.conf`, lettura con fallback, tipo `Window.__ENV__`.
4. Scrivi `docker-compose.yml` (dev) e verifica `docker compose up` con hot-reload.
5. Scrivi `docker-compose.prod.yml` (§4) e `.env.example` (§5); ogni feature opzionale
   parte disattivata con env vuota.
6. Scrivi `.github/workflows/deploy.yml` (§7) con i 6 job e le condizioni `always()`.
7. Documenta nel README: creazione runner self-hosted con label, posizione `.env`/`secrets`
   sul server, creazione `PAT_PROMOTE`, procedura di rilascio `release/vX.Y.Z`.
8. Mostra la versione nell'app leggendo `window.__ENV__.version` (fallback "dev").
9. Smoke test: push su `release/v0.1.0` → immagini su GHCR, tag `v0.1.0`, merge in `main`,
   deploy prod, la UI mostra `v0.1.0`.
