import { useEffect, useState } from 'react';
import { ChevronDown, LogIn, LogOut, Menu, MonitorSmartphone, Moon, Search, Sun, SunMoon, UserRound } from 'lucide-react';
import { useSession } from '../utils/session.js';
import { contextPath, getCookie, genericGETRequest, HTTP_STATUS_OK, JSON_resource_list, setCookie } from '../utils/utils.js';
import { minSizeSearch } from '../utils/searchPlayer.js';
import { Button } from '@/components/ui/button';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

/*
 * Navbar (variant F shell, restyled from the mock kit mocks/shell/kit/F.jsx; logic unchanged).
 * Login state: useSession(). Theme: cookie + loadTheme() below (same rules as before), chosen from the
 * Theme menu (desktop/mobile header) or the 4-mode row in the hamburger Sheet.
 * Player search (logged-in users only) is an overlay, it does not touch the #playerUsername input of the pages.
 * Usage: <Navbar /> at the top of every page.
 */

// Same four modes and order as the old theme circles / mobile list.
const THEMES = [
  { id: 'light', label: 'Light', Icon: Sun },
  { id: 'dark', label: 'Dark', Icon: Moon },
  { id: 'auto', label: 'Auto', Icon: MonitorSmartphone },
  { id: 'dynamic', label: 'Dynamic', Icon: SunMoon },
];

const GAME_LINKS = [
  { href: '/rules', label: 'Rulebook' },
  { href: '/newVillage', label: 'Create a village' },
  { href: '/village', label: 'Join your village' },
];

// Global `a` styles (blue, underlined) are overridden with !; the brass underline shows on active/hover.
const NAV_LINK = '!no-underline !text-lf-navtext relative py-2 font-lf-heading tracking-wide after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-lf-nav-brass after:content-[""] after:scale-x-0 after:transition-transform hover:after:scale-x-100';
const navClass = (on) => (on ? `${NAV_LINK} after:scale-x-100` : NAV_LINK);
const ICON_BTN = 'size-11 md:size-9 !text-lf-navtext hover:!bg-white/10 hover:!text-lf-navtext dark:hover:!bg-white/10';
const PANEL = 'lf-paper !bg-lf-paper !text-lf-ink !border-[3px] !border-double !border-lf-brass !rounded-sm !shadow-[var(--lf-shadow-paper)]';
const ITEM = '!no-underline !text-lf-ink focus:!bg-lf-hl focus:!text-lf-ink cursor-pointer';

/**
 * Applies the theme: "light"/"dark" as is, "dynamic"/invalid follow the system, dynamic on a village
 * page follows the game phase (night = dark). Sets <body data-bs-theme>. Same rules as the old loadTheme().
 */
export function loadTheme() {
    let theme = getCookie("theme");
    if (!theme) { // default theme
        setCookie("theme", "dynamic");
        theme = "dynamic";
    }

    let themeToSet;
    if (theme === "light" || theme === "dark")
        themeToSet = theme;
    else
        themeToSet = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    // Dynamic theme in the village section follows the game phase.
    if (theme === "dynamic" && window.location.href.includes("/village/") && document.getElementById("gameStatus") !== null) {
        if (document.getElementById("gameStatus").textContent.toLocaleLowerCase().includes("night"))
            themeToSet = "dark";
        else
            themeToSet = "light";
    }
    // 404 page
    if (document.getElementById("pageNotFound"))
        themeToSet = "dark";

    document.body.setAttribute("data-bs-theme", themeToSet);

    const iframe = document.getElementById('background');
    if (iframe) {
        const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        innerDoc.body.setAttribute("data-bs-theme", themeToSet);

        iframe.onload = function () {
            const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (innerDoc) innerDoc.body.setAttribute("data-bs-theme", themeToSet);
        };
    }
}

function WolfMark({ className = '' }) {
  const mask = 'url(/media/logo_wolf_sm.svg) center/contain no-repeat';
  return (
    <span aria-hidden="true" className={`inline-block shrink-0 align-middle bg-lf-nav-brass ${className}`}
          style={{ WebkitMask: mask, mask }} />
  );
}

