import { useEffect, useState } from 'react';
import Fireflies from '../components/Fireflies.jsx';
import { ShowMessage } from '../components/Messages.jsx';
import { passwordComplexHint, showPassword, showPasswordHint } from '../utils/passwordComplexAndShowPassword.js';
import { retrieveData, storeData } from '../utils/utils.js';
import '../styles/login.css';

// Same as the old "control-label" + "custom-input" look: Bootstrap .form-control overridden by custom-input/inputFormAnimations.
const INPUT = 'block w-full h-10 p-2 mx-auto text-[18px] text-[#212529] bg-[#e0dede] border-none outline-none rounded-[5px] focus:bg-white focus:shadow-[0_0_0_.25rem_rgba(13,110,253,.25)] disabled:bg-[#e9ecef] disabled:opacity-100';
const FORM_GROUP = 'relative mb-0';
const EYE_BUTTON = 'absolute top-0 right-0 h-10 w-10 border-0 border-l border-solid border-[#ccc] bg-transparent cursor-pointer';
const SUBMIT = 'block w-full h-10 mx-auto mb-[10px] rounded-[5px] border-none outline-none text-base font-bold text-white bg-[#1F6191] cursor-pointer transition-all duration-200 ease-in hover:bg-[#134569] disabled:bg-[#ade4f8] disabled:text-[#0D324D] disabled:cursor-not-allowed';
const notBlank = (value) => value.trim() !== '';

/**
 * Login / signup page (port of jsp/login.jsp + js/login.js). Both /login and /signup render it:
 * the "login" panel is shown when the URL ends with /login (unless a saved attempt says otherwise).
 */
