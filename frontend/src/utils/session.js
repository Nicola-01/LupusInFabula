import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Session hooks (replace jsp/utils/loginChecker.jsp and the sessionScope checks).
 * Data comes from GET /api/session: 200 {user:{username,email}, gamemaster} or 401 when logged out.
 * The request is shared by all components of the same page load.
 */

let sessionPromise = null;

/**
 * Fetches the session once per page load. A non-OK answer (401) means "not logged in".
 * A network error (also the request aborted because the page is navigating away) never resolves:
 * treating it as "logged out" made useLoginChecker redirect to /login, overriding the navigation in progress.
 */
export function fetchSession() {
    if (!sessionPromise) {
        sessionPromise = fetch('/api/session', { credentials: 'same-origin' })
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => ({
                user: data?.user ?? null,
                gamemaster: data?.gamemaster ?? '',
            }), () => new Promise(() => {}));
    }
    return sessionPromise;
}

/**
 * Drops the cached session, so the next fetchSession()/useSession() asks the server again
 * (call it after the session changes without a page reload, e.g. the account is deleted).
 */
export function invalidateSession() {
    sessionPromise = null;
}

/**
 * @returns {{user: object|null, gamemaster: string, loading: boolean}}
 */
export function useSession() {
    const [state, setState] = useState({ user: null, gamemaster: '', loading: true });
    useEffect(() => {
        let alive = true;
        fetchSession().then((s) => alive && setState({ ...s, loading: false }));
        return () => { alive = false; };
    }, []);
    return state;
}

/**
 * Same as useSession, but redirects to /login (full page load) when nobody is logged in
 * (jsp/utils/loginChecker.jsp).
 */
export function useLoginChecker() {
    const session = useSession();
    const navigate = useNavigate();
    useEffect(() => {
        if (!session.loading && !session.user)
            navigate("/login");
    }, [session.loading, session.user, navigate]);
    return session;
}
