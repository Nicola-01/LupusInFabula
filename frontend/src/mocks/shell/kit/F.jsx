import { useEffect, useState } from 'react';
import {
  ChevronDown, CircleAlert, CircleCheck, Info, LogIn, LogOut, Menu, Moon, MonitorSmartphone, Search, SunMoon, Sun, TriangleAlert, UserRound,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { search } from '@/mocks/fixtures';
import { toast } from 'sonner';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';

// Variant F: B's fonts, navbar and green accent, C's double-gilded panels and message popups,
// with a very subtle light-wood striped page. Tokens are CSS vars on `.variant-F`, flipped by
// `[data-bs-theme=dark]`. Portaled content (menus, sheet, dialog, popover) carries `variant-F` itself.
const CSS = `
.variant-F {
  --f-page: #e9dcc4; --f-page-stripe: #e3d3b8;
  --f-nav: #5a3d26; --f-nav-stripe: #55391f; --f-navtext: #f3e6c8; --f-nav-brass: #c9a24a;
  --f-felt: #2f5d3a; --f-felt-hover: #264c30; --f-on-felt: #f3e6c8;
  --f-brass: #b08a2e; --f-focus: #2f5d3a; --f-hl: rgba(176, 138, 46, .22);
  --f-paper: #f4e9d1; --f-ink: #2b1d12; --f-ink2: #5c4630; --f-rubric: #8b1e1e;
  --f-wax: #8b1e1e; --f-wax-text: #f4e9d1;
  --f-seal-info: #2f5d3a; --f-seal-info-text: #f3e6c8; --f-seal-warn: #b08a2e; --f-seal-warn-text: #2a2218;
  --f-seal-ok: #3f5f3a; --f-seal-ok-text: #f4e9d1;
  font-family: 'Alegreya', Georgia, serif; color: var(--f-ink);
}
[data-bs-theme="dark"] .variant-F {
  --f-page: #2a2119; --f-page-stripe: #251d16; --f-nav: #1f160f; --f-nav-stripe: #1b130d; --f-nav-brass: #d4b25a;
  --f-felt: #3f7a4d; --f-felt-hover: #4a8a59; --f-on-felt: #fbf6ea; --f-brass: #d4b25a; --f-focus: #d4b25a;
  --f-hl: rgba(212, 178, 90, .22);
  --f-paper: #2f261c; --f-ink: #efe2c4; --f-ink2: #c9b48c; --f-rubric: #e07a6e;
  --f-wax: #d0574a; --f-wax-text: #140e09;
  --f-seal-info: #3f7a4d; --f-seal-info-text: #fbf6ea; --f-seal-warn: #d4b25a; --f-seal-warn-text: #2a2218;
  --f-seal-ok: #6fa36f; --f-seal-ok-text: #2a2218;
}
.vf-page { background-color: var(--f-page); background-image: repeating-linear-gradient(90deg, var(--f-page) 0 18px, var(--f-page-stripe) 18px 26px); }
.vf-nav {
  background-color: var(--f-nav); color: var(--f-navtext);
  background-image: repeating-linear-gradient(90deg, var(--f-nav) 0 18px, var(--f-nav-stripe) 18px 26px);
}
.vf-felt { background: var(--f-felt); color: var(--f-on-felt); }
.variant-F :focus-visible { outline: 2px solid var(--f-focus); outline-offset: 2px; }
.vf-nav :focus-visible { outline-color: var(--f-nav-brass); }
.vf-display { font-family: 'Cinzel Decorative', Georgia, serif; font-weight: 700; letter-spacing: .02em; }
.vf-title { font-family: 'Cinzel', Georgia, serif; font-weight: 600; letter-spacing: .04em; }
.vf-rubric { color: var(--f-rubric); }
.vf-paper {
  background: var(--f-paper); color: var(--f-ink); border: 3px double var(--f-brass); border-radius: 2px;
  box-shadow: inset 0 0 40px rgba(120, 80, 30, .18), 0 6px 14px rgba(60, 40, 20, .18);
}
.vf-token {
  display: inline-flex; align-items: center; justify-content: center; border-radius: 9999px;
  border: 2px solid var(--f-brass); background: var(--f-felt); color: var(--f-on-felt);
  font-family: 'Cinzel', Georgia, serif; font-weight: 700; box-shadow: 0 2px 4px rgba(0, 0, 0, .3);
}
.vf-btn { border: 2px solid transparent; border-radius: 6px; font-family: 'Cinzel', Georgia, serif; font-weight: 600; letter-spacing: .04em; }
.vf-btn-primary { background: var(--f-felt); color: var(--f-on-felt); border-color: var(--f-felt); }
.vf-btn-primary:hover { background: var(--f-felt-hover); }
.vf-btn-outline { background: transparent; color: var(--f-ink); border-color: var(--f-brass); }
.vf-btn-outline:hover { background: var(--f-hl); }
.vf-btn-danger { background: var(--f-wax); color: var(--f-wax-text); border-color: var(--f-wax); }
.vf-btn-danger:hover { filter: brightness(1.1); }
.vf-ghost { background: transparent; color: var(--f-ink); }
.vf-ghost:hover { background: var(--f-hl); }
.vf-nav .vf-ghost { color: var(--f-navtext); }
/* Global index.css sets anchors blue/underlined (dark rule is stronger), so anchors use higher-specificity selectors. */
a.vf-navlink, [data-bs-theme] a.vf-navlink {
  color: var(--f-navtext); text-decoration: none; padding-bottom: 2px;
  background: linear-gradient(var(--f-nav-brass), var(--f-nav-brass)) 0 100% / 100% 2px no-repeat;
}
a.vf-navlink:hover, [data-bs-theme] a.vf-navlink:hover { color: #fff; }
a.vf-logo, [data-bs-theme] a.vf-logo { color: var(--f-navtext); text-decoration: none; }
a.vf-a, [data-bs-theme] a.vf-a { color: var(--f-ink); text-decoration: none; }
.vf-item { cursor: pointer; border-radius: 2px; }
.vf-item[data-highlighted], .vf-item[data-selected="true"] { background: var(--f-hl); }
.vf-input { background: var(--f-paper); color: var(--f-ink); border: 2px solid var(--f-brass); border-radius: 6px; }
.vf-input::placeholder { color: var(--f-ink2); opacity: 1; }
.vf-group-heading [cmdk-group-heading] {
  font-family: 'Cinzel', Georgia, serif; font-weight: 600; font-size: 12px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--f-rubric); padding: 6px 8px 2px;
}
.vf-seal {
  display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
  width: 3rem; height: 3rem; border-radius: 9999px;
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, .25), 0 0 0 2px var(--f-brass), 0 3px 6px rgba(0, 0, 0, .35);
}
.vf-seal-sm { width: 2rem; height: 2rem; box-shadow: inset 0 0 0 1.5px rgba(0, 0, 0, .25), 0 0 0 1.5px var(--f-brass), 0 2px 4px rgba(0, 0, 0, .3); }
.vf-ink2 { color: var(--f-ink2); }
.vf-brass-text { color: var(--f-brass); }
.vf-brass-border { border-color: var(--f-brass); }
.vf-wax { background-color: var(--f-wax); color: var(--f-wax-text); }
.vf-seal-info { background-color: var(--f-seal-info); color: var(--f-seal-info-text); }
.vf-seal-warn { background-color: var(--f-seal-warn); color: var(--f-seal-warn-text); }
.vf-seal-ok { background-color: var(--f-seal-ok); color: var(--f-seal-ok-text); }
.vf-results [cmdk-empty] { padding: 8px; font-size: 15px; }
@media (prefers-reduced-motion: no-preference) {
  .vf-btn { transition: filter 200ms, background-color 200ms; }
}
`;

const FONTS = 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cinzel:wght@600;700&family=Alegreya:wght@400;700&display=swap';

// Button class helpers, used as `<Button className={primaryBtn}>`.
export const primaryBtn = 'vf-btn vf-btn-primary';
export const outlineBtn = 'vf-btn vf-btn-outline';
export const dangerBtn = 'vf-btn vf-btn-danger';

// Follows <body data-bs-theme>, which the gallery and ThemeToggle set.
export function useBodyTheme() {
  const read = () => document.body.dataset.bsTheme || 'light';
  const [theme, setTheme] = useState(read);
  useEffect(() => {
    const obs = new MutationObserver(() => setTheme(read()));
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-bs-theme'] });
    return () => obs.disconnect();
  }, []);
  return theme;
}

/** Variant root: fonts, striped light-wood page. Use it for any screen or demo. */
export function Stage({ children, className = '', transparent = false }) {
  return (
    <div className={cn('variant-F flex min-h-screen flex-col', transparent ? 'relative z-0' : 'vf-page', className)}>
      <link rel="stylesheet" href={FONTS} />
      <style>{CSS}</style>
      {children}
    </div>
  );
}

/** Full app chrome: Stage + sticky Navbar + main + Footer. user = username string or null. */
/** transparent: no striped page background, so a fixed background behind the page shows through. */
export function Layout({ user = null, transparent = false, children }) {
  return (
    <Stage transparent={transparent}>
      <div className="sticky top-0 z-40">
        <Navbar user={user} />
      </div>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <Footer />
    </Stage>
  );
}

// The four modes of the real app's theme cookie (see loadTheme in components/Navbar.jsx).
const THEME_MODES = [
  { id: 'light', label: 'Light', Icon: Sun, hint: 'Always light' },
  { id: 'dark', label: 'Dark', Icon: Moon, hint: 'Always dark' },
  { id: 'auto', label: 'Auto', Icon: MonitorSmartphone, hint: 'Follows your device' },
  { id: 'dynamic', label: 'Dynamic', Icon: SunMoon, hint: 'Follows the game' },
];
const THEME_KEY = 'mock-theme-mode';
const storedMode = () => { try { return localStorage.getItem(THEME_KEY); } catch { return null; } };
// Mock-only state (no cookie, so the real app is not affected). Dynamic is the default, as in the app.
let mockMode = THEME_MODES.some((m) => m.id === storedMode()) ? storedMode() : 'dynamic';
const modeListeners = new Set();

function applyMockTheme(respectQuery) {
  // The gallery's ?theme=light|dark wins on load.
  if (respectQuery && new URLSearchParams(location.search).has('theme')) return;
  let resolved = mockMode;
  if (mockMode === 'auto' || mockMode === 'dynamic') {
    // dynamic: in the real app (loadTheme) village pages follow the game phase; mocks have no phase
    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.body.dataset.bsTheme = resolved;
}

function setMockThemeMode(m) {
  mockMode = m;
  try { localStorage.setItem(THEME_KEY, m); } catch { /* storage blocked: keep the in-memory mode */ }
  applyMockTheme(false);
  modeListeners.forEach((fn) => fn());
}

function useMockThemeMode() {
  const [m, setM] = useState(mockMode);
  useEffect(() => {
    const sync = () => setM(mockMode);
    modeListeners.add(sync);
    return () => modeListeners.delete(sync);
  }, []);
  return m;
}

/** Theme selector: icon button showing the current mode, radio menu with the four modes. */
export function ThemeToggle({ className = '' }) {
  const current = useMockThemeMode();
  const { Icon, label } = THEME_MODES.find((m) => m.id === current);
  useEffect(() => {
    applyMockTheme(true);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyMockTheme(true);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn('vf-ghost size-11 md:size-9', className)} aria-label={`Theme: ${label}`}>
          <Icon aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="variant-F vf-paper min-w-56 p-1">
        <DropdownMenuRadioGroup value={current} onValueChange={setMockThemeMode}>
          {THEME_MODES.map(({ id, label: itemLabel, Icon: ItemIcon, hint }) => (
            <DropdownMenuRadioItem key={id} value={id} className="vf-item gap-3 py-2">
              <ItemIcon aria-hidden="true" />
              <span className="flex flex-col leading-tight">
                <span>{itemLabel}</span>
                <span className="vf-ink2 text-xs">{hint}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** The four modes as a segmented row (for the mobile Sheet). */
export function ThemeModeRow() {
  const current = useMockThemeMode();
  return (
    <div role="radiogroup" aria-label="Theme" className="grid grid-cols-4 gap-1">
      {THEME_MODES.map(({ id, label, Icon, hint }) => {
        const on = id === current;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={label}
            title={hint}
            onClick={() => setMockThemeMode(id)}
            className={cn('vf-btn flex min-h-11 flex-col items-center justify-center gap-0.5 px-1 text-xs', on ? 'vf-btn-primary' : 'vf-btn-outline')}
          >
            <Icon aria-hidden="true" className="size-5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/** Player results list (cmdk). Used inside the search popover and inline on the demo page. */
export function SearchResults({ query = '', className = '' }) {
  const needle = query.trim().toLowerCase();
  const players = search['resource-list']
    .map((r) => r.player)
    .filter((p) => p.username.toLowerCase().includes(needle));

  return (
    <Command shouldFilter={false} className={cn('vf-results vf-paper rounded-sm bg-transparent p-1', className)}>
      <CommandList>
        <CommandEmpty>No player found.</CommandEmpty>
        <CommandGroup heading="Players" className="vf-group-heading">
          {players.map((p) => (
            <CommandItem
              key={p.username}
              value={p.username}
              className="vf-item gap-2 text-[15px]"
              onSelect={() => { window.location.href = `/habitant/${p.username}`; }}
            >
              <span className="vf-token size-7 text-xs">{p.username[0].toUpperCase()}</span>
              {p.username}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

/** Search input + results popover. */
export function PlayerSearch({ className = '' }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open && query.trim() !== ''} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className={cn('relative', className)}>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 vf-ink2" aria-hidden="true" />
          <input
            type="search"
            value={query}
            placeholder="Search player"
            aria-label="Search player"
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
            className="vf-input h-10 w-full pr-3 pl-9 text-base outline-none md:text-sm"
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        sideOffset={6}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onFocusOutside={(e) => e.preventDefault()}
        className="variant-F w-[min(18rem,calc(100vw-2rem))] p-0"
      >
        <SearchResults query={query} className="border-0 shadow-none" />
      </PopoverContent>
    </Popover>
  );
}

const GAME_LINKS = [
  { href: '/rules', label: 'Rulebook' },
  { href: '/newVillage', label: 'Create a village' },
  { href: '/village', label: 'Join your village' },
];

function UserMenu({ user, defaultOpen = false }) {
  return (
    <DropdownMenu modal={false} defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="vf-ghost gap-2" aria-label="User menu">
          <span className="vf-token size-7"><UserRound className="size-4" aria-hidden="true" /></span>
          <span className="hidden sm:inline">{user ?? 'Guest'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="variant-F vf-paper min-w-44 p-1">
        {user ? (
          <>
            <DropdownMenuLabel className="vf-title px-2 py-1.5 text-sm vf-rubric">{user}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="vf-item"><a href="/habitant/me" className="vf-a flex items-center gap-2"><UserRound className="size-4" aria-hidden="true" />My Profile</a></DropdownMenuItem>
            <DropdownMenuItem asChild className="vf-item"><a href="/logout" className="vf-a flex items-center gap-2"><LogOut className="size-4" aria-hidden="true" />Log Out</a></DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel className="vf-title px-2 py-1.5 text-sm vf-rubric">Not Logged In</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="vf-item"><a href="/login" className="vf-a flex items-center gap-2"><LogIn className="size-4" aria-hidden="true" />Log In</a></DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Wolf icon as a mask tinted with the brass var: the SVG's red (#900) has poor contrast on the navbar.
function WolfMark({ className = '', tint = 'var(--f-nav-brass, #c9a24a)' }) {
  const mask = 'url(/media/logo_wolf_sm.svg) center/contain no-repeat';
  return (
    <span
      aria-hidden="true"
      className={cn('inline-block shrink-0 align-middle', className)}
      style={{ backgroundColor: tint, WebkitMask: mask, mask }}
    />
  );
}

/** Top bar (wood-tone band, brass underlined links). menuDefaultOpen is for the static demo only. */
export function Navbar({ user = null, menuDefaultOpen = false }) {
  return (
    <header className="vf-nav relative border-b-2 border-[#c9a24a] shadow-[0_6px_12px_rgba(0,0,0,.35)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 md:flex-nowrap">
        <a href="/home" className="vf-display vf-logo inline-flex items-center gap-2 text-lg sm:text-xl">
          <WolfMark className="h-[26px] w-[26px] sm:h-[27px] sm:w-[28px]" />
          Lupus in Fabula
        </a>

        <nav aria-label="Main" className="hidden items-center gap-5 md:flex">
          <a href="/home" className="vf-navlink text-base">Home</a>
          <a href="/habitant/" className="vf-navlink text-base">Stats&amp;History</a>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="vf-ghost px-2 text-base">
                Game <ChevronDown aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="variant-F vf-paper min-w-48 p-1">
              {GAME_LINKS.map((l) => (
                <DropdownMenuItem key={l.href} asChild className="vf-item">
                  <a href={l.href} className="vf-a block">{l.label}</a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="order-last w-full md:order-none md:ml-auto md:w-64">
          <PlayerSearch />
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <ThemeToggle />
          <UserMenu user={user} defaultOpen={menuDefaultOpen} />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="vf-ghost md:hidden" aria-label="Open menu">
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="variant-F vf-paper w-72 p-0">
              <SheetTitle className="vf-display flex items-center gap-2 border-b-2 vf-brass-border p-4 text-lg vf-rubric">
                <WolfMark className="h-[26px] w-[26px]" tint="var(--f-rubric)" />
                Lupus in Fabula
              </SheetTitle>
              <nav aria-label="Mobile" className="flex flex-col gap-1 p-4 text-lg">
                <a href="/home" className="vf-a rounded-sm px-2 py-1">Home</a>
                <a href="/habitant/" className="vf-a rounded-sm px-2 py-1">Stats&amp;History</a>
                <span className="vf-title mt-3 text-xs tracking-widest vf-rubric">Game</span>
                {GAME_LINKS.map((l) => (
                  <a key={l.href} href={l.href} className="vf-a rounded-sm py-1 pl-4">{l.label}</a>
                ))}
                <span className="vf-title mt-3 text-xs tracking-widest vf-rubric">Theme</span>
                <ThemeModeRow />
                <span className="vf-title mt-3 text-xs tracking-widest vf-rubric">Account</span>
                {user ? (
                  <>
                    <a href="/habitant/me" className="vf-a rounded-sm py-1 pl-4">My Profile</a>
                    <a href="/logout" className="vf-a rounded-sm py-1 pl-4">Log Out</a>
                  </>
                ) : (
                  <a href="/login" className="vf-a rounded-sm py-1 pl-4">Log In</a>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="vf-nav relative z-10 mt-8 border-t-2 border-[#c9a24a] px-4 py-4 text-center font-['Cinzel'] text-xs tracking-[.12em]">
      <span aria-hidden="true" className="mr-2 text-[#c9a24a]">✦</span>
      © 2024 Team LIF · Lupus in Fabula · All rights reserved
      <span aria-hidden="true" className="ml-2 text-[#c9a24a]">✦</span>
    </footer>
  );
}

/** Gilded double-border parchment: the content container and popup base. */
export function Panel({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag className={cn('vf-paper relative p-6', className)} {...props}>
      {children}
    </Tag>
  );
}

/** Wax seal badge (red by default). */
export function Seal({ children, className = '' }) {
  return (
    <span className={cn('inline-flex size-10 shrink-0 items-center justify-center rounded-[48%_52%_50%_50%] vf-wax shadow-[inset_0_0_0_2px_rgba(212,178,90,.4),0_2px_4px_rgba(0,0,0,.35)] font-["Cinzel"] text-sm font-bold', className)}>
      {children}
    </span>
  );
}

export function Ornament({ className = '' }) {
  return (
    <div className={cn('flex items-center gap-3 vf-brass-text', className)} aria-hidden="true">
      <span className="h-px flex-1 bg-current" />
      <span className="text-sm">&#10022;</span>
      <span className="h-px flex-1 bg-current" />
    </div>
  );
}

export function PageTitle({ children, sub, className = '' }) {
  return (
    <header className={cn('text-center', className)}>
      <h1 className="vf-display text-3xl sm:text-4xl">{children}</h1>
      {sub && <p className="vf-rubric mt-2 italic">{sub}</p>}
      <Ornament className="mx-auto mt-4 max-w-md" />
    </header>
  );
}

const KINDS = {
  error: { Icon: CircleAlert, seal: 'vf-wax', role: 'alert', label: 'Error' },
  info: { Icon: Info, seal: 'vf-seal-info', role: 'status', label: 'Info' },
  warning: { Icon: TriangleAlert, seal: 'vf-seal-warn', role: 'alert', label: 'Warning' },
  success: { Icon: CircleCheck, seal: 'vf-seal-ok', role: 'status', label: 'Success' },
};

/** Wax-style seal icon shared by MessageBox and the toasts. */
export function MessageSeal({ kind = 'info', small = false }) {
  const { Icon, seal, label } = KINDS[kind];
  return (
    <span className={cn('vf-seal', small && 'vf-seal-sm', seal)}>
      <Icon className={small ? 'size-4' : 'size-6'} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

const TOAST_CLASSES = {
  toast: 'vf-paper flex w-full items-center gap-3 p-4',
  title: 'vf-title text-base font-bold',
  description: 'mt-1 text-[15px] leading-snug',
};

/** Toaster in the MessageBox look. Mount once per page. */
export function Toaster() {
  return (
    <SonnerToaster
      className="variant-F"
      position="bottom-right"
      toastOptions={{ unstyled: true, classNames: TOAST_CLASSES }}
    />
  );
}

/** Pop a toast of the given kind ('error' | 'info' | 'warning' | 'success'). Pass the same id to replace an existing toast. */
export function notify(kind, title, details, id) {
  toast[kind](title, { id, description: details, icon: <MessageSeal kind={kind} small /> });
}

/** Popup message: gilded double-border parchment, wax seal icon. `code` is debug-only: logged, not shown. */
export function MessageBox({ kind = 'info', title, details, code }) {
  const { role } = KINDS[kind];
  useEffect(() => { if (code) console.warn(`[${kind}] ${title} (code ${code})`, details); }, [code]);
  return (
    <Panel role={role} className="flex max-w-md gap-4 p-5">
      <MessageSeal kind={kind} />
      <div className="min-w-0 flex-1">
        <p className="vf-title text-lg font-bold">{title}</p>
        {details && <p className="mt-1 text-[15px] leading-snug">{details}</p>}
      </div>
    </Panel>
  );
}

// Per-user colours. Each colour gives >= 4.5:1 with the light text #fbf6ea (checked with the WCAG formula).
export const USER_COLORS = [
  { name: 'Moss', hex: '#3d5a2a' },
  { name: 'Wine', hex: '#7a1f2b' },
  { name: 'Ochre', hex: '#8a5a12' },
  { name: 'Slate', hex: '#3e5870' },
  { name: 'Plum', hex: '#5b3a5e' },
  { name: 'Teal', hex: '#1f5f5b' },
  { name: 'Rust', hex: '#8f4a22' },
  { name: 'Olive', hex: '#5e5a1e' },
  { name: 'Indigo', hex: '#2f3570' },
  { name: 'Sienna', hex: '#7d4330' },
  { name: 'Forest', hex: '#224d2c' },
  { name: 'Burgundy', hex: '#5c1a2a' },
];

// FNV-1a 32-bit over the UTF-16 code units; stable across reloads and browsers.
function hashName(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return h >>> 0;
}

/** Colour hex for a user: `custom` if given, else a stable pick from USER_COLORS by username hash.
 * Checked with node: userColor('matteo') -> '#5c1a2a' (Burgundy), userColor('sam') -> '#2f3570' (Indigo). */
export function userColor(username, custom) {
  return custom || USER_COLORS[hashName(username) % USER_COLORS.length].hex;
}

const TOKEN_SIZES = { sm: 'size-7 text-[11px]', md: 'size-10 text-sm', lg: 'size-20 text-2xl' };

/** Round avatar with 1-2 initials on the user colour, brass ring. */
export function UserToken({ username, custom, size = 'md' }) {
  const initials = (username.match(/[A-Za-z0-9]/g) || ['?']).slice(0, 2).join('').toUpperCase();
  return (
    <span
      role="img"
      aria-label={username}
      title={username}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full border-2 border-[var(--f-brass)] font-["Cinzel"] font-bold text-[#fbf6ea] shadow-[0_2px_4px_rgba(0,0,0,.3)]',
        TOKEN_SIZES[size],
      )}
      style={{ backgroundColor: userColor(username, custom) }}
    >
      {initials}
    </span>
  );
}

// Font Awesome 5.8.1 (free, global CDN in index.html) icon per role. Names match the `roles` fixture.
export const ROLE_ICONS = {
  farmer: 'fa-seedling', seer: 'fa-eye', knight: 'fa-chess-knight', sheriff: 'fa-star', carpenter: 'fa-hammer',
  hobbit: 'fa-ring', kamikaze: 'fa-bomb', mason: 'fa-hard-hat', medium: 'fa-ghost', sam: 'fa-user-shield',
  wolf: 'fa-moon', berserker: 'fa-fist-raised', dorky: 'fa-dizzy', explorer: 'fa-compass', giuda: 'fa-coins',
  puppy: 'fa-dog', illusionist: 'fa-magic', 'plague spreader': 'fa-biohazard', hamster: 'fa-cheese', jester: 'fa-laugh-squint',
};

/** Role icon: `<i>` with the role's FA class. Unknown role -> fa-question. */
export function RoleIcon({ role, className = '' }) {
  return <i className={cn('fas', ROLE_ICONS[role] ?? 'fa-question', className)} aria-hidden="true" />;
}
