import { useState } from 'react';
import { Check, Circle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { session } from '@/mocks/fixtures';
import backgroundHtml from '@/components/login/loginBackground.html?raw';
import { Layout, MessageSeal, Ornament, Panel, primaryBtn, useBodyTheme } from '@/mocks/shell/kit/F.jsx';

// Same criteria as utils/passwordComplexAndShowPassword.js (the real hint).
const RULES = [
  { label: 'From 8 to 20 characters.', test: (v) => /^.{8,20}$/.test(v) },
  { label: 'An uppercase letter.', test: (v) => /[A-Z]/.test(v) },
  { label: 'A lowercase letter.', test: (v) => /[a-z]/.test(v) },
  { label: 'A number.', test: (v) => /\d/.test(v) },
  { label: 'A symbol (!@#$%^&*).', test: (v) => /[!@#$%^&*]/.test(v) },
];

// Layout and colours of this mock. Plain CSS on purpose: Tailwind classes that only appear in a
// file created after the dev server started are not generated, so they would render unstyled.
const CSS = `
/* Mobile first: a short title over the campfire scene (top of the viewport), then a compact card. */
.lf-root { width: 100%; max-width: 28rem; margin: 0 auto; }
.lf-hero {
  height: calc(40vh - 140px); min-height: 4.5rem; display: flex; justify-content: center;
  font-size: 1.625rem; line-height: 2rem; text-align: center; color: var(--f-ink);
  text-shadow: 0 0 10px var(--f-paper), 0 0 2px var(--f-paper);
}
.lf-head { display: none; }
.lf-root .lf-panel { padding: 1rem; box-shadow: inset 0 0 40px rgba(120, 80, 30, .18), 0 12px 40px rgba(0, 0, 0, .4); }
.lf-title { font-size: 2.25rem; line-height: 2.5rem; text-align: center; }
.lf-orn { margin: .75rem auto 0; }
.lf-tabs { display: flex; flex-direction: column; gap: 0; }
.lf-tablist { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; width: 100%; height: auto; padding: 0; background: transparent; }
.lf-root .lf-tab {
  height: 2.75rem; background: transparent; color: var(--f-ink); border: 2px solid var(--f-brass); border-radius: 6px;
  font-family: 'Cinzel', Georgia, serif; font-weight: 600; letter-spacing: .04em; font-size: .95rem;
}
.lf-root .lf-tab:hover { background: var(--f-hl); }
.lf-root .lf-tab[data-state="active"] { background: var(--f-felt); color: var(--f-on-felt); border-color: var(--f-felt); }
/* Both panels share one grid cell, so the card keeps the height of the taller one on either tab. */
.lf-panes { display: grid; margin-top: 1rem; }
.lf-pane { grid-area: 1 / 1; display: flex; flex-direction: column; }
.lf-pane[data-state="inactive"] { visibility: hidden; }
.lf-form { flex: 1; display: flex; flex-direction: column; gap: .75rem; }
.lf-field { display: flex; flex-direction: column; gap: .25rem; }
.lf-label { font-family: 'Cinzel', Georgia, serif; font-weight: 600; font-size: .875rem; letter-spacing: .05em; }
.lf-input { height: 2.75rem; width: 100%; padding: 0 .75rem; font-size: 1rem; outline: none; }
.lf-input-pw { padding-right: 2.75rem; }
.lf-pw { position: relative; }
.lf-eye {
  position: absolute; top: 50%; right: .25rem; transform: translateY(-50%); width: 2.25rem; height: 2.25rem;
  display: grid; place-items: center; border-radius: 2px; cursor: pointer;
}
.lf-eye svg, .lf-rule svg { width: 1rem; height: 1rem; flex-shrink: 0; }
.lf-check { display: flex; align-items: center; gap: .5rem; font-size: 15px; min-height: 2rem; }
.lf-check input { width: 1.125rem; height: 1.125rem; accent-color: var(--f-felt); }
/* Submit buttons sit at the bottom of both panels, in the same place. */
.lf-btn { width: 100%; height: 2.75rem; font-size: 1rem; margin-top: auto; }
.lf-alert {
  display: flex; align-items: center; gap: .5rem; padding: .375rem .5rem; border: 1px solid var(--f-wax); border-radius: 2px;
  color: var(--f-rubric); font-weight: 700; font-size: .9375rem; line-height: 1.25rem;
}
.lf-rules {
  list-style: none; margin: 0; padding: .5rem .625rem; border: 1px dashed var(--f-brass); border-radius: 2px;
  display: grid; grid-template-columns: 1fr 1fr; gap: .125rem .5rem; font-size: .8125rem; line-height: 1.25rem; color: var(--f-ink2);
}
.lf-rule { display: flex; align-items: center; gap: .375rem; }
.lf-rule[data-ok="true"] { color: #3f5f3a; font-weight: 700; }
[data-bs-theme="dark"] .lf-root .lf-rule[data-ok="true"] { color: #6fa36f; }
/* Sign up: username and email full width, the two passwords side by side, then the checklist. */
.lf-signup { display: grid; grid-template-columns: 1fr 1fr; column-gap: .75rem; align-content: start; }
.lf-signup > * { grid-column: 1 / -1; }
.lf-signup .lf-pass { grid-column: 1; grid-row: 3; }
.lf-signup .lf-repeat { grid-column: 2; grid-row: 3; }
.lf-signup .lf-rules { grid-row: 4; }
.lf-signup .lf-btn { grid-row: 5; }
@media (min-width: 640px) {
  .lf-root .lf-panel { padding: 2rem; }
}
/* Desktop: wide card with the title inside, the campfire shows below it. */
@media (min-width: 768px) {
  .lf-root { max-width: 40rem; padding-top: 1.5rem; }
  .lf-hero { display: none; }
  .lf-head { display: block; margin-bottom: 1.5rem; }
  .lf-panes { margin-top: 1.5rem; }
  .lf-form { gap: 1rem; }
  .lf-rules { padding: .75rem; gap: .25rem .5rem; font-size: .875rem; }
  .lf-signup { column-gap: 1.25rem; }
  .lf-signup .lf-user { grid-column: 1; grid-row: 1; }
  .lf-signup .lf-mail { grid-column: 2; grid-row: 1; }
  .lf-signup .lf-pass { grid-row: 2; }
  .lf-signup .lf-repeat { grid-row: 2; }
  .lf-signup .lf-rules { grid-row: 3; }
  .lf-signup .lf-btn { grid-row: 4; }
}
/* Firelight from the campfire on the card. */
[data-bs-theme="dark"] .lf-root .lf-panel {
  box-shadow: inset 0 0 40px rgba(120, 80, 30, .18), 0 12px 40px rgba(0, 0, 0, .45), 0 -16px 50px -20px rgba(253, 150, 80, .4), 0 28px 60px -20px rgba(253, 150, 80, .45);
}
@media (prefers-reduced-motion: no-preference) {
  .lf-root .lf-tab { transition: background-color 200ms, color 200ms; }
}
`;

const inputClass = 'vf-input lf-input';

function Field({ id, name, label, type = 'text', className, ...rest }) {
  return (
    <div className={cn('lf-field', className)}>
      <label htmlFor={id} className="lf-label">{label}</label>
      <input id={id} name={name} type={type} className={inputClass} {...rest} />
    </div>
  );
}

// Password input with the show/hide eye button (the real one is a Font Awesome icon toggling type).
function PasswordField({ id, name, label, describedBy, className, children, ...rest }) {
  const [shown, setShown] = useState(false);
  return (
    <div className={cn('lf-field', className)}>
      <label htmlFor={id} className="lf-label">{label}</label>
      <div className="lf-pw">
        <input
          id={id}
          name={name}
          type={shown ? 'text' : 'password'}
          className={cn(inputClass, 'lf-input-pw')}
          aria-describedby={describedBy}
          {...rest}
        />
        <button
          type="button"
          aria-label={shown ? 'Hide password' : 'Show password'}
          onClick={() => setShown((s) => !s)}
          className="vf-ghost lf-eye"
        >
          {shown ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </button>
      </div>
      {children}
    </div>
  );
}

function PasswordRules({ value }) {
  return (
    <ul id="lf-rules" aria-label="Password requirements" className="lf-rules">
      {RULES.map((rule) => {
        const ok = rule.test(value);
        return (
          <li key={rule.label} className="lf-rule" data-ok={ok}>
            {ok ? <Check aria-hidden="true" /> : <Circle aria-hidden="true" />}
            <span>{rule.label}{ok && <span className="sr-only"> (met)</span>}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default function MockLoginF() {
  const [tab, setTab] = useState('login');
  // Demo state: the error is shown on load and cleared when the user edits the login form.
  const [error, setError] = useState(true);
  const [loginUser, setLoginUser] = useState(session.user.username);
  const [loginPassword, setLoginPassword] = useState('');
  const [signPassword, setSignPassword] = useState('lupus24');
  // Same technique as mocks/home/F.jsx: the scene's colours are scoped to [data-bs-theme] on its <html>.
  const theme = useBodyTheme();
  const html = backgroundHtml.replace('<html lang="en">', `<html lang="en" data-bs-theme="${theme}">`);

  return (
    <Layout user={null} transparent>
      <style>{CSS}</style>
      <iframe
        title="background"
        aria-hidden="true"
        tabIndex={-1}
        srcDoc={html}
        className="fixed inset-0 z-[-1] h-full w-full border-none"
      />
      <div className="lf-root">
        {/* Mobile title over the scene; the desktop one is inside the card. Only one is displayed. */}
        <h1 className="vf-display lf-hero">Lupus in Fabula</h1>

        <Panel className="lf-panel">
          <header className="lf-head">
            <h1 className="vf-display lf-title">Lupus in Fabula</h1>
            <Ornament className="lf-orn" />
          </header>

          <Tabs value={tab} onValueChange={setTab} className="lf-tabs">
            <TabsList className="lf-tablist">
              <TabsTrigger value="login" className="lf-tab">Login</TabsTrigger>
              <TabsTrigger value="signup" className="lf-tab">Sign up</TabsTrigger>
            </TabsList>

            <div className="lf-panes">
            {/* forceMount keeps both panels in the grid cell; inert takes the hidden one out of focus and the a11y tree. */}
            <TabsContent value="login" forceMount inert={tab !== 'login'} className="lf-pane">
              <form
                id="login"
                aria-label="Login"
                className="lf-form"
                onSubmit={(e) => { e.preventDefault(); setError(true); }}
              >
                {error && (
                  <p role="alert" className="lf-alert">
                    <MessageSeal kind="error" small />
                    Wrong username or password.
                  </p>
                )}
                <Field
                  id="login_user" name="user" label="Username/Email" required minLength={3}
                  value={loginUser}
                  onChange={(e) => { setLoginUser(e.target.value); setError(false); }}
                />
                <PasswordField
                  id="login_password" name="password" label="Password" required minLength={1} maxLength={20}
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => { setLoginPassword(e.target.value); setError(false); }}
                />
                <label className="lf-check">
                  <input type="checkbox" name="keepLogged" defaultChecked />
                  Keep me logged in
                </label>
                <Button type="submit" className={cn(primaryBtn, 'lf-btn')}>Login</Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" forceMount inert={tab !== 'signup'} className="lf-pane">
              <form id="signup" aria-label="Sign up" className="lf-form lf-signup" onSubmit={(e) => e.preventDefault()}>
                <Field className="lf-user" id="sign_username" name="username" label="Username" required minLength={3} maxLength={20} autoComplete="username" />
                <Field className="lf-mail" id="sign_email" name="email" type="email" label="Email" required autoComplete="email" />
                <PasswordField
                  id="sign_password" name="password" label="Password" required minLength={1} maxLength={20} className="lf-pass"
                  autoComplete="new-password" describedBy="lf-rules"
                  value={signPassword}
                  onChange={(e) => setSignPassword(e.target.value)}
                />
                <PasswordRules value={signPassword} />
                <PasswordField
                  id="sign_password_rp" name="password_rp" label="Repeat password" required maxLength={20}
                  autoComplete="new-password" className="lf-repeat"
                />
                <Button type="submit" className={cn(primaryBtn, 'lf-btn')}>Sign up</Button>
              </form>
            </TabsContent>
            </div>
          </Tabs>
        </Panel>
      </div>
    </Layout>
  );
}
