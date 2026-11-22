import { useEffect, useState } from 'react';
import { Menu, Moon, Sun, Search, User, LogOut, LogIn, ChevronDown, X, AlertTriangle, CheckCircle2, Info, OctagonAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { search } from '@/mocks/fixtures';
import { cn } from '@/lib/utils';

// Variant A ("Fedele") tokens. Light/dark follow data-bs-theme on <body> through the dark: variant.
const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&display=swap';
const WRAP = 'font-[Jost] text-[#0c0d10] dark:text-[#EAF0F2] bg-[#F2F7FA] dark:bg-[#10161c]';
const NAV_BG = 'bg-[#4BA3C3] dark:bg-[#0D324D]';
const NAV_SECOND = 'bg-[#387B99] dark:bg-[#0a2740]';
const CARD = 'rounded-xl bg-white dark:bg-[#1a232c] shadow-sm hover:shadow-md transition-shadow duration-150';
const BTN_PRIMARY = 'no-underline rounded-lg bg-[#387B99] text-white hover:bg-[#2d6a84] dark:bg-[#4BA3C3] dark:text-[#0D324D] dark:hover:bg-[#6ab5d2] transition-colors duration-150';
const BTN_DANGER = 'no-underline rounded-lg bg-[#992922] text-white hover:bg-[#7d1f1a] dark:bg-[#c4473f] dark:hover:bg-[#d4574f] transition-colors duration-150';
const BTN_GHOST = 'no-underline rounded-lg text-[#0c0d10] dark:text-[#EAF0F2] hover:bg-[#4BA3C3]/15 dark:hover:bg-[#4BA3C3]/20 transition-colors duration-150';
const POPUP = 'bg-white dark:bg-[#1a232c] text-[#0c0d10] dark:text-[#EAF0F2] border-[#4BA3C3]/40 dark:border-[#4BA3C3]/30 rounded-xl';
const NAV_LINK = 'no-underline rounded-lg px-3 py-2 text-white/95 hover:bg-white/15 transition-colors duration-150';

/** Loads Jost once and returns the variant root wrapper with the forest gradient. */
export function Layout({ user = null, children }) {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_HREF}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);
  return (
    <div className={cn('mock-A min-h-screen flex flex-col', WRAP)}>
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-gradient-to-b from-[#4BA3C3]/10 to-transparent dark:from-[#4BA3C3]/5" aria-hidden="true" />
      <Navbar user={user} />
      <main className="relative flex-1 w-full max-w-5xl mx-auto px-4 py-8 space-y-6">{children}</main>
      <Footer />
    </div>
  );
}

/** Theme toggle: flips body data-bs-theme (the dark: variant follows it). */
export function ThemeToggle({ className }) {
  const [dark, setDark] = useState(() => document.body.dataset.bsTheme === 'dark');
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.body.dataset.bsTheme = next ? 'dark' : 'light';
  };
  const Icon = dark ? Sun : Moon;
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn('text-white hover:bg-white/15 rounded-lg', className)}>
      <Icon className="size-5" />
    </Button>
  );
}

