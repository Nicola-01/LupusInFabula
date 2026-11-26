import { useEffect, useState } from 'react';
import { Check, Circle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ornament, Panel } from '@/components/lupus';
import { ShowMessage } from '../components/Messages.jsx';
import backgroundHtml from '../components/login/loginBackground.html?raw';
import { showPassword } from '../utils/passwordComplexAndShowPassword.js';
import { retrieveData, storeData } from '../utils/utils.js';
import '../styles/login.css';

// Same criteria as utils/passwordComplexAndShowPassword.js (criteria), with the same element ids.
const RULES = [
    { id: 'passwordLength', label: 'From 8 to 20 characters.', test: (v) => /^.{8,20}$/.test(v) },
    { id: 'passwordUppercase', label: 'An uppercase letter.', test: (v) => /[A-Z]/.test(v) },
    { id: 'passwordLowercase', label: 'A lowercase letter.', test: (v) => /[a-z]/.test(v) },
    { id: 'passwordNumber', label: 'A number.', test: (v) => /\d/.test(v) },
    { id: 'passwordSymbol', label: 'A symbol (!@#$%^&*).', test: (v) => /[!@#$%^&*]/.test(v) },
];

const notBlank = (value) => value.trim() !== '';

/** Password input with the show/hide eye (Font Awesome icon toggled by showPassword()). */
function PasswordField({ id, name, label, className, children, ...rest }) {
    return (
        <div className={`lf-field ${className ?? ''}`}>
            <label htmlFor={id} className="lf-label">{label}</label>
            <div className="lf-pw">
                <input id={id} name={name} type="password" className="lf-input lf-input-pw" {...rest} />
                <button type="button" id={`${id}_ShowPassword`} aria-label="Show or hide password" className="lf-eye"
                        onClick={() => showPassword(id)} disabled={rest.disabled}>
                    <i id={`${id}_eyeIcon`} className="fas fa-eye" aria-hidden="true" />
                </button>
            </div>
            {children}
        </div>
    );
}

/** Live checklist of the password rules (the criteria ids are kept from the old hint). */
function PasswordRules({ value }) {
    return (
        <ul id="passwordComplex" aria-label="Password requirements" className="lf-rules">
            {RULES.map((rule) => {
                const ok = rule.test(value);
                return (
                    <li key={rule.id} id={rule.id} className="lf-rule" data-ok={ok}>
                        {ok ? <Check aria-hidden="true" /> : <Circle aria-hidden="true" />}
                        <span>{rule.label}{ok && <span className="sr-only"> (met)</span>}</span>
                    </li>
                );
            })}
        </ul>
    );
}

/**
 * Login / signup page (port of jsp/login.jsp + js/login.js). Both /login and /signup render it:
 * the Login tab is opened when the URL ends with /login (unless a saved attempt says otherwise).
 */
export default function Login() {
    useEffect(() => { document.title = 'Lupus in Fabula - Login'; }, []);
    // No Navbar here: RouteEffects (mounted in App) applies the theme on every route change, /login and /signup included.

    // The scene is a srcDoc, so it is built once; its colours follow data-bs-theme (set again by loadTheme()).
    const [background] = useState(() => {
        const theme = document.body.dataset.bsTheme || 'light';
        return backgroundHtml.replace('<html lang="en">', `<html lang="en" data-bs-theme="${theme}">`);
    });

    // Values of the last attempt, kept in a cookie for 15 seconds (saveField / loadSavedValues).
    const [saved] = useState(() => retrieveData('loginOBJ') || {});
    const fromSaved = (type, key) => (saved.type === type ? (saved[key] ?? '') : '');

    // The tab is the URL (/login or /signup): switching tabs is a client-side navigation, the URL stays in sync.
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const tab = pathname.endsWith('/signup') ? 'signup' : 'login';
    const isLogin = tab === 'login';
    // Radix fires onValueChange on both focus and mousedown: skip the repeat, or history gets a duplicate entry.
    const changeTab = (value) => {
        const target = value === 'login' ? '/login' : '/signup';
        if (window.location.pathname === target) return;
        setMessage(null);
        navigate(target);
    };
    const [loginUser, setLoginUser] = useState(() => fromSaved('login', 'user'));
    const [loginPassword, setLoginPassword] = useState(() => fromSaved('login', 'password'));
    const [signUsername, setSignUsername] = useState(() => fromSaved('signup', 'username'));
    const [signEmail, setSignEmail] = useState(() => fromSaved('signup', 'email'));
    const [signPassword, setSignPassword] = useState(() => fromSaved('signup', 'password'));
    const [signPasswordRp, setSignPasswordRp] = useState(() => fromSaved('signup', 'passwordRp'));
    const [message, setMessage] = useState(null);

    const signupFilled = [signUsername, signEmail, signPassword, signPasswordRp].every(notBlank);
    const loginFilled = notBlank(loginUser) && notBlank(loginPassword);

    function saveField() {
        const data = isLogin
            ? { type: 'login', user: loginUser, password: loginPassword }
            : { type: 'signup', username: signUsername, email: signEmail, password: signPassword, passwordRp: signPasswordRp };
        storeData('loginOBJ', data, 15);
    }

    // Same POST as the old forms; success = redirect (followed by fetch), error = Message JSON.
    async function handleSubmit(event) {
        event.preventDefault();
        saveField();
        const response = await fetch(isLogin ? '/login' : '/signup', {
            method: 'POST',
            body: new URLSearchParams(new FormData(event.currentTarget)),
            credentials: 'same-origin',
        });
        if (response.redirected) {
            window.location.href = response.url;
            return;
        }
        const json = await response.json().catch(() => null);
        setMessage({ error: true, message: json?.message?.message });
    }

    return (
        <div className="lf-page lf-login">
            <iframe
                id="background"
                title="background"
                aria-hidden="true"
                tabIndex={-1}
                srcDoc={background}
                className="fixed inset-0 -z-10 h-full w-full border-none"
            />
            <main className="lf-root">
                {/* Mobile title over the scene; the desktop one is inside the card. Only one is displayed. */}
                <h1 className="lf-hero font-lf-title">Lupus in Fabula</h1>

                <Panel className="lf-panel">
                    <header className="lf-head">
                        <h1 className="lf-title font-lf-title">Lupus in Fabula</h1>
                        <Ornament className="lf-orn" />
                    </header>

                    <div className="lf-msg" role="alert">
                        <ShowMessage message={message} />
                    </div>

                    <Tabs value={tab} onValueChange={changeTab} className="lf-tabs">
                        <TabsList className="lf-tablist">
                            <TabsTrigger value="login" className="lf-tab font-lf-heading">Login</TabsTrigger>
                            <TabsTrigger value="signup" className="lf-tab font-lf-heading">Sign up</TabsTrigger>
                        </TabsList>

                        <div className="lf-panes">
                            {/* forceMount keeps both panels in one grid cell (the card keeps the taller height); inert takes the hidden one out of focus and the a11y tree. */}
                            <TabsContent value="login" forceMount inert={!isLogin} className="lf-pane">
                                <form id="login" aria-label="Login" action="/login" method="post" className="lf-form" onSubmit={handleSubmit}>
                                    <div className="lf-field">
                                        <label htmlFor="login_user" className="lf-label">Username/Email</label>
                                        <input id="login_user" name="user" type="text" className="lf-input" required minLength={3}
                                               autoComplete="username"
                                               value={loginUser} onChange={(e) => setLoginUser(e.target.value)} disabled={!isLogin} />
                                    </div>
                                    <PasswordField id="login_password" name="password" label="Password" required minLength={1} maxLength={20}
                                                   autoComplete="current-password"
                                                   value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} disabled={!isLogin} />
                                    <label className="lf-check">
                                        <input type="checkbox" id="keepLogged" name="keepLogged" defaultChecked />
                                        Keep me logged in
                                    </label>
                                    <Button type="submit" variant="felt" size="touch" id="login_submit" className="lf-btn"
                                            disabled={!isLogin || !loginFilled}>Login</Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="signup" forceMount inert={isLogin} className="lf-pane">
                                <form id="signup" aria-label="Sign up" action="/signup" method="post" className="lf-form lf-signup" onSubmit={handleSubmit}>
                                    <div className="lf-field lf-user">
                                        <label htmlFor="sign_username" className="lf-label">Username</label>
                                        <input id="sign_username" name="username" type="text" className="lf-input" required minLength={3} maxLength={20}
                                               autoComplete="username"
                                               value={signUsername} onChange={(e) => setSignUsername(e.target.value)} disabled={isLogin} />
                                    </div>
                                    <div className="lf-field lf-mail">
                                        <label htmlFor="sign_email" className="lf-label">Email</label>
                                        <input id="sign_email" name="email" type="email" className="lf-input" required
                                               autoComplete="email"
                                               value={signEmail} onChange={(e) => setSignEmail(e.target.value)} disabled={isLogin} />
                                    </div>
                                    <PasswordField id="sign_password" name="password" label="Password" required minLength={1} maxLength={20}
                                                   className="lf-pass" autoComplete="new-password" aria-describedby="passwordComplex"
                                                   value={signPassword} onChange={(e) => setSignPassword(e.target.value)} disabled={isLogin} />
                                    <PasswordRules value={signPassword} />
                                    <PasswordField id="sign_password_rp" name="password_rp" label="Repeat password" required maxLength={20}
                                                   className="lf-repeat" autoComplete="new-password"
                                                   value={signPasswordRp} onChange={(e) => setSignPasswordRp(e.target.value)} disabled={isLogin} />
                                    <Button type="submit" variant="felt" size="touch" id="sign_submit" className="lf-btn"
                                            disabled={isLogin || !signupFilled}>Sign up</Button>
                                </form>
                            </TabsContent>
                        </div>
                    </Tabs>
                </Panel>
            </main>
        </div>
    );
}
