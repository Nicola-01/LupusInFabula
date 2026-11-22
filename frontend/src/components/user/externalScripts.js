import { useEffect } from 'react';

/*
 * The old JSPs loaded two CDN scripts: sorttable.js (sortable tables, <table class="sortable">) and Chart.js.
 * They are loaded once with a dynamic script tag, same URLs as before.
 */
export const SORTTABLE_URL = 'https://www.kryogenix.org/code/browser/sorttable/sorttable.js';
export const CHART_URL = 'https://cdn.jsdelivr.net/npm/chart.js';

const loaded = new Map();

/** Loads a script once; the promise resolves when the script has run. */
export function loadScript(src) {
    if (!loaded.has(src)) {
        loaded.set(src, new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.async = true;
            s.onload = resolve;
            s.onerror = () => { loaded.delete(src); reject(new Error('Cannot load ' + src)); };
            document.body.appendChild(s);
        }));
    }
    return loaded.get(src);
}

/**
 * Makes the table behind ref sortable by clicking its headers (sorttable.js). Called once per mounted table,
 * because sorttable only scans the document on page load and React renders after that.
 */
export function useSorttable(ref) {
    useEffect(() => {
        let alive = true;
        loadScript(SORTTABLE_URL)
            .then(() => { if (alive && ref.current) window.sorttable?.makeSortable(ref.current); })
            .catch(() => {});
        return () => { alive = false; };
    }, []);
}
