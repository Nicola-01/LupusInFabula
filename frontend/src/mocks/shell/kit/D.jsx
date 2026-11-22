import { useEffect, useRef, useState } from 'react';
import { BookOpen, ChevronDown, CircleCheck, Info, LogIn, LogOut, Menu, Moon, OctagonX, Plus, Search, Sun, TriangleAlert, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import Fireflies from '@/components/Fireflies.jsx';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { search } from '@/mocks/fixtures';

// Variant D tokens. Light = golden dawn, dark (default look) = night sky.
// Font + scene rules live in one scoped <style> on the .mock-D root (never global).
const CSS = `
.mock-D { font-family: 'Nunito', system-ui, sans-serif; }
.mock-D .f-title { font-family: 'Cormorant Garamond', Georgia, serif; }
@keyframes mockD-flicker { 0%,100% { opacity: .85 } 50% { opacity: 1 } }
@keyframes mockD-pulse { 0%,100% { box-shadow: 0 0 18px #ff8c4233 } 50% { box-shadow: 0 0 32px #ff8c4266 } }
@media (prefers-reduced-motion: no-preference) {
  .mock-D .lantern { animation: mockD-flicker 3s ease-in-out infinite; }
  .mock-D .glow-pulse { animation: mockD-pulse 4s ease-in-out infinite; }
}
`;

const FONTS_ID = 'mock-D-fonts';
const FONTS_HREF = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Nunito:wght@400;600;700&display=swap';

// Deterministic star field (no Math.random, so screenshots are stable).
const STARS = Array.from({ length: 44 }, (_, i) => ({
  left: (i * 37) % 100,
  top: (i * 23) % 62,
  size: i % 3 === 0 ? 2 : 1,
}));

const glowButtonClass = 'glow-pulse inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-bold bg-[#d9692b] text-[#1b1020] shadow-[0_0_24px_#ff8c4255] hover:brightness-110 dark:bg-[#ff8c42] transition motion-safe:transition-[filter] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9692b] dark:focus-visible:outline-[#ffb347] disabled:opacity-50';
const ghostButtonClass = 'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border border-[#c98a4b]/40 text-[#2a1e2e] hover:bg-[#c98a4b]/15 dark:border-white/15 dark:text-[#e8e6f0] dark:hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9692b] dark:focus-visible:outline-[#ffb347]';
const iconButtonClass = 'inline-flex size-9 items-center justify-center rounded-full border border-[#c98a4b]/40 bg-white/60 text-[#2a1e2e] hover:bg-white/90 dark:border-white/15 dark:bg-[#141a33]/60 dark:text-[#e8e6f0] dark:hover:bg-[#141a33] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9692b] dark:focus-visible:outline-[#ffb347]';
const navLinkClass = 'no-underline text-current rounded-full px-3 py-1.5 text-sm font-semibold hover:text-[#d9692b] dark:hover:text-[#ffb347] focus-visible:outline-2 focus-visible:outline-[#d9692b] dark:focus-visible:outline-[#ffb347]';
const menuContentClass = 'border-[#c98a4b]/30 bg-white/90 text-[#2a1e2e] backdrop-blur-md dark:border-white/10 dark:bg-[#141a33]/90 dark:text-[#e8e6f0]';
const menuItemClass = 'cursor-pointer focus:bg-[#d9692b]/15 focus:text-[#2a1e2e] dark:focus:bg-[#ff8c42]/20 dark:focus:text-[#e8e6f0]';

/** Glass panel (light: white/60, dark: #141a33/60). */
export function Panel({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[#c98a4b]/30 bg-white/60 text-[#2a1e2e] shadow-[0_10px_30px_rgba(0,0,0,.35)] backdrop-blur-md dark:border-white/10 dark:bg-[#141a33]/60 dark:text-[#e8e6f0]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Page heading in the title font. */
export function PageTitle({ kicker, children, className }) {
  return (
    <div className={cn('space-y-1', className)}>
      {kicker && <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d9692b] dark:text-[#ffb347]">{kicker}</p>}
      <h1 className="f-title text-4xl font-bold leading-tight md:text-5xl">{children}</h1>
    </div>
  );
}

/** Class strings for buttons (use on <button>/<a>). */
export { glowButtonClass, ghostButtonClass, iconButtonClass };

const KINDS = {
  error: { Icon: OctagonX, label: 'Error', border: 'border-l-[#ff8c42]', icon: 'text-[#d9692b] dark:text-[#ff8c42]' },
  info: { Icon: Info, label: 'Info', border: 'border-l-[#2a1e2e] dark:border-l-[#f5f1d6]', icon: 'text-[#2a1e2e] dark:text-[#f5f1d6]' },
  warning: { Icon: TriangleAlert, label: 'Warning', border: 'border-l-[#ffb347]', icon: 'text-[#d9692b] dark:text-[#ffb347]' },
  success: { Icon: CircleCheck, label: 'Success', border: 'border-l-[#2a1e2e] dark:border-l-[#f5f1d6]', icon: 'text-[#2a1e2e] dark:text-[#f5f1d6]' },
};

/** Popup message (the variant's version of the app's message.js popups). */
export function MessageBox({ kind = 'info', title, details, code }) {
  const { Icon, label, border, icon } = KINDS[kind];
  return (
    <Panel
      role={kind === 'error' || kind === 'warning' ? 'alert' : 'status'}
      className={cn('flex gap-3 border-l-4 p-4 shadow-[0_0_24px_#ff8c4222]', border)}
    >
      <Icon aria-hidden className={cn('mt-0.5 size-6 shrink-0', icon)} />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest opacity-70">{label}</p>
        <h2 className="f-title text-xl font-bold">{title}</h2>
        {details && <p className="text-sm opacity-90">{details}</p>}
        {code && (
          <span className="inline-block rounded-full border border-current/30 px-2 py-0.5 font-mono text-xs">Code {code}</span>
        )}
      </div>
      <button type="button" aria-label="Close message" className={cn(iconButtonClass, 'size-7 shrink-0 self-start text-base')}>
        ×
      </button>
    </Panel>
  );
}

/** Lanterns, stars, moon/sun, fireflies and the village silhouette. Decorative only. */
function Scenery() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 hidden dark:block">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white opacity-60"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size }}
          />
        ))}
        <span className="absolute right-[12%] top-10 size-16 rounded-full bg-[#f5f1d6] shadow-[0_0_60px_#f5f1d655]" />
      </div>
      <span className="absolute right-[12%] top-10 size-24 rounded-full bg-[#ffb347]/50 blur-xl dark:hidden" />
      <div className="absolute inset-0 hidden dark:block">
        <Fireflies count={18} />
      </div>
      <svg
        className="absolute bottom-0 left-0 h-40 w-full text-[#8a4b2a]/35 dark:text-[#05071a]/85"
        viewBox="0 0 1440 160"
        preserveAspectRatio="xMidYMax slice"
      >
        <path
          fill="currentColor"
          d="M0 160V112H50V84L80 58L110 84V112H170V78H200V112H260V66L290 36L320 66V112H380V90H410V112H470V74L500 44L530 74V112H590V96H630V112H700V62L730 30L760 62V112H820V86H860V112H920V70H950V112H1010V92L1040 64L1070 92V112H1130V76H1160V112H1220V56L1250 28L1280 56V112H1340V84H1380V112H1440V160Z"
        />
      </svg>
      <span className="lantern absolute bottom-28 left-[18%] size-2 rounded-full bg-[#ffb347] shadow-[0_0_18px_#ff8c42] dark:block" />
      <span className="lantern absolute bottom-24 right-[22%] size-2 rounded-full bg-[#ffb347] shadow-[0_0_18px_#ff8c42]" />
    </div>
  );
}

