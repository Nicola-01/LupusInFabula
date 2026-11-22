import { useEffect, useState } from 'react';

/**
 * Session hooks (replace jsp/utils/loginChecker.jsp and the sessionScope checks).
 * Data comes from GET /lupus/api/session: 200 {user:{username,email}, gamemaster} or 401 when logged out.
 * The request is shared by all components of the same page load.
 */

let sessionPromise = null;

/** Fetches the session once per page load. Any failure is treated as "not logged in". */
export function fetchSession() {
    if (!sessionPromise) {
        sessionPromise = fetch('/lupus/api/session', { credentials: 'same-origin' })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null)
            .then((data) => ({
                user: data?.user ?? null,
                gamemaster: data?.gamemaster ?? '',
            }));
    }
    return sessionPromise;
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
 * Same as useSession, but redirects to /lupus/login (full page load) when nobody is logged in
 * (jsp/utils/loginChecker.jsp).
 */
export function useLoginChecker() {
    const session = useSession();
    useEffect(() => {
        if (!session.loading && !session.user)
            window.location.href = window.location.origin + "/lupus/login";
    }, [session.loading, session.user]);
    return session;
}
