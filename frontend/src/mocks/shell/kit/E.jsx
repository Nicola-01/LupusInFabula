import { useEffect, useState } from 'react';
import { Menu, Moon, Sun, User, LogIn, LogOut, ChevronDown, House, ScrollText, Castle, Users, Clock3, OctagonX, Info, CircleAlert, CircleCheck, UserRound } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { search } from '@/mocks/fixtures';

// Variant E tokens. Light: sfondo/prato/legno/cielo/rosso/testo. Dark: superfici/accento/rosso dark.
const FONTS_HREF = 'https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@500;700&display=swap';
const BORDER = 'border-[3px] border-[#3a2a1f] dark:border-[#120c1a]';
const STICKER = 'shadow-[4px_4px_0_#3a2a1f] dark:shadow-[4px_4px_0_#120c1a]';
const PRESS = 'active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#3a2a1f] dark:active:shadow-[2px_2px_0_#120c1a]';
const SPRING = 'transition duration-150 ease-[cubic-bezier(.34,1.56,.64,1)] motion-safe:hover:-translate-y-0.5 motion-safe:hover:rotate-[-1deg]';
const FOCUS = 'outline-none focus-visible:ring-4 focus-visible:ring-[#7cc6e8] dark:focus-visible:ring-[#ffb84d]';
const TONES = {
  // grass = prato (primary), wood = legno/accent, wolf = rosso, cream = neutral
  grass: 'bg-[#8cc152] !text-[#3a2a1f] dark:bg-[#5f9a3a] dark:!text-[#fff4e0]',
  wood: 'bg-[#c97b3d] !text-[#3a2a1f] dark:bg-[#ffb84d] dark:!text-[#120c1a]',
  wolf: 'bg-[#e2553f] !text-[#fdf3e1] dark:bg-[#ff6b57] dark:!text-[#120c1a]',
  cream: 'bg-[#fdf3e1] !text-[#3a2a1f] dark:bg-[#3b2f4d] dark:!text-[#fff4e0]',
  sky: 'bg-[#7cc6e8] !text-[#3a2a1f] dark:bg-[#7cc6e8] dark:!text-[#120c1a]',
};
const BUBBLE_TONE = {
  grass: 'bg-[#8cc152] text-[#3a2a1f] dark:bg-[#5f9a3a] dark:text-[#fff4e0]',
  wood: 'bg-[#c97b3d] text-[#3a2a1f] dark:bg-[#ffb84d] dark:text-[#120c1a]',
  wolf: 'bg-[#e2553f] text-[#fdf3e1] dark:bg-[#ff6b57] dark:text-[#120c1a]',
  sky: 'bg-[#7cc6e8] text-[#3a2a1f] dark:bg-[#7cc6e8] dark:text-[#120c1a]',
  cream: 'bg-[#fdf3e1] text-[#3a2a1f] dark:bg-[#2b2238] dark:text-[#fff4e0]',
};

const HEADING = "font-[family-name:'Lilita_One'] font-normal";
const BODY = "font-[family-name:'Baloo_2'] font-medium";

/** Sticker button class string (apply to <button>, <a> or DropdownMenuItem). tone: grass|wood|wolf|cream|sky */
export function stickerButton(tone = 'grass', className) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-[1.2rem] font-bold no-underline',
    BORDER, STICKER, PRESS, SPRING, FOCUS, BODY, TONES[tone], className,
  );
}

/** Sticker card: thick border, rounded-3xl, hard shadow. */
export function Panel({ children, className, as: Tag = 'section' }) {
  return (
    <Tag className={cn('rounded-3xl bg-[#fdf3e1] p-5 text-[#3a2a1f] dark:bg-[#3b2f4d] dark:text-[#fff4e0]', BORDER, STICKER, className)}>
      {children}
    </Tag>
  );
}

/** Colored circle around a lucide icon (strokeWidth 2.5). */
export function IconBubble({ icon: Icon, tone = 'grass', className }) {
  return (
    <span className={cn('inline-flex size-11 shrink-0 items-center justify-center rounded-full', BORDER, BUBBLE_TONE[tone], className)}>
      <Icon strokeWidth={2.5} className="size-6" aria-hidden="true" />
    </span>
  );
}

