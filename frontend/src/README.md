# Shared frontend code (for page agents)

Styling is Tailwind only. Bootstrap JS behaviours are re-implemented with React state.
Colors: `bg-navbar-bg`, `text-text-color`, ... (index.css). Breakpoints: `min-[576px]:`, `min-[768px]:`, `min-[992px]:`, `min-[1200px]:`.

## Components (`components/`)
- `Navbar.jsx` default `<Navbar />`: top navbar, hamburger menu, theme switcher. Put it first in every page. Also exports `loadTheme()`.
- `Footer.jsx` default `<Footer />`: page footer (end of page).
- `Modal.jsx` default `<Modal open onClose title footer id centered>children</Modal>`: reusable modal. `footer` = buttons (default one "Close"). Closes on X, Escape, backdrop.
- `Messages.jsx`:
  - `<Messages />`: all four popups (error/info/warning/success). Do not render it twice.
  - `<ErrorMessage />`, `<InfoMessage />`, `<WarningMessage />`, `<SuccessMessage />`: single popups.
  - `<ShowMessage message={{error, message}} />`: inline message box (old show-message.jsp), renders nothing for null.
- `Fireflies.jsx` default `<Fireflies count={25} />`: animated background (wrapper `.fireflies`).
- `SearchPlayer.jsx` default `<SearchPlayer onSearch={searchThePlayer} buttonText="Add!" />`: player search input + suggestions. Input id `playerUsername`, button `addPlayer`; read/clear the input by id.

## Hooks and utils (`utils/`)
- `session.js`
  - `useSession()` -> `{ user, gamemaster, loading }` from `GET /lupus/api/session` (401 -> user null).
  - `useLoginChecker()` same, but redirects to `/lupus/login` when logged out (old loginChecker.jsp).
  - `fetchSession()` the shared promise behind both.
- `utils.js`
  - `genericGETRequest(url, cb)`, `genericPOSTRequest(url, json, cb)`, `genericPUTRequest(url, json, cb)`, `genericDELETERequest(url, json, cb)`: XHR, cb(xhr) as before.
  - `notFound(xhr)`, `getRoleType(role)`, `getMessage(xhr)`, `capitalizeFirstLetter(s)`.
  - `getCookie`, `setCookie(name, value, days=365)`, `storeData(key, value, seconds)`, `retrieveData(key)`.
  - `contextPath` (origin + "/lupus/"), status constants `HTTP_STATUS_*`, `JSON_resource_list`, `ROLE_MASTER`.
  - `rolesColors` (Map), `GamePhase`, `goodRoles`, `evilRoles`, `evilAction`, `victoryStealerRoles`, `neutralRoles`, `neutralAction`.
- `message.js`: `populateErrorMessage(sel, msg, code, details)`, `populateInfoMessage(sel, title, msg, more="")`, `populateWarningMessage(...)`, `populateSuccessMessage(...)`, `hideMessagePopup(sel)`, `populateMessage(sel, title, details, more="")`, `showMore(btn)`. `sel` = selector such as `.errorMessage` or `#myPage .errorMessage`.
- `searchPlayer.js`: `playersToIgnore` (array, push lower-case usernames), `minSizeSearch`, `highlightContains(name, text)` (HTML string), `clearSearchBar()`.
- `passwordComplexAndShowPassword.js`: `showPasswordHint(bool)` (toggles class `hidden` on #passwordComplex), `passwordComplexHint(password)` (marks #passwordLength, #passwordUppercase, #passwordLowercase, #passwordNumber, #passwordSymbol), `showPassword(inputId)` (toggles type and `fa-eye`/`fa-eye-slash` on `<inputId>_eyeIcon`), `criteria`. These work on the page's own markup by id.

## Styles (`styles/`)
- `fireflies.css`: keyframes and `.firefly` rules, imported by `Fireflies.jsx`. Import other keyframe-only CSS the same way.