/** Variant root: fonts, sky, scenery. Use alone for custom layouts, or via Layout. */
export function Frame({ children, className }) {
  useEffect(() => {
    if (document.getElementById(FONTS_ID)) return;
    const link = document.createElement('link');
    link.id = FONTS_ID;
    link.rel = 'stylesheet';
    link.href = FONTS_HREF;
    document.head.appendChild(link);
  }, []);

  return (
    <div
      className={cn(
        'mock-D relative isolate flex min-h-screen flex-col overflow-hidden text-[#2a1e2e] dark:text-[#e8e6f0]',
        'bg-[linear-gradient(180deg,#ffd7a8_0%,#fbe9d0_50%,#e9f0f7_100%)] dark:bg-[linear-gradient(180deg,#0b1026_0%,#1b1f3b_55%,#2a2140_100%)]',
        className
      )}
    >
      <style>{CSS}</style>
      <Scenery />
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </div>
  );
}

/** Light/dark switch; writes document.body.dataset.bsTheme (the app's theme attribute). */
export function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.body.dataset.bsTheme || 'light');
  const isDark = theme === 'dark';
  const toggle = () => {
    const next = isDark ? 'light' : 'dark';
    document.body.dataset.bsTheme = next;
    setTheme(next);
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={iconButtonClass}
    >
      {isDark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </button>
  );
}