/** Page title with optional icon bubble. */
export function PageTitle({ children, icon, tone = 'grass', className }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {icon && <IconBubble icon={icon} tone={tone} />}
      <h1 className={cn(HEADING, 'text-4xl leading-none !text-[#3a2a1f] dark:!text-[#fff4e0]')}>{children}</h1>
    </div>
  );
}

/** Loads the variant fonts once and provides the variant root (background, text color, font). */
export function VariantRoot({ children, className }) {
  useEffect(() => {
    if (document.getElementById('mock-E-fonts')) return;
    const link = document.createElement('link');
    link.id = 'mock-E-fonts';
    link.rel = 'stylesheet';
    link.href = FONTS_HREF;
    document.head.appendChild(link);
  }, []);
  return (
    <div className={cn('mock-E flex min-h-screen flex-col bg-[#fdf3e1] text-[#3a2a1f] dark:bg-[#2b2238] dark:text-[#fff4e0]', BODY, className)}>
      {children}
    </div>
  );
}

/** Popup-style message (error | info | warning | success), port of the old message popups. */
export function MessageBox({ kind = 'info', title, details, code }) {
  const map = {
    error: { icon: OctagonX, tone: 'wolf' },
    info: { icon: Info, tone: 'sky' },
    warning: { icon: CircleAlert, tone: 'wood' },
    success: { icon: CircleCheck, tone: 'grass' },
  }[kind];
  const Icon = map.icon;
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={cn('w-full max-w-md overflow-hidden rounded-3xl bg-[#fdf3e1] text-[#3a2a1f] dark:bg-[#3b2f4d] dark:text-[#fff4e0]', BORDER, STICKER)}>
      <div className={cn('flex items-center gap-3 px-4 py-3', TONES[map.tone])}>
        <Icon strokeWidth={2.5} className="size-7 shrink-0" aria-hidden="true" />
        <h2 className={cn(HEADING, 'text-2xl leading-tight')}>{title}</h2>
      </div>
      <div className="flex flex-col gap-3 p-4">
        {details && <p className="text-base font-medium">{details}</p>}
        {code && (
          <span className={cn('self-start rounded-full bg-[#3a2a1f] px-3 py-0.5 text-sm font-bold text-[#fdf3e1] dark:bg-[#120c1a] dark:text-[#fff4e0]', BORDER)}>
            Error code: {code}
          </span>
        )}
      </div>
    </div>
  );
}

const linkCls = (extra = '') => cn(
  'rounded-2xl border-[3px] border-transparent px-3 py-1 text-lg font-bold no-underline hover:border-[#3a2a1f] hover:bg-[#8cc152] dark:hover:border-[#120c1a] dark:hover:bg-[#5f9a3a]',
  SPRING, FOCUS, BODY, extra,
);
const menuItemCls = '!text-[#3a2a1f] dark:!text-[#fff4e0] cursor-pointer gap-2 rounded-xl px-3 py-2 text-base font-bold no-underline focus:bg-[#8cc152] focus:text-[#3a2a1f] dark:focus:bg-[#5f9a3a] dark:focus:text-[#fff4e0]';
const menuContentCls = cn('min-w-48 rounded-2xl bg-[#fdf3e1] p-2 text-[#3a2a1f] dark:bg-[#3b2f4d] dark:text-[#fff4e0]', BORDER, STICKER, BODY);

const NAV_LINKS = [
  { href: '/home', label: 'Home', icon: House },
  { href: '/habitant/', label: 'Stats&History', icon: Clock3 },
];
const GAME_LINKS = [
  { href: '/rules', label: 'Rulebook', icon: ScrollText },
  { href: '/newVillage', label: 'Create a village', icon: Castle },
  { href: '/village', label: 'Join your village', icon: Users },
];

