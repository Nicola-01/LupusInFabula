import { useEffect, useState } from 'react';
import {
  ChevronDown, CircleAlert, CircleCheck, Info, LogIn, LogOut, Menu, Moon, Search, Sun, TriangleAlert, UserRound, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { search } from '@/mocks/fixtures';

// Variant C tokens. Portals (menus, popovers, sheets) render outside any wrapper, so every
// piece carries its own classes instead of relying on a scoped stylesheet.
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=IM+Fell+English:ital@0;1&family=UnifrakturCook:wght@700&display=swap';
const PARCHMENT = 'bg-[radial-gradient(circle_at_30%_20%,#fbf4e2,#ecdcb8)] dark:bg-none dark:bg-[#2a2218]';
const INK = 'text-[#3b2a1a] dark:text-[#efe2c4]';
const RUBRIC = 'text-[#8b1e1e] dark:text-[#d0574a]';
const GOLD_BORDER = 'border-[#b08a2e] dark:border-[#d4b25a]';
const TITLE_FONT = "font-['Cinzel']";
const TEXT_FONT = "font-['IM_Fell_English']";

export const primaryBtn = cn(
  "rounded-sm border border-[#8b1e1e] bg-[#8b1e1e] text-[#f4e9d1] font-['Cinzel'] font-bold tracking-wide hover:bg-[#6e1616]",
  'dark:border-[#d0574a] dark:bg-[#d0574a] dark:text-[#2a2218] dark:hover:bg-[#e06a5d]',
);
export const outlineBtn = cn(
  "rounded-sm border-2 border-[#b08a2e] bg-transparent text-[#3b2a1a] font-['Cinzel'] font-bold tracking-wide hover:bg-[#b08a2e]/15",
  'dark:border-[#d4b25a] dark:text-[#efe2c4] dark:hover:bg-[#d4b25a]/15',
);

const menuCls = cn('[&_a]:text-current [&_a]:no-underline rounded-sm border-2 border-[#b08a2e] bg-[#fbf4e2] p-1 shadow-[0_8px_20px_rgba(60,40,10,.3)] dark:bg-[#2a2218] dark:border-[#d4b25a]', INK, TEXT_FONT);
const itemCls = cn('cursor-pointer rounded-sm px-3 py-2 text-[15px] focus:bg-[#b08a2e]/20 focus:text-[#3b2a1a] dark:focus:bg-[#d4b25a]/20 dark:focus:text-[#efe2c4]', TEXT_FONT);
const navBtn = cn("no-underline inline-flex items-center gap-1 rounded-sm px-3 py-2 text-sm uppercase tracking-wider hover:bg-[#b08a2e]/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b1e1e] dark:focus-visible:outline-[#d4b25a]", TITLE_FONT, INK);
const iconBtn = cn('inline-flex size-10 items-center justify-center rounded-sm border-2 border-[#b08a2e] hover:bg-[#b08a2e]/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b1e1e] dark:border-[#d4b25a] dark:focus-visible:outline-[#d4b25a]', INK);

// Shared hook: follows data-bs-theme on <body> (set by the theme toggle and by the gallery).
function useBodyDark() {
  const [dark, setDark] = useState(() => document.body.dataset.bsTheme === 'dark');
  useEffect(() => {
    const obs = new MutationObserver(() => setDark(document.body.dataset.bsTheme === 'dark'));
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-bs-theme'] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

// Parchment panel with a gilded double border and inner vignette.
export function Panel({ as: Tag = 'section', className, children, ...props }) {
  return (
    <Tag
      className={cn(
        `relative rounded-sm border-4 border-double p-6 shadow-[inset_0_0_40px_rgba(120,80,30,.25)] ${PARCHMENT} ${GOLD_BORDER} ${INK} ${TEXT_FONT}`,
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

// Wax seal badge: irregular red blob with gold lettering.
export function Seal({ children, className }) {
  return (
    <span
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-[48%_52%_50%_50%] bg-[#8b1e1e] text-[#d4b25a] shadow-[inset_0_0_0_2px_#d4b25a66,0_2px_4px_rgba(0,0,0,.35)] font-['Cinzel'] text-sm font-bold motion-safe:transition-transform motion-safe:duration-200",
        className,
      )}
    >
      {children}
    </span>
  );
}

// Illuminated first letter of a paragraph (children must be a string).
export function DropCap({ children, className }) {
  const text = String(children);
  return (
    <p className={cn(`leading-relaxed ${INK} ${TEXT_FONT}`, className)}>
      <span className="float-left mr-2 font-['UnifrakturCook'] text-6xl leading-none font-bold text-[#8b1e1e] dark:text-[#d0574a]">
        {text[0]}
      </span>
      {text.slice(1)}
    </p>
  );
}

export function Ornament({ className }) {
  return (
    <div className={cn('flex items-center gap-3 text-[#b08a2e] dark:text-[#d4b25a]', className)} aria-hidden>
      <span className="h-px flex-1 bg-current" />
      <span className="text-sm">&#10022;</span>
      <span className="h-px flex-1 bg-current" />
    </div>
  );
}

export function PageTitle({ children, sub, className }) {
  return (
    <header className={cn('text-center', className)}>
      <h1 className={cn(`text-3xl font-bold tracking-wide sm:text-4xl ${TITLE_FONT} ${INK}`)}>{children}</h1>
      {sub && <p className={cn(`mt-2 italic ${TEXT_FONT} ${RUBRIC}`)}>{sub}</p>}
      <Ornament className="mx-auto mt-4 max-w-md" />
    </header>
  );
}

export function ThemeToggle({ className }) {
  const dark = useBodyDark();
  return (
    <button
      type="button"
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => { document.body.dataset.bsTheme = dark ? 'light' : 'dark'; }}
      className={cn(iconBtn, className)}
    >
      {dark ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />}
    </button>
  );
}

// Player search: input + results popover (Command), results from the `search` fixture.
export function PlayerSearch({ initialQuery = '', initialOpen = false, className }) {
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(initialOpen);
  const q = query.trim().toLowerCase();
  const players = search['resource-list']
    .map((r) => r.player)
    .filter((p) => p.username.toLowerCase().includes(q));

  return (
    <Popover open={open && q !== ''} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className={cn('relative', className)}>
          <Search className={cn('pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 opacity-70', INK)} aria-hidden />
          <Input
            type="search"
            aria-label="Search player"
            placeholder="Search player"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            className={cn(
              `h-10 rounded-sm border-2 border-[#b08a2e] bg-[#fbf4e2]/70 pl-9 placeholder:text-[#3b2a1a]/60 focus-visible:ring-[#8b1e1e] dark:border-[#d4b25a] dark:bg-[#1f1a12] dark:placeholder:text-[#efe2c4]/60 dark:focus-visible:ring-[#d4b25a] ${INK} ${TEXT_FONT}`,
            )}
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        className={cn('w-[--radix-popover-trigger-width] min-w-56 rounded-sm border-2 border-[#b08a2e] p-0 dark:border-[#d4b25a]', PARCHMENT, INK, TEXT_FONT)}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command shouldFilter={false} className="rounded-none bg-transparent">
          <CommandList>
            <CommandEmpty className={TEXT_FONT}>No player found.</CommandEmpty>
            <CommandGroup heading="Players" className={cn(`${TITLE_FONT} text-xs`, RUBRIC)}>
              {players.map((p) => (
                <CommandItem
                  key={p.username}
                  value={p.username}
                  onSelect={() => { window.location.href = `/habitant/${p.username}`; }}
                  className="cursor-pointer rounded-sm text-[15px] data-[selected=true]:bg-[#b08a2e]/20 dark:data-[selected=true]:bg-[#d4b25a]/20"
                >
                  <Seal className="size-7 text-xs">{p.username[0].toUpperCase()}</Seal>
                  {p.username}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Same links for the desktop user menu and the mobile sheet.
function userLinks(user) {
  return user
    ? [{ label: 'My Profile', href: '/habitant/me', Icon: UserRound }, { label: 'Log Out', href: '/logout', Icon: LogOut }]
    : [{ label: 'Log In', href: '/login', Icon: LogIn }];
}

// Static copy of the open user menu (no Radix, so it cannot steal focus from other popovers).
export function UserMenuPreview({ user = null }) {
  return (
    <div className={cn('w-48', menuCls)}>
      <p className={cn(`px-3 py-1 text-xs tracking-wider uppercase ${TITLE_FONT} ${RUBRIC}`)}>{user ?? 'Not Logged In'}</p>
      {userLinks(user).map(({ label, href, Icon }) => (
        <div key={href} className={itemCls}><a href={href} className="flex items-center gap-2"><Icon className="size-4" aria-hidden />{label}</a></div>
      ))}
    </div>
  );
}

function NavLink({ href, children }) {
  return <a href={href} className={navBtn}>{children}</a>;
}

function GameMenu({ align = 'start' }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className={navBtn}>
        Game <ChevronDown className="size-4" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={cn('min-w-52', menuCls)}>
        <DropdownMenuItem asChild className={itemCls}><a href="/rules">Rulebook</a></DropdownMenuItem>
        <DropdownMenuItem asChild className={itemCls}><a href="/newVillage">Create a village</a></DropdownMenuItem>
        <DropdownMenuItem asChild className={itemCls}><a href="/village">Join your village</a></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Top bar. `initialSearch*` exist so the demo page can show open states.
export function Navbar({ user = null, initialSearch = '', initialSearchOpen = false }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const links = userLinks(user);

  return (
    <header className={cn(`relative border-b-4 border-double ${GOLD_BORDER} bg-[#f4e9d1]/95 dark:bg-[#2a2218]/95 ${INK} ${TEXT_FONT}`)}>
      {/* Desktop */}
      <div className="mx-auto hidden max-w-6xl items-center gap-3 px-6 py-3 md:flex">
        <a href="/home" className={cn(`no-underline mr-2 text-xl font-bold whitespace-nowrap ${TITLE_FONT} ${RUBRIC}`)}>
          Lupus in Fabula
        </a>
        <nav aria-label="Main" className="flex items-center gap-1">
          <NavLink href="/home">Home</NavLink>
          <NavLink href="/habitant/">Stats&amp;History</NavLink>
          <GameMenu />
        </nav>
        <PlayerSearch initialQuery={initialSearch} initialOpen={initialSearchOpen} className="ml-auto w-56" />
        <ThemeToggle />
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="group rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b1e1e]" aria-label="User menu">
            <Seal className="group-hover:motion-safe:scale-110">{user ? user[0].toUpperCase() : <UserRound className="size-5" aria-hidden />}</Seal>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={cn('min-w-48', menuCls)}>
            {user
              ? <DropdownMenuLabel className={cn(`px-3 py-1 text-xs tracking-wider uppercase ${TITLE_FONT} ${RUBRIC}`)}>{user}</DropdownMenuLabel>
              : <DropdownMenuLabel className={cn(`px-3 py-1 text-xs tracking-wider uppercase ${TITLE_FONT} ${RUBRIC}`)}>Not Logged In</DropdownMenuLabel>}
            {links.map(({ label, href, Icon }) => (
              <DropdownMenuItem key={href} asChild className={itemCls}>
                <a href={href} className="flex items-center gap-2"><Icon className="size-4" aria-hidden />{label}</a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:hidden">
        <a href="/home" className={cn(`no-underline text-lg font-bold whitespace-nowrap ${TITLE_FONT} ${RUBRIC}`)}>Lupus in Fabula</a>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button type="button" aria-label="Open menu" className={iconBtn}><Menu className="size-5" aria-hidden /></button>
          </SheetTrigger>
          <SheetContent
            side="right"
            showCloseButton={false}
            className={cn(`[&_a]:text-current [&_a]:no-underline w-[85%] max-w-sm border-l-4 border-double ${GOLD_BORDER} ${PARCHMENT} ${INK} ${TEXT_FONT} p-0`)}
          >
            <SheetHeader className="flex-row items-center justify-between border-b-2 border-[#b08a2e] p-4 dark:border-[#d4b25a]">
              <SheetTitle className={cn(`text-lg ${TITLE_FONT} ${RUBRIC}`)}>Lupus in Fabula</SheetTitle>
              <SheetDescription className="sr-only">Site navigation</SheetDescription>
              <button type="button" aria-label="Close menu" onClick={() => setSheetOpen(false)} className={iconBtn}>
                <X className="size-5" aria-hidden />
              </button>
            </SheetHeader>
            <nav aria-label="Main mobile" className={cn(`flex flex-col gap-1 p-4 ${TITLE_FONT} text-sm uppercase tracking-wider`)}>
              <a href="/home" className="rounded-sm px-3 py-2 hover:bg-[#b08a2e]/15">Home</a>
              <a href="/habitant/" className="rounded-sm px-3 py-2 hover:bg-[#b08a2e]/15">Stats&amp;History</a>
              <p className={cn('px-3 pt-3 text-xs', RUBRIC)}>Game</p>
              <a href="/rules" className="rounded-sm px-3 py-2 pl-6 hover:bg-[#b08a2e]/15">Rulebook</a>
              <a href="/newVillage" className="rounded-sm px-3 py-2 pl-6 hover:bg-[#b08a2e]/15">Create a village</a>
              <a href="/village" className="rounded-sm px-3 py-2 pl-6 hover:bg-[#b08a2e]/15">Join your village</a>
            </nav>
            <div className="px-4"><PlayerSearch className="w-full" /></div>
            <div className="flex items-center justify-between gap-3 p-4">
              <ThemeToggle />
              <div className="flex flex-col items-end gap-1">
                {user && <span className={cn(`text-xs ${TITLE_FONT} ${RUBRIC}`)}>{user}</span>}
                {!user && <span className={cn(`text-xs ${TITLE_FONT} ${RUBRIC}`)}>Not Logged In</span>}
                {links.map(({ label, href, Icon }) => (
                  <a key={href} href={href} className="flex items-center gap-2 rounded-sm px-3 py-2 hover:bg-[#b08a2e]/15">
                    <Icon className="size-4" aria-hidden />{label}
                  </a>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className={cn(`border-t-4 border-double ${GOLD_BORDER} px-4 py-6 text-center text-sm italic ${INK} ${TEXT_FONT}`)}>
      © 2024 Team LIF - Lupus in Fabula. All rights reserved.
    </footer>
  );
}

// Page shell: fonts, parchment background, navbar, main, footer.
export function Layout({ user = null, children }) {
  useEffect(() => {
    if (document.getElementById('mock-C-fonts')) return;
    const link = document.createElement('link');
    link.id = 'mock-C-fonts';
    link.rel = 'stylesheet';
    link.href = FONT_URL;
    document.head.appendChild(link);
  }, []);

  return (
    <div className={cn(`flex min-h-screen flex-col ${PARCHMENT} ${INK} ${TEXT_FONT}`)}>
      <Navbar user={user} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      <Footer />
    </div>
  );
}

const MESSAGE_KINDS = {
  error: { Icon: CircleAlert, seal: 'bg-[#8b1e1e] text-[#f4e9d1] dark:bg-[#d0574a] dark:text-[#2a2218]', role: 'alert' },
  info: { Icon: Info, seal: 'bg-[#3b2a1a] text-[#f4e9d1] dark:bg-[#efe2c4] dark:text-[#2a2218]', role: 'status' },
  warning: { Icon: TriangleAlert, seal: 'bg-[#b08a2e] text-[#2a2218] dark:bg-[#d4b25a] dark:text-[#2a2218]', role: 'alert' },
  success: { Icon: CircleCheck, seal: 'bg-[#3f5f3a] text-[#f4e9d1]', role: 'status' },
};

// Popup message, parchment style. `code` is shown as an engraved tag.
export function MessageBox({ kind = 'info', title, details, code }) {
  const { Icon, seal, role } = MESSAGE_KINDS[kind];
  return (
    <Panel role={role} className="flex max-w-md gap-4 p-5">
      <Seal className={cn('size-12', seal)}><Icon className="size-6" aria-hidden /></Seal>
      <div className="min-w-0 flex-1">
        <p className={cn(`text-lg font-bold ${TITLE_FONT}`)}>{title}</p>
        {details && <p className="mt-1 text-[15px] leading-snug">{details}</p>}
        {code && (
          <p className={cn(`mt-3 inline-block border border-current px-2 py-0.5 text-xs tracking-[.2em] ${TITLE_FONT} ${RUBRIC}`)}>
            Code {code}
          </p>
        )}
      </div>
    </Panel>
  );
}