/** Player search: input + results popover (Command list filled from the search fixture). */
export function PlayerSearch({ defaultOpen = false, className }) {
  const [open, setOpen] = useState(defaultOpen);
  const [query, setQuery] = useState('');
  const players = search['resource-list'].map((r) => r.player.username);
  const shown = players.filter((u) => u.toLowerCase().includes(query.toLowerCase()));
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className={cn('relative w-full sm:w-56', className)}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#0c0d10]/60" aria-hidden="true" />
          <Input
            type="search"
            aria-label="Search player"
            placeholder="Search player..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            className="h-9 pl-9 rounded-lg border-[#387B99]/40 bg-white text-[#0c0d10] placeholder:text-[#0c0d10]/50 focus-visible:ring-[#4BA3C3] dark:bg-[#0D324D]/60 dark:text-[#EAF0F2] dark:placeholder:text-[#EAF0F2]/50"
          />
        </div>
      </PopoverAnchor>
      <PopoverContent align="start" sideOffset={6} onOpenAutoFocus={(e) => e.preventDefault()}
        className={cn('w-[var(--radix-popover-trigger-width)] min-w-56 p-0 rounded-xl', POPUP)}>
        <Command shouldFilter={false} className="bg-transparent">
          <CommandList>
            <CommandEmpty>No player found.</CommandEmpty>
            <CommandGroup heading="Players">
              {shown.map((u) => (
                <CommandItem key={u} value={u} className="rounded-lg cursor-pointer" onSelect={() => setOpen(false)}>
                  <User className="size-4 opacity-70" />{u}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function UserMenu({ user, defaultOpen = false }) {
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline text-sm text-white/90">Not Logged In</span>
        <Button asChild size="sm" className={cn(BTN_PRIMARY, 'bg-white text-[#0D324D] hover:bg-white/85 dark:bg-white dark:text-[#0D324D] dark:hover:bg-white/85')}>
          <a href="/login"><LogIn className="size-4" />Log In</a>
        </Button>
      </div>
    );
  }
  return (
    <DropdownMenu modal={false} defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-lg text-white hover:bg-white/15 gap-2 px-2">
          <span className="grid place-items-center size-8 rounded-full bg-white text-[#387B99] font-semibold">{user[0].toUpperCase()}</span>
          <span className="hidden sm:inline">{user}</span>
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={cn('min-w-44 rounded-xl p-1', POPUP)}
        // demo: a menu opened on mount must not steal focus from the search popover
        onOpenAutoFocus={defaultOpen ? (e) => e.preventDefault() : undefined}>
        <DropdownMenuLabel className="text-[#0c0d10]/60 dark:text-[#EAF0F2]/60">{user}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
          <a className="no-underline text-[#0c0d10] dark:text-[#EAF0F2]" href="/habitant/me"><User className="size-4" />My Profile</a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-lg cursor-pointer text-[#992922] dark:text-[#c4473f]">
          <a className="no-underline" href="/logout"><LogOut className="size-4" />Log Out</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const GAME_ITEMS = [
  { label: 'Rulebook', href: '/rules' },
  { label: 'Create a village', href: '/newVillage' },
  { label: 'Join your village', href: '/village' },
];

function GameMenu() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className={cn(NAV_LINK, 'inline-flex items-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-white')}>
        Game<ChevronDown className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className={cn('min-w-52 rounded-xl p-1', POPUP)}>
        {GAME_ITEMS.map((i) => (
          <DropdownMenuItem key={i.href} asChild className="rounded-lg cursor-pointer">
            <a className="no-underline text-[#0c0d10] dark:text-[#EAF0F2]" href={i.href}>{i.label}</a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Top bar. Desktop: links + search + menu. Mobile (<md): hamburger opens a Sheet with everything. */
export function Navbar({ user = null, defaultMenuOpen = false, defaultSearchOpen = false }) {
  return (
    <header className={cn('sticky top-0 z-40 text-white shadow-md', NAV_BG)}>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <a href="/home" className="no-underline text-white font-semibold text-xl tracking-tight rounded-lg px-1 focus-visible:outline-2 focus-visible:outline-white">
          Lupus in Fabula
        </a>
        <nav aria-label="Main" className="hidden md:flex items-center gap-1 ml-4">
          <a href="/home" className={NAV_LINK}>Home</a>
          <a href="/habitant/" className={NAV_LINK}>Stats&amp;History</a>
          <GameMenu />
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:block"><PlayerSearch defaultOpen={defaultSearchOpen} /></div>
          <ThemeToggle className="hidden md:inline-flex" />
          <div className="hidden md:block"><UserMenu user={user} defaultOpen={defaultMenuOpen} /></div>
          <MobileMenu user={user} />
        </div>
      </div>
    </header>
  );
}

function MobileMenu({ user }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu" className="md:hidden text-white hover:bg-white/15 rounded-lg">
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className={cn('w-72 border-l-0 p-0', WRAP)}>
        <SheetHeader className="p-4 border-b border-[#387B99]/30">
          <SheetTitle className="text-[#0c0d10] dark:text-[#EAF0F2] font-semibold">Lupus in Fabula</SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-1 p-4">
          <div className="mb-3"><PlayerSearch /></div>
          <a href="/home" className={cn(BTN_GHOST, 'px-3 py-2')}>Home</a>
          <a href="/habitant/" className={cn(BTN_GHOST, 'px-3 py-2')}>Stats&amp;History</a>
          <p className="px-3 pt-3 text-xs uppercase tracking-wider text-[#387B99] dark:text-[#4BA3C3]">Game</p>
          {GAME_ITEMS.map((i) => (
            <a key={i.href} href={i.href} className={cn(BTN_GHOST, 'px-3 py-2')}>{i.label}</a>
          ))}
          <div className="mt-4 border-t border-[#387B99]/30 pt-4 flex items-center justify-between">
            <ThemeToggle className="text-[#0c0d10] dark:text-[#EAF0F2] hover:bg-[#4BA3C3]/15" />
            {user ? (
              <div className="flex gap-2">
                <Button asChild variant="ghost" size="sm" className={BTN_GHOST}><a href="/habitant/me"><User className="size-4" />Profile</a></Button>
                <Button asChild size="sm" className={BTN_DANGER}><a href="/logout"><LogOut className="size-4" />Log Out</a></Button>
              </div>
            ) : (
              <Button asChild size="sm" className={BTN_PRIMARY}><a href="/login"><LogIn className="size-4" />Log In</a></Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function Footer() {
  return (
    <footer className={cn('mt-auto text-white text-sm py-4 px-4 text-center', NAV_SECOND)}>
      © 2024 Team LIF - Lupus in Fabula. All rights reserved.
    </footer>
  );
}

/** Card container used across the variant. */
export function Panel({ className, children }) {
  return <section className={cn(CARD, 'p-6', className)}>{children}</section>;
}

export function PageTitle({ className, children }) {
  return <h1 className={cn('text-3xl font-semibold tracking-tight', className)}>{children}</h1>;
}

export function Section({ title, children, className }) {
  return (
    <Panel className={className}>
      <h2 className="mb-3 text-xl font-semibold text-[#387B99] dark:text-[#4BA3C3]">{title}</h2>
      {children}
    </Panel>
  );
}

const MSG = {
  error: { Icon: OctagonAlert, stripe: 'bg-[#992922] dark:bg-[#c4473f]', icon: 'text-[#992922] dark:text-[#c4473f]' },
  info: { Icon: Info, stripe: 'bg-[#4BA3C3]', icon: 'text-[#387B99] dark:text-[#4BA3C3]' },
  warning: { Icon: AlertTriangle, stripe: 'bg-[#e6d58f] dark:bg-[#50441d]', icon: 'text-[#7a6418] dark:text-[#e6d58f]' },
  success: { Icon: CheckCircle2, stripe: 'bg-[#c8f3c8] dark:bg-[#1a2f22]', icon: 'text-[#1f6b2c] dark:text-[#8fd99b]' },
};

/** Popup-style message (replaces the old error/info/warning/success popups). */
export function MessageBox({ kind = 'info', title, details, code }) {
  const { Icon, stripe, icon } = MSG[kind];
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={cn('relative flex w-full overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1a232c] shadow-md')}>
      <span className={cn('w-1.5 shrink-0', stripe)} aria-hidden="true" />
      <div className="flex-1 p-4 pr-10">
        <div className="flex items-center gap-2">
          <Icon className={cn('size-5 shrink-0', icon)} aria-hidden="true" />
          <strong className="font-semibold">{title}</strong>
          {code && <span className="ml-auto rounded-md bg-[#0c0d10]/10 dark:bg-white/10 px-2 py-0.5 font-mono text-xs">{code}</span>}
        </div>
        {details && <p className="mt-1 text-sm text-[#0c0d10]/75 dark:text-[#EAF0F2]/75">{details}</p>}
      </div>
      <button type="button" aria-label="Close message" className="absolute right-2 top-2 rounded-md p-1 opacity-60 hover:opacity-100 transition-opacity duration-150">
        <X className="size-4" />
      </button>
    </div>
  );
}

export { POPUP, BTN_PRIMARY, BTN_DANGER, BTN_GHOST, CARD };