/** Player search: Command inside a Popover anchored to the input. Results come from the `search` fixture. */
export function PlayerSearch({ defaultOpen = false, defaultQuery = '', inline = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [query, setQuery] = useState(defaultQuery);
  const users = search['resource-list'].map((r) => r.player.username)
    .filter((u) => u.toLowerCase().includes(query.toLowerCase()));
  const list = (
    <CommandList>
      <CommandEmpty>No player found.</CommandEmpty>
      {users.map((u) => (
        <CommandItem key={u} value={u} onSelect={() => { window.location.href = `/habitant/${u}`; }}
          className="gap-2 text-base font-bold data-[selected=true]:bg-[#8cc152] data-[selected=true]:text-[#3a2a1f] dark:data-[selected=true]:bg-[#5f9a3a] dark:data-[selected=true]:text-[#fff4e0]">
          <UserRound strokeWidth={2.5} className="size-5" aria-hidden="true" />
          {u}
        </CommandItem>
      ))}
    </CommandList>
  );
  if (inline) {
    return (
      <Command shouldFilter={false} className={cn('overflow-visible rounded-2xl bg-[#fdf3e1] text-[#3a2a1f] dark:bg-[#3b2f4d] dark:text-[#fff4e0]', BORDER, STICKER, BODY)}>
        <CommandInput placeholder="Search player..." aria-label="Search player" value={query} onValueChange={setQuery} className={cn('text-base font-medium', BODY)} />
        <div className="border-t-[3px] border-[#3a2a1f] dark:border-[#120c1a]">{list}</div>
      </Command>
    );
  }
  return (
    <Command shouldFilter={false} className={cn('overflow-visible rounded-2xl bg-[#fdf3e1] text-[#3a2a1f] dark:bg-[#3b2f4d] dark:text-[#fff4e0]', BORDER, STICKER)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className="w-full" onFocus={() => setOpen(true)}>
            <CommandInput
              placeholder="Search player..."
              aria-label="Search player"
              value={query}
              onValueChange={(v) => { setQuery(v); setOpen(true); }}
              className={cn('text-base font-medium', BODY)}
            />
          </div>
        </PopoverAnchor>
        <PopoverContent
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className={cn('w-(--radix-popper-anchor-width) overflow-hidden rounded-2xl bg-[#fdf3e1] p-0 dark:bg-[#3b2f4d]', BORDER, STICKER, BODY)}
        >
          {list}
        </PopoverContent>
      </Popover>
    </Command>
  );
}

/** Light/dark toggle: sets document.body.dataset.bsTheme (the app's theme switch). */
export function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.body.dataset.bsTheme || 'light');
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.body.dataset.bsTheme = next;
    setTheme(next);
  };
  const Icon = theme === 'dark' ? Sun : Moon;
  return (
    <button type="button" onClick={toggle} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className={stickerButton('cream', 'size-11 px-0')}>
      <Icon strokeWidth={2.5} className="size-5" aria-hidden="true" />
    </button>
  );
}