export default function Login() {
    useEffect(() => { document.title = 'Lupus in Fabula - Login'; }, []);

    // Values of the last attempt, kept in a cookie for 15 seconds (saveField / loadSavedValues).
    const [saved] = useState(() => retrieveData('loginOBJ') || {});
    const fromSaved = (type, key) => (saved.type === type ? (saved[key] ?? '') : '');

    const [isLogin, setIsLogin] = useState(() => (saved.type ? saved.type === 'login' : window.location.href.endsWith('/login')));
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
        const response = await fetch(isLogin ? '/lupus/login' : '/lupus/signup', {
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
        <div data-bs-theme="light" className="lupus-login min-h-screen flex items-center justify-center font-['Jost',sans-serif] bg-[url('/lupus/media/forest_background.png')] bg-center bg-cover">
            <main className="w-full mb-8 p-0 min-[576px]:max-w-[540px] min-[768px]:max-w-[720px] min-[992px]:max-w-[960px] min-[1200px]:max-w-[1140px]">
                <Fireflies count={25} />

                <div id="loginSignup" className="m-auto w-full max-w-[700px]">
                    <ShowMessage message={message} />
                    <div className="main relative h-[500px] overflow-hidden bg-[#0D324D] rounded-[10px] shadow-[5px_20px_50px_#000]">
                        <input type="checkbox" id="loginCB" className="hidden" aria-hidden="true"
                               checked={isLogin} onChange={(e) => setIsLogin(e.target.checked)} />

                        <div className="signup relative w-full h-full">
                            <form id="signup" onSubmit={handleSubmit}>
                                <label className="lb_signup" htmlFor="loginCB" aria-hidden="true">Sign up</label>
                                <div className="inputs w-full max-w-[350px] my-0 mx-auto px-2">
                                    <div className={FORM_GROUP}>
                                        <input type="text" id="sign_username" name="username" className={`${INPUT} mt-[1.3em] mb-[1.3em]`}
                                               placeholder="" minLength={3} maxLength={20} required
                                               value={signUsername} onChange={(e) => setSignUsername(e.target.value)}
                                               disabled={isLogin} />
                                        <label className="control-label">Username</label>
                                    </div>
                                    <div className={FORM_GROUP}>
                                        <input type="email" id="sign_email" name="email" className={`${INPUT} mt-[1.3em] mb-[1.3em]`}
                                               placeholder="" required
                                               value={signEmail} onChange={(e) => setSignEmail(e.target.value)}
                                               disabled={isLogin} />
                                        <label className="control-label">Email</label>
                                    </div>
                                    <div id="passwordComplex" className="hidden absolute w-full max-w-[calc(350px_-_1rem)] -translate-y-[115%] p-2 px-3 rounded-[.6em] bg-[#ade4f8] text-[#0D324D]">
                                        The password must contain:
                                        <ul className="m-0 list-disc pl-8">
                                            <li id="passwordLength" className="text-red-600">From 8 to 20 characters.</li>
                                            <li id="passwordUppercase" className="text-red-600">An uppercase letter.</li>
                                            <li id="passwordLowercase" className="text-red-600">A lowercase letter.</li>
                                            <li id="passwordNumber" className="text-red-600">A number.</li>
                                            <li id="passwordSymbol" className="text-red-600">A symbol (!@#$%^&amp;*)</li>
                                        </ul>
                                    </div>
                                    <div className={FORM_GROUP}>
                                        <input type="password" id="sign_password" name="password" className={`${INPUT} mt-[1.3em] mb-[1.3em]`}
                                               placeholder="" maxLength={20} minLength={1} required
                                               value={signPassword}
                                               onChange={(e) => { setSignPassword(e.target.value); passwordComplexHint(e.target.value); }}
                                               onFocus={() => showPasswordHint(true)}
                                               onBlur={() => showPasswordHint(false)}
                                               disabled={isLogin} />
                                        <button type="button" id="sign_password_ShowPassword" className={EYE_BUTTON} tabIndex={-1}
                                                onClick={() => showPassword('sign_password')} disabled={isLogin}>
                                            <i id="sign_password_eyeIcon" className="fas fa-eye" />
                                        </button>
                                        <label className="control-label">Password</label>
                                    </div>
                                    <div className={FORM_GROUP}>
                                        <input type="password" id="sign_password_rp" name="password_rp" className={`${INPUT} mt-[1.3em] mb-1`}
                                               placeholder="" maxLength={20} required
                                               value={signPasswordRp} onChange={(e) => setSignPasswordRp(e.target.value)}
                                               disabled={isLogin} />
                                        <button type="button" id="sign_password_rp_ShowPassword" className={EYE_BUTTON} tabIndex={-1}
                                                onClick={() => showPassword('sign_password_rp')} disabled={isLogin}>
                                            <i id="sign_password_rp_eyeIcon" className="fas fa-eye" />
                                        </button>
                                        <label className="control-label">Repeat password</label>
                                    </div>

                                    {/* tabIndex -1: otherwise Tab scrolls the page down (as in the JSP). */}
                                    <input type="submit" id="sign_submit" className={`${SUBMIT} mt-6`} value="Sign up" tabIndex={-1}
                                           disabled={!signupFilled} />
                                </div>
                            </form>
                        </div>

                        <div className="login">
                            <form id="login" onSubmit={handleSubmit}>
                                <label className="lb_login" htmlFor="loginCB" aria-hidden="true">Login</label>
                                <div className="inputs w-full max-w-[350px] my-0 mx-auto px-2">
                                    <div className={FORM_GROUP}>
                                        <input type="text" id="login_user" name="user" className={`${INPUT} mt-12 mb-[1.3em]`}
                                               placeholder="" required minLength={3}
                                               value={loginUser} onChange={(e) => setLoginUser(e.target.value)}
                                               disabled={!isLogin} />
                                        <label className="control-label">Username/Email</label>
                                    </div>
                                    <div className={FORM_GROUP}>
                                        <input type="password" id="login_password" name="password" className={`${INPUT} mt-[1.3em] mb-1`}
                                               placeholder="" maxLength={20} minLength={1} required
                                               value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                                               disabled={!isLogin} />
                                        <button type="button" id="login_password_ShowPassword" className={EYE_BUTTON} tabIndex={-1}
                                                onClick={() => showPassword('login_password')} disabled={!isLogin}>
                                            <i id="login_password_eyeIcon" className="fas fa-eye" />
                                        </button>
                                        <label className="control-label">Password</label>
                                    </div>
                                    <div className="checkbox-wrapper my-2">
                                        <input type="checkbox" id="keepLogged" className="inp-cbx" name="keepLogged" defaultChecked />
                                        <label className="cbx" htmlFor="keepLogged">
                                            <span>
                                                <svg width="12px" height="10px">
                                                    <use href="#check-4" />
                                                </svg>
                                            </span>
                                            <span>Keep me logged in</span>
                                        </label>
                                        <svg className="inline-svg">
                                            <symbol id="check-4" viewBox="0 0 12 10">
                                                <polyline points="1.5 6 4.5 9 10.5 1" />
                                            </symbol>
                                        </svg>
                                    </div>
                                    <input type="submit" id="login_submit" className={`${SUBMIT} mt-4`} value="Login"
                                           disabled={!isLogin || !loginFilled} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