/** Player results from the search fixture, filtered by query. */
export function SearchResults({ query = '' }) {
  const players = search['resource-list'].map((r) => r.player.username);
  const q = query.trim().toLowerCase();
  const list = players.filter((u) => u.toLowerCase().includes(q));
  return (
    <Command shouldFilter={false} className="bg-transparent">
      <CommandList>
        <CommandEmpty className="py-6 text-center text-sm opacity-80">No players found.</CommandEmpty>
        <CommandGroup heading="Players" className="[&_[cmdk-group-heading]]:text-[#d9692b] dark:[&_[cmdk-group-heading]]:text-[#ffb347]">
          {list.map((u) => (
            <CommandItem
              key={u}
              value={u}
              onSelect={() => {
                window.location.href = `/habitant/${u}`;
              }}
              className="cursor-pointer gap-2 data-[selected=true]:bg-[#d9692b]/15 dark:data-[selected=true]:bg-[#ff8c42]/20"
            >
              <User className="size-4" aria-hidden />
              {u}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

/** Player search: input + results popover. defaultOpen is for the static demo. */
export function SearchBox({ defaultOpen = false, className }) {
  const [open, setOpen] = useState(defaultOpen);
  const [q, setQ] = useState('');
  const anchor = useRef(null);
  // Radix would close on clicks/focus on the input (the anchor, not the trigger), and on focus moving to the user menu.
  const keepOpen = (e) => {
    if (anchor.current?.contains(e.target)) e.preventDefault();
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div ref={anchor} className={cn('relative', className)}>
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 opacity-70" />
          <input
            type="search"
            aria-label="Search player"
            placeholder="Search player..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            className="h-9 w-full rounded-full border border-[#c98a4b]/40 bg-white/70 pl-9 pr-3 text-sm placeholder:text-[#2a1e2e]/60 focus-visible:outline-2 focus-visible:outline-[#d9692b] dark:border-white/15 dark:bg-[#0b1026]/60 dark:placeholder:text-[#e8e6f0]/60 dark:focus-visible:outline-[#ffb347]"
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        sideOffset={6}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={keepOpen}
        onFocusOutside={(e) => e.preventDefault()}
        className={cn('w-72 overflow-hidden p-0 rounded-2xl', menuContentClass)}
      >
        <SearchResults query={q} />
      </PopoverContent>
    </Popover>
  );
}

/** User menu: logged in → profile/logout; logged out → login. */
export function UserMenu({ user, defaultOpen = false }) {
  return (
    <DropdownMenu modal={false} defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label={user ? `User menu for ${user}` : 'User menu'} className={cn(iconButtonClass, 'w-auto gap-2 px-3')}>
          <User className="size-4" aria-hidden />
          {user && <span className="hidden text-sm font-semibold sm:inline">{user}</span>}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={menuContentClass}>
        {user ? (
          <>
            <DropdownMenuLabel className="f-title text-base">{user}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className={menuItemClass}>
              <a href="/habitant/me" className="no-underline text-current">
                <User className="size-4" aria-hidden /> My Profile
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className={menuItemClass}>
              <a href="/logout" className="no-underline text-current">
                <LogOut className="size-4" aria-hidden /> Log Out
              </a>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel className="f-title text-base">Not Logged In</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className={menuItemClass}>
              <a href="/login" className="no-underline text-current">
                <LogIn className="size-4" aria-hidden /> Log In
              </a>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const GAME_LINKS = [
  { href: '/rules', label: 'Rulebook', Icon: BookOpen },
  { href: '/newVillage', label: 'Create a village', Icon: Plus },
  { href: '/village', label: 'Join your village', Icon: Users },
];

/** Top bar. Desktop: inline links. Mobile (<md): hamburger opens a Sheet with the same links. */
export function Navbar({ user = null, userMenuOpen = false }) {
  return (
    <header className="relative z-30 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-[#c98a4b]/30 bg-white/60 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,.35)] backdrop-blur-md dark:border-white/10 dark:bg-[#141a33]/60">
      <a href="/home" className="f-title no-underline text-current mr-auto text-2xl font-bold leading-none hover:text-[#d9692b] dark:hover:text-[#ffb347]">
        Lupus in Fabula
      </a>

      <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
        <a href="/home" className={navLinkClass}>Home</a>
        <a href="/habitant/" className={navLinkClass}>Stats&amp;History</a>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className={cn(navLinkClass, 'inline-flex items-center gap-1')}>
            Game <ChevronDown className="size-4" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className={menuContentClass}>
            {GAME_LINKS.map(({ href, label, Icon }) => (
              <DropdownMenuItem key={href} asChild className={menuItemClass}>
                <a href={href} className="no-underline text-current">
                  <Icon className="size-4" aria-hidden /> {label}
                </a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      <SearchBox className="order-last w-full md:order-none md:w-64" />

      <ThemeToggle />
      <UserMenu user={user} defaultOpen={userMenuOpen} />

      <Sheet>
        <SheetTrigger asChild>
          <button type="button" aria-label="Open menu" className={cn(iconButtonClass, 'md:hidden')}>
            <Menu className="size-5" aria-hidden />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="border-[#c98a4b]/30 bg-white/95 text-[#2a1e2e] backdrop-blur-md dark:border-white/10 dark:bg-[#141a33]/95 dark:text-[#e8e6f0]">
          <SheetHeader>
            <SheetTitle className="f-title text-2xl">Lupus in Fabula</SheetTitle>
            <SheetDescription className="sr-only">Site navigation</SheetDescription>
          </SheetHeader>
          <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
            <a href="/home" className={cn(navLinkClass, 'py-2 text-base')}>Home</a>
            <a href="/habitant/" className={cn(navLinkClass, 'py-2 text-base')}>Stats&amp;History</a>
            <p className="px-3 pt-4 text-xs font-semibold uppercase tracking-widest opacity-70">Game</p>
            {GAME_LINKS.map(({ href, label, Icon }) => (
              <a key={href} href={href} className={cn(navLinkClass, 'flex items-center gap-2 py-2 text-base')}>
                <Icon className="size-4" aria-hidden /> {label}
              </a>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}

/** Footer, same text as the app. */
export function Footer() {
  return (
    <footer className="mt-auto px-4 py-6 text-center text-sm opacity-80">
      © 2024 Team LIF - Lupus in Fabula. All rights reserved.
    </footer>
  );
}

/** Full page shell: Frame + Navbar + main + Footer. user = username or null. */
export function Layout({ user, children }) {
  return (
    <Frame>
      <Navbar user={user} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
      <Footer />
    </Frame>
  );
}