/** User menu: logged in shows the profile and logout, logged out shows "Not Logged In" and login. */
export function UserMenu({ user, defaultOpen = false }) {
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label={user ? `Account menu for ${user}` : 'Account menu'} className={stickerButton('cream', 'h-11 px-2')}>
          <span className={cn('inline-flex size-7 items-center justify-center rounded-full bg-[#8cc152] text-[#3a2a1f] dark:bg-[#5f9a3a] dark:text-[#fff4e0]', BORDER)}>
            <User strokeWidth={2.5} className="size-4" aria-hidden="true" />
          </span>
          <span className="hidden sm:inline">{user ?? 'Guest'}</span>
          <ChevronDown strokeWidth={2.5} className="size-4" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={menuContentCls}>
        {user ? (
          <>
            <DropdownMenuLabel className="text-sm font-bold opacity-75">{user}</DropdownMenuLabel>
            <DropdownMenuItem asChild className={menuItemCls}><a href="/habitant/me"><UserRound className="size-5" aria-hidden="true" />My Profile</a></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className={menuItemCls}><a href="/logout"><LogOut className="size-5" aria-hidden="true" />Log Out</a></DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel className="text-sm font-bold opacity-75">Not Logged In</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className={menuItemCls}><a href="/login"><LogIn className="size-5" aria-hidden="true" />Log In</a></DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Sticky sky-colored top bar: logo, links, Game menu, search, theme, user menu; hamburger Sheet on mobile. */
export function Navbar({ user, searchOpen = false, userMenuOpen = false }) {
  return (
    <header className={cn('sticky top-0 z-40 border-b-[3px] border-[#3a2a1f] bg-[#7cc6e8] dark:border-[#120c1a] dark:bg-[#3b2f4d]')}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <a href="/home" className={cn(HEADING, 'text-2xl leading-none text-[#3a2a1f] no-underline dark:text-[#fff4e0]', FOCUS, 'rounded-lg')}>
          Lupus in Fabula
        </a>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={linkCls('!text-[#3a2a1f] dark:!text-[#fff4e0]')}>{l.label}</a>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className={linkCls('inline-flex items-center gap-1 !text-[#3a2a1f] dark:!text-[#fff4e0]')}>
                Game <ChevronDown strokeWidth={2.5} className="size-4" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className={menuContentCls}>
              {GAME_LINKS.map((l) => (
                <DropdownMenuItem key={l.href} asChild className={menuItemCls}><a href={l.href}><l.icon className="size-5" aria-hidden="true" />{l.label}</a></DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="order-last flex w-full items-center gap-2 md:order-none md:ml-auto md:w-60">
          <PlayerSearch defaultOpen={searchOpen} />
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <ThemeToggle />
          <span className="hidden md:inline-flex"><UserMenu user={user} defaultOpen={userMenuOpen} /></span>
          <Sheet>
            <SheetTrigger asChild>
              <button type="button" aria-label="Open menu" className={stickerButton('cream', 'size-11 px-0 md:hidden')}>
                <Menu strokeWidth={2.5} className="size-5" aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className={cn('w-72 bg-[#fdf3e1] p-5 text-[#3a2a1f] dark:bg-[#2b2238] dark:text-[#fff4e0]', BODY)}>
              <SheetTitle className={cn(HEADING, 'text-3xl')}>Lupus in Fabula</SheetTitle>
              <SheetDescription className="sr-only">Site navigation</SheetDescription>
              <nav aria-label="Mobile" className="mt-4 flex flex-col gap-2">
                {[...NAV_LINKS, ...GAME_LINKS].map((l) => (
                  <a key={l.href} href={l.href} className={stickerButton('grass', 'justify-start text-lg')}>
                    <l.icon strokeWidth={2.5} className="size-5" aria-hidden="true" />{l.label}
                  </a>
                ))}
                <div className="my-2 h-[3px] rounded-full bg-[#3a2a1f] dark:bg-[#120c1a]" />
                {user ? (
                  <>
                    <a href="/habitant/me" className={stickerButton('cream', 'justify-start text-lg')}><UserRound strokeWidth={2.5} className="size-5" aria-hidden="true" />My Profile</a>
                    <a href="/logout" className={stickerButton('wolf', 'justify-start text-lg')}><LogOut strokeWidth={2.5} className="size-5" aria-hidden="true" />Log Out</a>
                  </>
                ) : (
                  <a href="/login" className={stickerButton('wood', 'justify-start text-lg')}><LogIn strokeWidth={2.5} className="size-5" aria-hidden="true" />Log In</a>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

/** Footer: grass strip with the copyright line. */
export function Footer() {
  return (
    <footer className={cn('mt-auto border-t-[3px] border-[#3a2a1f] bg-[#8cc152] px-4 py-4 text-center text-sm font-bold text-[#3a2a1f] dark:border-[#120c1a] dark:bg-[#3b2f4d] dark:text-[#fff4e0]', BODY)}>
      © 2024 Team LIF - Lupus in Fabula. All rights reserved.
    </footer>
  );
}

/** Variant shell: root + Navbar + <main> + Footer. user = username string or null. */
export function Layout({ user, children }) {
  return (
    <VariantRoot>
      <Navbar user={user} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-8">{children}</main>
      <Footer />
    </VariantRoot>
  );
}
