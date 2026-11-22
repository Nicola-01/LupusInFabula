import { useState } from 'react';
import { Check, Circle, Eye, EyeOff, Mail, Calendar, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { session, habitantMe, friends, search } from '@/mocks/fixtures';
import {
  Layout, PageTitle, Panel, Seal, Toaster, notify, primaryBtn, outlineBtn, dangerBtn,
  UserToken, USER_COLORS, userColor,
} from '@/mocks/shell/kit/F.jsx';

// Layout and colours of this mock. Plain CSS on purpose (unlayered, so it beats Tailwind utilities).
const CSS = `
.pf-root { width: 100%; max-width: 56rem; margin: 0 auto; display: flex; flex-direction: column; gap: 1.25rem; }
.pf-card { display: flex; flex-wrap: wrap; align-items: center; gap: 1.25rem; padding: 1.25rem 1.5rem; }
.pf-name { font-size: 1.75rem; line-height: 2rem; word-break: break-all; }
.pf-meta { display: flex; flex-direction: column; gap: .25rem; margin-top: .5rem; font-size: 15px; color: var(--f-ink2); }
.pf-meta span { display: flex; align-items: center; gap: .5rem; }
.pf-meta svg { width: 1rem; height: 1rem; flex-shrink: 0; color: var(--f-brass); }
.pf-root .pf-tablist {
  display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; width: 100%; height: auto; padding: 0; background: transparent;
}
@media (min-width: 640px) { .pf-root .pf-tablist { grid-template-columns: repeat(4, 1fr); } }
.pf-root .pf-tab {
  height: 2.75rem; padding: 0 .5rem; background: transparent; color: var(--f-ink); border: 2px solid var(--f-brass); border-radius: 6px;
  font-family: 'Cinzel', Georgia, serif; font-weight: 600; letter-spacing: .04em; font-size: .9rem; white-space: normal; line-height: 1.1;
}
.pf-root .pf-tab:hover { background: var(--f-hl); }
.pf-root .pf-tab[data-state="active"] { background: var(--f-felt); color: var(--f-on-felt); border-color: var(--f-felt); }
.pf-section { display: flex; flex-direction: column; gap: 1rem; padding: 1.5rem; }
@media (min-width: 640px) { .pf-section { padding: 2rem; } }
.pf-h2.pf-gap { margin-top: 1rem; }
.pf-h2 { font-family: 'Cinzel', Georgia, serif; font-weight: 600; font-size: 1.2rem; letter-spacing: .04em; margin: 0; }
.pf-hint { font-size: 15px; color: var(--f-ink2); margin: 0; }
.pf-field { display: flex; flex-direction: column; gap: .375rem; }
.pf-label { font-family: 'Cinzel', Georgia, serif; font-weight: 600; font-size: .875rem; letter-spacing: .05em; }
.pf-input { height: 2.5rem; width: 100%; padding: 0 .75rem; font-size: 1rem; outline: none; }
.pf-input:disabled { opacity: .75; }
.pf-pw { position: relative; }
.pf-pw .pf-input { padding-right: 2.75rem; }
.pf-eye {
  position: absolute; top: 50%; right: .25rem; transform: translateY(-50%); width: 2rem; height: 2rem;
  display: grid; place-items: center; border-radius: 2px; cursor: pointer;
}
.pf-eye svg, .pf-rule svg, .pf-search-ico { width: 1rem; height: 1rem; flex-shrink: 0; }
.pf-btn { height: 2.75rem; padding: 0 1.25rem; font-size: 1rem; }
.pf-btn-sm { height: 2.25rem; padding: 0 .75rem; font-size: .9rem; width: auto; }
.pf-btn-block { width: 100%; }
.pf-btn:disabled, .pf-btn-sm:disabled { opacity: .5; cursor: not-allowed; }
.pf-row { display: flex; align-items: center; gap: .75rem; padding: .625rem .75rem; border: 1px solid var(--f-brass); border-radius: 2px; background: var(--f-hl); }
.pf-row-grow { flex: 1; min-width: 0; }
.pf-strong { font-family: 'Cinzel', Georgia, serif; font-weight: 700; margin: 0; overflow-wrap: anywhere; }
.pf-sub { font-size: 14px; color: var(--f-ink2); margin: 0; }
.pf-free { color: var(--f-seal-ok); font-weight: 700; }
.pf-busy { color: var(--f-rubric); font-weight: 700; }
.pf-colour { flex-basis: 100%; display: flex; flex-direction: column; gap: .75rem; border-top: 1px dashed var(--f-brass); padding-top: 1rem; }
.pf-swatches { display: flex; flex-wrap: wrap; gap: .5rem; list-style: none; margin: 0; padding: 0; }
.pf-swatch {
  width: 2.75rem; height: 2.75rem; flex-shrink: 0; display: grid; place-items: center; border-radius: 9999px;
  border: 2px solid var(--f-brass); color: #fbf6ea; cursor: pointer;
}
.pf-swatch svg { width: 1.125rem; height: 1.125rem; }
.pf-swatch[aria-pressed="true"] { box-shadow: 0 0 0 2px var(--f-paper), 0 0 0 4px var(--f-brass); }
.pf-colour-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .75rem; }
.pf-link {
  min-height: 2.75rem; padding: 0 .25rem; background: transparent; border: 0; color: var(--f-ink);
  font-size: 15px; text-decoration: underline; text-underline-offset: 3px; cursor: pointer;
}
.pf-link:hover { color: var(--f-rubric); }
.pf-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .5rem; }
.pf-empty { font-size: 15px; color: var(--f-ink2); font-style: italic; margin: 0; }
.pf-rules {
  list-style: none; margin: 0; padding: .75rem; border: 1px dashed var(--f-brass); border-radius: 2px;
  display: flex; flex-direction: column; gap: .25rem; font-size: .875rem; color: var(--f-ink2);
}
.pf-rule { display: flex; align-items: center; gap: .5rem; }
.pf-rule[data-ok="true"] { color: var(--f-seal-ok); font-weight: 700; }
.pf-cards-layout { display: flex; flex-direction: column; align-items: center; gap: 1.25rem; }
.pf-preview {
  width: min(60vw, 15rem); aspect-ratio: 5 / 7; overflow: hidden; border-radius: 14px; border: 3px solid var(--f-brass);
  box-shadow: 0 0 0 2px var(--f-paper), 0 0 0 4px var(--f-brass), 0 10px 20px rgba(40, 25, 10, .35);
}
.pf-preview img, .pf-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.pf-caption { font-family: 'Cinzel', Georgia, serif; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; font-size: .85rem; margin: 0; }
.pf-strip {
  display: flex; gap: .75rem; overflow-x: auto; scroll-snap-type: x mandatory; padding: .75rem .25rem; width: 100%;
  scrollbar-width: thin;
}
.pf-thumb {
  position: relative; flex: 0 0 34%; scroll-snap-align: start; aspect-ratio: 5 / 7; padding: 0; overflow: hidden;
  border: 2px solid var(--f-brass); border-radius: 8px; background: var(--f-paper); cursor: pointer;
}
.pf-thumb[aria-pressed="true"] { border-color: var(--f-felt); box-shadow: 0 0 0 2px var(--f-page), 0 0 0 5px var(--f-felt); }
.pf-check {
  position: absolute; top: .3rem; right: .3rem; width: 1.5rem; height: 1.5rem; border-radius: 9999px;
  display: grid; place-items: center; background: var(--f-felt); color: var(--f-on-felt); border: 1.5px solid var(--f-brass);
}
.pf-check svg { width: .875rem; height: .875rem; }
@media (min-width: 640px) { .pf-thumb { flex-basis: 25%; } }
@media (min-width: 1024px) {
  .pf-cards-layout { flex-direction: row; align-items: flex-start; }
  .pf-preview { width: 15rem; }
  .pf-cards-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1rem; }
  .pf-strip { display: grid; grid-template-columns: repeat(5, 1fr); overflow: visible; padding: .5rem; }
  .pf-thumb { flex: none; }
}
.pf-danger-box { display: flex; flex-direction: column; gap: 1rem; }
.pf-trigger-row { display: flex; justify-content: center; }
.pf-dialog {
  background: var(--f-paper); color: var(--f-ink); border: 3px double var(--f-brass); border-radius: 2px;
  box-shadow: inset 0 0 40px rgba(120, 80, 30, .18), 0 10px 24px rgba(0, 0, 0, .3);
  padding: 1.5rem; max-width: 28rem; width: calc(100% - 2rem); gap: 1.25rem;
}
.pf-dlg-head { display: flex; align-items: center; gap: 1rem; text-align: left; }
.pf-dlg-title { font-family: 'Cinzel', Georgia, serif; font-weight: 700; font-size: 1.15rem; letter-spacing: .03em; color: var(--f-ink); }
.pf-dlg-desc { font-size: 15px; color: var(--f-ink2); margin-top: .25rem; }
.pf-dlg-foot { display: flex; flex-direction: row; flex-wrap: wrap; justify-content: flex-end; gap: .5rem; }
.pf-dlg-foot .pf-btn { white-space: nowrap; padding: 0 1rem; flex: 1 1 8rem; }
.pf-static { position: relative; display: flex; flex-direction: column; margin: 0 auto; }
.pf-static-label { font-family: 'Cinzel', Georgia, serif; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--f-rubric); }
.pf-static-wrap { display: flex; flex-direction: column; gap: .5rem; align-items: center; }
.variant-F .pf-dialog .pf-btn { height: 2.5rem; }
@media (prefers-reduced-motion: no-preference) {
  .pf-root .pf-tab { transition: background-color 200ms, color 200ms; }
}
`;

// Fixtures carry only some of the fields the page shows: habitantMe has just the username, and the
// registration date is not in any fixture. Email comes from session, registration_date is added here
// in the shape of the backend's date field.
const ME = { ...habitantMe, email: session.user.email, registration_date: '2026-03-14' };
const TODAY = '2026-11-22';

// Friends and players in the shape of user/me/friend and user/search/ (the fixtures have no friends yet).
const DEMO_FRIENDS = [
  { friend: { username: 'matteo', commonGame: 4, friendship_date: '2026-02-11' } },
  { friend: { username: 'sam', commonGame: 0, friendship_date: '2026-05-02' } },
];
const DEMO_PLAYERS = [
  { player: { username: 'matteo', gameId: 12 } },
  { player: { username: 'sam', gameId: null } },
  { player: { username: 'marco', gameId: null } },
  { player: { username: 'martina', gameId: 7 } },
];
const PLAYERS = [...search['resource-list'], ...DEMO_PLAYERS].map((r) => r.player);
// Same list as CardsPanel.jsx (IMAGE_FILES): the template, the .pdn source and japo_exported are not offered.
const CARD_FILES = ['lupusBack.png', 'fantasy1.png', 'fantasy2.png', 'yugioh.png', 'standard_red.png', 'standard_blue.png', 'standard_blue_white_border.png', 'wooden.png', 'japo_lightblue.png', 'japo_white.png'];
const CARD_FOLDER = '/media/cards/card_back/';
const TAB_VALUES = ['friends', 'cards', 'credentials', 'delete'];

// Same criteria as utils/passwordComplexAndShowPassword.js (the real hint).
const RULES = [
  { label: 'From 8 to 20 characters.', test: (v) => /^.{8,20}$/.test(v) },
  { label: 'An uppercase letter.', test: (v) => /[A-Z]/.test(v) },
  { label: 'A lowercase letter.', test: (v) => /[a-z]/.test(v) },
  { label: 'A number.', test: (v) => /\d/.test(v) },
  { label: 'A symbol (!@#$%^&*).', test: (v) => /[!@#$%^&*]/.test(v) },
];

// Password input with the show/hide eye toggle (the real one is a Font Awesome icon toggling type).
function PasswordField({ id, name, label, children, ...rest }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="pf-field">
      <label htmlFor={id} className="pf-label">{label}</label>
      <div className="pf-pw">
        <input
          id={id}
          name={name}
          type={shown ? 'text' : 'password'}
          className="vf-input pf-input"
          {...rest}
        />
        <button
          type="button"
          aria-label={shown ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          onClick={() => setShown((s) => !s)}
          className="vf-ghost pf-eye"
        >
          {shown ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </button>
      </div>
      {children}
    </div>
  );
}

function ReadOnlyField({ id, label, value }) {
  return (
    <div className="pf-field">
      <label htmlFor={id} className="pf-label">{label}</label>
      <input id={id} type="text" className="vf-input pf-input" value={value} disabled readOnly />
    </div>
  );
}

function FriendsSection() {
  const [list, setList] = useState([...friends['resource-list'], ...DEMO_FRIENDS]);
  const [query, setQuery] = useState('ma');

  const names = list.map((f) => f.friend.username);
  const q = query.trim().toLowerCase();
  const results = q === ''
    ? []
    : PLAYERS.filter((p) => p.username !== ME.username && !names.includes(p.username) && p.username.includes(q));

  const addFriend = (p) => {
    setList((l) => [...l, { friend: { username: p.username, commonGame: 0, friendship_date: TODAY } }]);
    notify('success', 'Friend added', `${p.username} added to your friends`);
  };

  const removeFriend = (username) => {
    setList((l) => l.filter((f) => f.friend.username !== username));
    notify('info', 'Friend deleted', `${username} removed from your friends`);
  };

  const availability = (username) => {
    const gameId = PLAYERS.find((p) => p.username === username)?.gameId ?? null;
    return gameId === null
      ? <span className="pf-free">&#9679; Free</span>
      : <span className="pf-busy">&#9679; In game</span>;
  };

  return (
    <div className="pf-section">
      <h2 className="pf-h2">Add a friend</h2>
      <div className="pf-field">
        <label htmlFor="pf-search" className="pf-label">Search player</label>
        <input
          id="pf-search"
          type="search"
          className="vf-input pf-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a username"
        />
      </div>
      {q !== '' && (
        <ul aria-label="Players found" className="pf-list">
          {results.length === 0 && <li className="pf-empty">No player found.</li>}
          {results.map((p) => (
            <li key={p.username} className="pf-row">
              <UserToken username={p.username} size="sm" />
              <div className="pf-row-grow"><p className="pf-strong">{p.username}</p></div>
              <Button type="button" className={cn(outlineBtn, 'pf-btn-sm')} aria-label={`Add ${p.username} to friends`} onClick={() => addFriend(p)}>
                Add friend
              </Button>
            </li>
          ))}
        </ul>
      )}

      <h2 className="pf-h2 pf-gap">Your Friends</h2>
      {list.length === 0 && <p className="pf-empty">Here you can find your friends.</p>}
      <ul aria-label="Your friends" className="pf-list">
        {list.map(({ friend }) => (
          <li key={friend.username} className="pf-row">
            <UserToken username={friend.username} size="sm" />
            <div className="pf-row-grow">
              <p className="pf-strong">{friend.username}</p>
              <p className="pf-sub">
                {availability(friend.username)} &middot; Games together: {friend.commonGame} &middot; Since {friend.friendship_date}
              </p>
            </div>
            <Button type="button" className={cn(outlineBtn, 'pf-btn-sm')} aria-label={`Remove ${friend.username} from friends`} onClick={() => removeFriend(friend.username)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CardsSection() {
  const [picked, setPicked] = useState(CARD_FILES[0]);
  const label = picked.replace(/\.png$/, '');

  return (
    <div className="pf-section">
      <h2 className="pf-h2">Card back</h2>
      <p className="pf-hint">Choose the back of the cards shown during a game.</p>
      <div className="pf-cards-layout">
        <figure className="flex flex-col items-center gap-3 m-0">
          <div className="pf-preview">
            <img src={CARD_FOLDER + picked} alt={`Preview of ${label}`} />
          </div>
          <figcaption className="pf-caption">{label.replace(/_/g, ' ')}</figcaption>
        </figure>
        <div className="pf-cards-main">
          <div className="pf-strip" role="group" aria-label="Card backs">
            {CARD_FILES.map((file) => {
              const name = file.replace(/\.png$/, '');
              const on = file === picked;
              return (
                <button key={file} type="button" aria-pressed={on} aria-label={name.replace(/_/g, ' ')} className="pf-thumb" onClick={() => setPicked(file)}>
                  <img src={CARD_FOLDER + file} alt="" loading="lazy" />
                  {on && <span className="pf-check"><Check aria-hidden="true" /></span>}
                </button>
              );
            })}
          </div>
          <div className="flex justify-center">
            <Button
              type="button"
              className={cn(primaryBtn, 'pf-btn')}
              onClick={() => notify('success', 'Card backing changed', `Card backing successfully updated to ${label}`)}
            >
              Update the card
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const EMPTY = { currentEmail: '', newEmail: '', oldPassword: '', newPassword: '', confirmPassword: '' };

function CredentialsSection() {
  const [v, setV] = useState(EMPTY);
  const set = (key) => (e) => setV((prev) => ({ ...prev, [key]: e.target.value }));

  // Same rules as checkFormCompletionPut(): emails only, passwords only, or everything filled.
  const ce = v.currentEmail.trim() !== '';
  const ne = v.newEmail.trim() !== '';
  const op = v.oldPassword.trim() !== '';
  const np = v.newPassword.trim() !== '';
  const cp = v.confirmPassword.trim() !== '';
  const enabled = (ce && ne && !op && !np && !cp)
    || (op && np && cp && !ce && !ne)
    || (op && np && cp && ce && ne);

  const submit = (e) => {
    e.preventDefault();
    if (!enabled) return;
    if (np && v.newPassword !== v.confirmPassword) {
      notify('error', 'Passwords do not match', 'Repeat the new password exactly.');
      return;
    }
    notify('success', 'UPDATE DONE:', 'Your credentials have been updated.');
    setV(EMPTY);
  };

  return (
    <form className="pf-section" onSubmit={submit} aria-label="Update credentials">
      <h2 className="pf-h2">Change credentials</h2>
      <p className="pf-hint">Change the e-mail, the password, or both.</p>
      <ReadOnlyField id="pf-name" label="Username" value={ME.username} />
      <hr className="border-t border-dashed" style={{ borderColor: 'var(--f-brass)' }} />
      <div className="pf-field">
        <label htmlFor="currentEmail" className="pf-label">Current E-mail</label>
        <input id="currentEmail" type="email" className="vf-input pf-input" value={v.currentEmail} onChange={set('currentEmail')} autoComplete="email" />
      </div>
      <div className="pf-field">
        <label htmlFor="newEmail" className="pf-label">New E-mail</label>
        <input id="newEmail" type="email" className="vf-input pf-input" value={v.newEmail} onChange={set('newEmail')} autoComplete="email" />
      </div>
      <hr className="border-t border-dashed" style={{ borderColor: 'var(--f-brass)' }} />
      <PasswordField id="oldPassword" name="CurrentPassword" label="Current Password" autoComplete="current-password" value={v.oldPassword} onChange={set('oldPassword')} />
      <PasswordField id="newPassword" name="NewPassword" label="New Password" autoComplete="new-password" value={v.newPassword} onChange={set('newPassword')} aria-describedby="pf-rules">
        {v.newPassword !== '' && (
          <ul id="pf-rules" aria-label="Password requirements" className="pf-rules">
            {RULES.map((rule) => {
              const ok = rule.test(v.newPassword);
              return (
                <li key={rule.label} className="pf-rule" data-ok={ok}>
                  {ok ? <Check aria-hidden="true" /> : <Circle aria-hidden="true" />}
                  <span>{rule.label}{ok && <span className="sr-only"> (met)</span>}</span>
                </li>
              );
            })}
          </ul>
        )}
      </PasswordField>
      <PasswordField id="confirm-password" name="ConfirmPassword" label="Repeat New Password" autoComplete="new-password" value={v.confirmPassword} onChange={set('confirmPassword')} />
      <div className="flex justify-center mt-2">
        <Button type="submit" className={cn(primaryBtn, 'pf-btn pf-btn-block')} disabled={!enabled}>Update Credentials</Button>
      </div>
    </form>
  );
}

// Shared face of the delete confirmation. Title/Desc are the Radix parts in the live dialog, plain tags in the static copy.
function DialogFace({ Title = 'h2', Desc = 'p' }) {
  return (
    <div className="pf-dlg-head">
      <Seal><TriangleAlert className="size-5" aria-hidden="true" /></Seal>
      <div>
        <Title className="pf-dlg-title">Delete your account?</Title>
        <Desc className="pf-dlg-desc">
          This permanently deletes the account {ME.username} and removes it from every friend list. It cannot be undone.
        </Desc>
      </div>
    </div>
  );
}

function DeleteSection() {
  const [password, setPassword] = useState('');
  const enabled = password.trim() !== '';

  const confirm = () => {
    setPassword('');
    notify('success', 'DELETE DONE:', 'Your account has been deleted.');
  };

  return (
    <div className="pf-section pf-danger-box">
      <h2 className="pf-h2">Delete account</h2>
      <p className="pf-hint">Deleting the account is permanent. Enter your password to continue.</p>
      <ReadOnlyField id="nameDelete" label="Username" value={ME.username} />
      <ReadOnlyField id="email" label="E-mail" value={ME.email} />
      <PasswordField id="password" name="password" label="Password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <AlertDialog>
        <div className="pf-trigger-row">
          <AlertDialogTrigger asChild>
            <Button type="button" className={cn(dangerBtn, 'pf-btn')} disabled={!enabled}>Delete Account</Button>
          </AlertDialogTrigger>
        </div>
        <AlertDialogContent className="variant-F pf-dialog">
          <DialogFace Title={AlertDialogTitle} Desc={AlertDialogDescription} />
          <AlertDialogFooter className="pf-dlg-foot">
            <AlertDialogCancel className={cn(outlineBtn, 'pf-btn')}>Cancel</AlertDialogCancel>
            <AlertDialogAction className={cn(dangerBtn, 'pf-btn')} onClick={confirm}>Delete forever</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Same dialog, open and static (the portal of the live dialog cannot be shown in a screenshot without a click).
function StaticDialogPreview() {
  return (
    <div className="pf-static-wrap" aria-hidden="true">
      <span className="pf-static-label">Open state (static copy)</span>
      <div className="variant-F pf-dialog pf-static">
        <DialogFace />
        <div className="pf-dlg-foot">
          <span className={cn(outlineBtn, 'pf-btn inline-flex items-center px-4')}>Cancel</span>
          <span className={cn(dangerBtn, 'pf-btn inline-flex items-center px-4')}>Delete forever</span>
        </div>
      </div>
    </div>
  );
}

// shortcut: custom colour is local only, saving to DB is a TODO (docs/ui-redesign/TODO.md)
function ColourPicker({ colour, onChange }) {
  const current = colour ?? userColor(ME.username);
  const name = USER_COLORS.find((c) => c.hex === current).name;

  return (
    <div className="pf-colour">
      <h2 className="pf-h2">Your colour</h2>
      <ul aria-label="Colours" className="pf-swatches">
        {USER_COLORS.map((c) => {
          const selected = c.hex === current;
          return (
            <li key={c.hex}>
              <button
                type="button"
                aria-label={`Use colour ${c.name}`}
                aria-pressed={selected}
                title={c.name}
                onClick={() => onChange(c.hex)}
                className="pf-swatch"
                style={{ backgroundColor: c.hex }}
              >
                {selected && <Check aria-hidden="true" />}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="pf-colour-actions">
        <button type="button" className="pf-link" onClick={() => onChange(null)}>Reset to default</button>
        <Button type="button" className={cn(primaryBtn, 'pf-btn')} onClick={() => notify('success', 'Colour updated', `Your colour is now ${name}.`)}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default function MockProfileF() {
  const [colour, setColour] = useState(null); // null = hash default
  // ?tab=cards etc. selects the section for screenshots (demo only).
  const [tab, setTab] = useState(() => {
    const t = new URLSearchParams(window.location.search).get('tab');
    return TAB_VALUES.includes(t) ? t : 'friends';
  });

  return (
    <Layout user={session.user.username}>
      <style>{CSS}</style>
      <Toaster />
      <div className="pf-root">
        <PageTitle>Your personal area</PageTitle>

        <Panel className="pf-card">
          <UserToken username={ME.username} custom={colour} size="lg" />
          <div>
            <h2 className="vf-display pf-name">{ME.username}</h2>
            <div className="pf-meta">
              <span><Mail aria-hidden="true" />{ME.email}</span>
              <span><Calendar aria-hidden="true" />Registered on {ME.registration_date}</span>
            </div>
          </div>
          <ColourPicker colour={colour} onChange={setColour} />
        </Panel>

        <Tabs value={tab} onValueChange={setTab} className="gap-0">
          <TabsList className="pf-tablist">
            <TabsTrigger value="friends" className="pf-tab">Friends</TabsTrigger>
            <TabsTrigger value="cards" className="pf-tab">Cards</TabsTrigger>
            <TabsTrigger value="credentials" className="pf-tab">Change Credentials</TabsTrigger>
            <TabsTrigger value="delete" className="pf-tab">Delete Account</TabsTrigger>
          </TabsList>
          <Panel className="mt-4 p-0">
            <TabsContent value="friends" className="m-0 outline-none"><FriendsSection /></TabsContent>
            <TabsContent value="cards" className="m-0 outline-none"><CardsSection /></TabsContent>
            <TabsContent value="credentials" className="m-0 outline-none"><CredentialsSection /></TabsContent>
            <TabsContent value="delete" className="m-0 outline-none"><DeleteSection /></TabsContent>
          </Panel>
        </Tabs>

        <Panel className="flex flex-col items-center gap-3 p-6">
          <StaticDialogPreview />
        </Panel>
      </div>
    </Layout>
  );
}
