import { cn } from '@/lib/utils';

// Per-user colours. Each gives >= 4.5:1 with the light text #fbf6ea (checked with the WCAG formula).
export const USER_COLORS = [
  { name: 'Moss', hex: '#3d5a2a' },
  { name: 'Wine', hex: '#7a1f2b' },
  { name: 'Ochre', hex: '#8a5a12' },
  { name: 'Slate', hex: '#3e5870' },
  { name: 'Plum', hex: '#5b3a5e' },
  { name: 'Teal', hex: '#1f5f5b' },
  { name: 'Rust', hex: '#8f4a22' },
  { name: 'Olive', hex: '#5e5a1e' },
  { name: 'Indigo', hex: '#2f3570' },
  { name: 'Sienna', hex: '#7d4330' },
  { name: 'Forest', hex: '#224d2c' },
  { name: 'Burgundy', hex: '#5c1a2a' },
];

// FNV-1a 32-bit over the UTF-16 code units; stable across reloads and browsers.
function hashName(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return h >>> 0;
}

/** Colour hex for a user: `custom` if given, else a stable pick from USER_COLORS by username hash.
 * Checked with node: userColor('matteo') -> '#5c1a2a' (Burgundy), userColor('sam') -> '#2f3570' (Indigo). */
export function userColor(username, custom) {
  return custom || USER_COLORS[hashName(username) % USER_COLORS.length].hex;
}

const TOKEN_SIZES = { sm: 'size-7 text-[11px]', md: 'size-10 text-sm', lg: 'size-20 text-2xl' };

/** Round avatar with 1-2 initials on the user colour, brass ring. */
export function UserToken({ username, custom, size = 'md' }) {
  const initials = (username.match(/[A-Za-z0-9]/g) || ['?']).slice(0, 2).join('').toUpperCase();
  return (
    <span
      role="img"
      aria-label={username}
      title={username}
      className={cn('lf-token text-[#fbf6ea]', TOKEN_SIZES[size])}
      style={{ backgroundColor: userColor(username, custom) }}
    >
      {initials}
    </span>
  );
}