function ThemeMenu({ theme, onChoose }) {
  const current = THEMES.find((t) => t.id === theme) ?? THEMES[3];
  const CurrentIcon = current.Icon;
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={ICON_BTN} aria-label={`Theme: ${current.label}`}>
          <CurrentIcon aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={`${PANEL} min-w-44 p-1`}>
        <DropdownMenuRadioGroup value={theme ?? 'dynamic'} onValueChange={onChoose}>
          {THEMES.map(({ id, label, Icon }) => (
            <DropdownMenuRadioItem key={id} value={id} className={`${ITEM} gap-3 py-2`}>
              <Icon aria-hidden="true" />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Same four modes as a row of buttons (hamburger Sheet).
function ThemeRow({ theme, onChoose }) {
  return (
    <div role="radiogroup" aria-label="Theme" className="grid grid-cols-4 gap-1">
      {THEMES.map(({ id, label, Icon }) => {
        const on = (theme ?? 'dynamic') === id;
        return (
          <Button key={id} type="button" role="radio" aria-checked={on} aria-label={label}
                  variant={on ? 'felt' : 'brass'} size="touch" onClick={() => onChoose(id)}
                  className="flex-col gap-0.5 px-1 text-xs">
            <Icon aria-hidden="true" className="size-5" />
            {label}
          </Button>
        );
      })}
    </div>
  );
}

function UserMenu({ user, loading }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`${ICON_BTN} md:w-auto md:px-2 md:gap-2`} aria-label="User menu">
          <UserRound aria-hidden="true" />
          <span className="hidden md:inline">{user ? user.username : 'Guest'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={`${PANEL} min-w-44 p-1`}>
        {user ? (
          <>
            <DropdownMenuLabel className="font-lf-title px-2 py-1.5 text-sm text-lf-rubric">{user.username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className={ITEM}>
              <a href="/habitant/me" className="flex min-h-11 items-center gap-2"><UserRound aria-hidden="true" />My Profile</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className={ITEM}>
              <a href="/logout" className="flex min-h-11 items-center gap-2"><LogOut aria-hidden="true" />Log Out</a>
            </DropdownMenuItem>
          </>
        ) : !loading && (
          <>
            <DropdownMenuLabel className="font-lf-title px-2 py-1.5 text-sm text-lf-rubric">Not Logged In</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className={ITEM}>
              <a href="/login" className="flex min-h-11 items-center gap-2"><LogIn aria-hidden="true" />Log In</a>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Player search overlay: same endpoint and JSON as SearchPlayer (user/search/{text}); a click opens the statistics page.
function PlayerSearch({ open, onOpenChange }) {
  const [text, setText] = useState('');
  const [found, setFound] = useState([]);

  useEffect(() => {
    const needle = text.trim();
    if (!open || needle.length < minSizeSearch) { setFound([]); return; }
    let stale = false;
    genericGETRequest(contextPath + 'user/search/' + encodeURIComponent(needle), (req) => {
      if (stale || req.readyState !== XMLHttpRequest.DONE || req.status !== HTTP_STATUS_OK) return;
      const list = JSON.parse(req.responseText)[JSON_resource_list] ?? [];
      setFound(list.map((r) => r.player.username));
    });
    return () => { stale = true; };
  }, [text, open]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Search player" description="Type a username to find a player.">
      <CommandInput placeholder="Search player..." value={text} onValueChange={setText} />
      <CommandList>
        <CommandEmpty>{text.trim() ? 'No player found.' : 'Type a username.'}</CommandEmpty>
        <CommandGroup heading="Players" className="font-lf-heading text-lf-rubric">
          {found.map((username) => (
            <CommandItem key={username} value={username} className="gap-2 text-base cursor-pointer"
                         onSelect={() => { window.location.href = '/habitant/' + encodeURIComponent(username); }}>
              {username}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export default function Navbar() {
  const { user, loading } = useSession();
  const [theme, setTheme] = useState(() => getCookie("theme"));
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Mount: apply the theme and sync the selected entries with the cookie.
  useEffect(() => {
    loadTheme();
    setTheme(getCookie("theme"));
  }, []);

  const choose = (value) => {
    // same as the old click handlers: store the cookie, apply, refresh the selected entry
    setCookie("theme", value);
    setTheme(value);
    loadTheme();
  };

  // Active links: same rule as the old js/navbar.js (path substring of href).
  const path = window.location.pathname;
  // direct link: "/habitant/" would load the app twice (it only redirects to the user's page)
  const statsHref = user ? "/habitant/" + encodeURIComponent(user.username) : "/habitant/";
  const onProfile = path === "/habitant/me";
  const isActive = (href) => !onProfile && path.includes(href);
  const gameSection = !onProfile && ["/rules", "/newVillage", "/village"].some((p) => path.includes(p));

  return (
    <header className="lf-nav sticky top-0 z-[1030] mb-6 border-b-2 border-lf-nav-brass">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2 md:gap-x-6 md:px-4">
        <a href="/home" className="!no-underline !text-lf-navtext font-lf-title inline-flex min-h-11 items-center gap-2 whitespace-nowrap text-[15px] sm:text-lg md:text-xl">
          <WolfMark className="size-6 sm:size-7" />
          Lupus in Fabula
        </a>

        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          <a href="/home" className={navClass(isActive("/home"))} aria-current={isActive("/home") ? 'page' : undefined}>Home</a>
          <a href={statsHref} className={navClass(isActive("/habitant/"))}>Stats&amp;History</a>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={`${navClass(gameSection)} h-auto px-0 text-base hover:!bg-transparent`}>
                Game <ChevronDown aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className={`${PANEL} min-w-48 p-1`}>
              {GAME_LINKS.map((l) => (
                <DropdownMenuItem key={l.href} asChild className={ITEM}>
                  <a href={l.href} className="flex min-h-11 items-center">{l.label}</a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          {user && (
            <Button variant="ghost" size="icon" className={ICON_BTN} aria-label="Search player" onClick={() => setSearchOpen(true)}>
              <Search aria-hidden="true" />
            </Button>
          )}
          <ThemeMenu theme={theme} onChoose={choose} />
          <UserMenu user={user} loading={loading} />

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={`${ICON_BTN} md:hidden`} aria-label="Open menu">
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className={`${PANEL} !rounded-none !border-y-0 !border-r-0 !border-l-[3px] w-72 gap-0 p-0`}>
              <SheetTitle className="font-lf-title flex items-center gap-2 border-b-2 border-lf-brass p-4 text-lg text-lf-rubric">
                <WolfMark className="size-6 bg-lf-rubric" />
                Lupus in Fabula
              </SheetTitle>
              <nav aria-label="Mobile" className="flex flex-col gap-1 p-4 text-lg" onClick={() => setMobileOpen(false)}>
                <a href="/home" className={`${ITEM} rounded-sm px-2 py-1`}>Home</a>
                <a href={statsHref} className={`${ITEM} rounded-sm px-2 py-1`}>Stats&amp;History</a>
                <span className="font-lf-heading mt-3 text-xs tracking-widest text-lf-rubric">Game</span>
                {GAME_LINKS.map((l) => (
                  <a key={l.href} href={l.href} className={`${ITEM} rounded-sm py-1 pl-4`}>{l.label}</a>
                ))}
                <span className="font-lf-heading mt-3 text-xs tracking-widest text-lf-rubric">Theme</span>
                <ThemeRow theme={theme} onChoose={choose} />
                <span className="font-lf-heading mt-3 text-xs tracking-widest text-lf-rubric">Account</span>
                {user ? (
                  <>
                    <a href="/habitant/me" className={`${ITEM} rounded-sm py-1 pl-4`}>My Profile</a>
                    <a href="/logout" className={`${ITEM} rounded-sm py-1 pl-4`}>Log Out</a>
                  </>
                ) : !loading && (
                  <a href="/login" className={`${ITEM} rounded-sm py-1 pl-4`}>Log In</a>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {user && <PlayerSearch open={searchOpen} onOpenChange={setSearchOpen} />}
    </header>
  );
}
