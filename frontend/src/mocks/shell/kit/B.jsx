import { useEffect, useState } from 'react';
import {
  ChevronDown, CircleCheck, CircleX, Info, Menu, Moon, Search, Sun, TriangleAlert, User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { search } from '@/mocks/fixtures';

// Variant B "Tavolo da gioco". Tokens live in CSS vars on `.variant-B`; `[data-bs-theme=dark]` flips them.
// Portaled content (menus, sheet, dialog, popover, toasts) is outside the root, so it carries `variant-B` itself.
const CSS = `
.variant-B {
  --b-table: #7a4e2d; --b-table2: #6e4528; --b-felt: #2f5d3a; --b-paper: #f3e6c8; --b-ink: #2b1d12;
  --b-brass: #c9a24a; --b-pin: #c0392b; --b-text: #f3e6c8; --b-lamp: rgba(255, 240, 200, .12);
  font-family: 'Alegreya', Georgia, serif; color: var(--b-text);
}
[data-bs-theme="dark"] .variant-B {
  --b-table: #3a2414; --b-table2: #331f11; --b-felt: #173022; --b-paper: #d9c79e; --b-ink: #1e140c;
  --b-text: #d9c79e; --b-lamp: rgba(255, 179, 71, .26);
}
.vb-wood {
  background-color: var(--b-table);
  background-image: repeating-linear-gradient(90deg, var(--b-table) 0 14px, var(--b-table2) 14px 22px);
}
.vb-felt { background: var(--b-felt); color: var(--b-paper); }
.vb-lamp {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background: radial-gradient(ellipse 80% 60% at 50% -10%, var(--b-lamp), transparent 70%);
}
.vb-display { font-family: 'Cinzel Decorative', Georgia, serif; font-weight: 700; letter-spacing: .02em; }
.vb-paper {
  background: var(--b-paper); color: var(--b-ink); border-radius: 14px;
  border: 1px solid rgba(43, 29, 18, .25);
  box-shadow: 0 8px 16px rgba(0, 0, 0, .45), 0 2px 4px rgba(0, 0, 0, .3);
}
.vb-pinned { border-radius: 2px; }
.vb-pin {
  width: 14px; height: 14px; border-radius: 9999px;
  background: radial-gradient(circle at 35% 30%, #ff9a8a 0 14%, var(--b-pin) 16% 70%, #6e1a12 100%);
  box-shadow: 0 2px 3px rgba(0, 0, 0, .55);
}
.vb-token {
  display: inline-flex; align-items: center; justify-content: center; border-radius: 9999px;
  border: 2px solid var(--b-brass); box-shadow: 0 4px 8px rgba(0, 0, 0, .45);
  background: var(--b-felt); color: var(--b-paper); font-weight: 700;
}
.vb-btn {
  background: var(--b-felt); color: var(--b-paper); border: 2px solid var(--b-brass);
  border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, .45);
}
.vb-btn:hover { filter: brightness(1.15); }
.vb-btn-ghost { background: transparent; color: var(--b-text); border: 2px solid var(--b-brass); box-shadow: none; }
.vb-paper .vb-btn-ghost { color: var(--b-ink); border-color: var(--b-ink); }
.vb-ghost { background: transparent; color: var(--b-text); }
.vb-ghost:hover { background: rgba(0, 0, 0, .2); color: var(--b-text); }
/* Global index.css sets anchors blue (and a stronger dark rule), so anchors get explicit selectors with higher specificity. */
a.vb-navlink, a.vb-link, [data-bs-theme] a.vb-navlink, [data-bs-theme] a.vb-link { color: var(--b-text); text-decoration: none; }
a.vb-navlink, [data-bs-theme] a.vb-navlink { background: linear-gradient(var(--b-brass), var(--b-brass)) 0 100% / 100% 2px no-repeat; padding-bottom: 2px; }
a.vb-navlink:hover, [data-bs-theme] a.vb-navlink:hover { color: #fff; }
.variant-B :focus-visible, .variant-B:focus-visible { outline: 2px solid var(--b-brass); outline-offset: 2px; }
.vb-item[data-selected="true"] { background: rgba(43, 29, 18, .12); }
a.vb-item, [data-bs-theme] a.vb-item { color: var(--b-ink); text-decoration: none; }
.vb-input { background: rgba(0, 0, 0, .25); color: var(--b-text); border: 2px solid var(--b-brass); border-radius: 9999px; }
.vb-input::placeholder { color: var(--b-text); opacity: .75; }
.vb-search-item { color: var(--b-ink); }
@media (prefers-reduced-motion: no-preference) {
  .vb-btn { transition: filter 200ms, transform 200ms; }
  .vb-btn:active { transform: translateY(1px); }
}
`;

const FONTS = 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Alegreya:wght@400;700&display=swap';

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

/** Variant root: fonts, table background, candle/daylight light. Use it for any screen or demo. */
export function Stage({ children, className = '' }) {
  return (
    <div className={`variant-B relative min-h-screen flex flex-col vb-wood ${className}`}>
      <link rel="stylesheet" href={FONTS} />
      <style>{CSS}</style>
      <div className="vb-lamp" aria-hidden="true" />
      <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
    </div>
  );
}

/** Full app chrome: Stage + sticky Navbar + main + Footer. user = username string or null. */
export function Layout({ user, children }) {
  return (
    <Stage>
      <div className="sticky top-0 z-40">
        <Navbar user={user} />
      </div>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <Footer />
    </Stage>
  );
}

export function ThemeToggle({ className = '' }) {
  const theme = useBodyTheme();
  const dark = theme === 'dark';
  return (
    <Button
      variant="ghost"
      size="icon"
      className={`vb-ghost ${className}`}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => { document.body.dataset.bsTheme = dark ? 'light' : 'dark'; }}
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}

function PlayerSearch({ defaultOpen = false, defaultQuery = '' }) {
  const [q, setQ] = useState(defaultQuery);
  const [open, setOpen] = useState(defaultOpen);
  const needle = q.trim().toLowerCase();
  const results = search['resource-list']
    .map((r) => r.player.username)
    .filter((u) => u.toLowerCase().includes(needle));

  return (
    <Command shouldFilter={false} className="variant-B vb-ghost overflow-visible rounded-none bg-transparent">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" aria-hidden="true" />
            <input
              type="search"
              value={q}
              placeholder="Search player"
              aria-label="Search player"
              onChange={(e) => { setQ(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
              className="vb-input h-9 w-full pr-3 pl-9 text-base outline-none md:text-sm"
            />
          </div>
        </PopoverAnchor>
        <PopoverContent
          align="start"
          sideOffset={6}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onFocusOutside={(e) => e.preventDefault()}
          className="variant-B vb-paper w-[min(18rem,calc(100vw-2rem))] p-1"
        >
          <CommandList>
            <CommandEmpty>No players found.</CommandEmpty>
            <CommandGroup heading="Players">
              {results.map((u) => (
                <CommandItem
                  key={u}
                  value={u}
                  className="vb-item vb-search-item cursor-pointer rounded-sm"
                  onSelect={() => { window.location.href = `/habitant/${u}`; }}
                >
                  <span className="vb-token size-7 text-xs">{u[0].toUpperCase()}</span>
                  {u}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </PopoverContent>
      </Popover>
    </Command>
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
        <Button variant="ghost" className="vb-ghost gap-2" aria-label="User menu">
          <span className="vb-token size-7"><User className="size-4" /></span>
          <span className="hidden sm:inline">{user ?? 'Guest'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="variant-B vb-paper min-w-44 p-1">
        {user ? (
          <>
            <DropdownMenuLabel className="px-2 py-1.5">{user}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="vb-item rounded-sm"><a href="/habitant/me">My Profile</a></DropdownMenuItem>
            <DropdownMenuItem asChild className="vb-item rounded-sm"><a href="/logout">Log Out</a></DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel className="px-2 py-1.5">Not Logged In</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="vb-item rounded-sm"><a href="/login">Log In</a></DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Wood top bar. menuDefaultOpen / searchDefaultOpen are for static demos only.
 */
export function Navbar({ user = null, menuDefaultOpen = false, searchDefaultOpen = false }) {
  return (
    <header className="vb-wood relative border-b-2 border-[var(--b-brass)] shadow-[0_6px_12px_rgba(0,0,0,.45)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 md:flex-nowrap">
        <a href="/home" className="vb-display text-lg text-[var(--b-text)] no-underline sm:text-xl">
          Lupus in Fabula
        </a>

        <nav aria-label="Main" className="hidden items-center gap-5 md:flex">
          <a href="/home" className="vb-navlink text-base">Home</a>
          <a href="/habitant/" className="vb-navlink text-base">Stats&amp;History</a>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="vb-ghost px-2 text-base">
                Game <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="variant-B vb-paper min-w-48 p-1">
              {GAME_LINKS.map((l) => (
                <DropdownMenuItem key={l.href} asChild className="vb-item rounded-sm">
                  <a href={l.href}>{l.label}</a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="order-last w-full md:order-none md:ml-auto md:w-64">
          <PlayerSearch defaultOpen={searchDefaultOpen} defaultQuery={searchDefaultOpen ? 'smo' : ''} />
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <ThemeToggle />
          <UserMenu user={user} defaultOpen={menuDefaultOpen} />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="vb-ghost md:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="variant-B vb-wood w-72 border-l-2 border-[var(--b-brass)] p-0 text-[var(--b-text)]">
              <SheetTitle className="vb-display border-b-2 border-[var(--b-brass)] p-4 text-lg text-[var(--b-text)]">
                Lupus in Fabula
              </SheetTitle>
              <nav aria-label="Mobile" className="flex flex-col gap-1 p-4 text-lg">
                <a href="/home" className="vb-navlink py-1">Home</a>
                <a href="/habitant/" className="vb-navlink py-1">Stats&amp;History</a>
                <span className="mt-3 text-sm uppercase tracking-widest opacity-75">Game</span>
                {GAME_LINKS.map((l) => (
                  <a key={l.href} href={l.href} className="vb-navlink py-1 pl-3">{l.label}</a>
                ))}
                <span className="mt-3 text-sm uppercase tracking-widest opacity-75">Account</span>
                {user ? (
                  <>
                    <a href="/habitant/me" className="vb-navlink py-1 pl-3">My Profile</a>
                    <a href="/logout" className="vb-navlink py-1 pl-3">Log Out</a>
                  </>
                ) : (
                  <a href="/login" className="vb-navlink py-1 pl-3">Log In</a>
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
    <footer className="vb-felt relative z-10 mt-8 border-t-2 border-[var(--b-brass)] px-4 py-5 text-center text-sm">
      © 2024 Team LIF - Lupus in Fabula. All rights reserved.
    </footer>
  );
}

/** Pinned parchment: the main container for content. */
export function Panel({ children, className = '', rotate = '' }) {
  return (
    <div className={`vb-paper relative p-6 motion-safe:transition-transform motion-safe:duration-200 ${rotate} ${className}`}>
      <span className="vb-pin absolute -top-1.5 left-1/2 -translate-x-1/2" aria-hidden="true" />
      {children}
    </div>
  );
}

/** Playing-card style box for list items or small blocks. */
export function TableCard({ children, className = '' }) {
  return <div className={`vb-paper p-4 ${className}`}>{children}</div>;
}

export function PageTitle({ children, className = '' }) {
  return (
    <h1 className={`vb-display mb-6 inline-block border-b-4 border-[var(--b-brass)] pb-1 text-3xl text-[var(--b-text)] sm:text-4xl ${className}`}>
      {children}
    </h1>
  );
}

/** Round game token. Pass tone="felt" (default) or "pin" (red) or "brass". */
export function Token({ children, tone = 'felt', className = '' }) {
  const bg = { felt: 'var(--b-felt)', pin: 'var(--b-pin)', brass: 'var(--b-brass)' }[tone];
  return <span className={`vb-token size-9 ${className}`} style={{ background: bg }}>{children}</span>;
}

/** Button in the table style. Pass variant="ghost" for the outlined version. */
export function TableButton({ variant, className = '', ...props }) {
  const cls = variant === 'ghost' ? 'vb-btn-ghost' : 'vb-btn';
  return <Button className={`${cls} ${className}`} {...props} />;
}

const KINDS = {
  error: { Icon: CircleX, bg: 'var(--b-pin)', role: 'alert', label: 'Error' },
  warning: { Icon: TriangleAlert, bg: 'var(--b-brass)', role: 'alert', label: 'Warning' },
  info: { Icon: Info, bg: 'var(--b-felt)', role: 'status', label: 'Info' },
  success: { Icon: CircleCheck, bg: 'var(--b-felt)', role: 'status', label: 'Success' },
};

/** Popup message: a parchment card with a colored seal. */
export function MessageBox({ kind = 'info', title, details, code }) {
  const { Icon, bg, role, label } = KINDS[kind];
  return (
    <div role={role} className="variant-B vb-paper vb-pinned relative flex max-w-md gap-4 p-4 pl-5">
      <span className="vb-token size-11 shrink-0 border-[var(--b-ink)]/40" style={{ background: bg, color: '#f3e6c8' }}>
        <Icon className="size-6" aria-label={label} />
      </span>
      <div className="min-w-0">
        <p className="vb-display text-lg">{title}</p>
        {details && <p className="mt-1 text-base leading-snug">{details}</p>}
        {code && (
          <p className="mt-2 text-xs uppercase tracking-widest">
            Code <span className="font-bold tracking-normal">{code}</span>
          </p>
        )}
      </div>
    </div>
  );
}
