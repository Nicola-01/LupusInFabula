/** Page footer (variant F, same brown striped bar as the navbar). Usage: <Footer /> at the end of a page. */
export default function Footer() {
    return (
        <footer className="lf-nav relative z-10 mt-8 !shadow-none border-t-2 border-lf-nav-brass px-4 py-4 text-center font-lf-heading text-xs tracking-[.12em] [font-variant-caps:small-caps]">
            <span aria-hidden="true" className="mr-2 text-lf-nav-brass">✦</span>
            © 2024 Team LIF · Lupus in Fabula · All rights reserved · {window.__ENV__?.version ?? 'dev'}
            <span aria-hidden="true" className="ml-2 text-lf-nav-brass">✦</span>
        </footer>
    );
}
