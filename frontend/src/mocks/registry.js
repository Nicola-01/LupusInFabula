// Dev-only mock gallery registry. New mock files at mocks/<screen>/<Variant>.jsx are picked up automatically.
export const screens = ['shell', 'login', 'home', 'game', 'newGame', 'stats', 'profile', 'rules', 'notFound'];
export const variants = ['A', 'B', 'C', 'D', 'E', 'F'];

const all = import.meta.glob('./*/*.jsx');
export const mockLoaders = Object.fromEntries(Object.entries(all).filter(([k]) => !k.includes('/fixtures/')));
export const mockKey = (screen, variant) => `./${screen}/${variant}.jsx`;
