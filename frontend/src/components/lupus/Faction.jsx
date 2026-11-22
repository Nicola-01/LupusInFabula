import { cn } from '@/lib/utils';

// `type` is the numeric role type of the `roles` fixture and API (0 good, 1 evil, 2 victory stealer, 3 neutral).
// Colours are the --lf-faction-* tokens (index.css); icons are Font Awesome 5.8.1.
export const FACTIONS = [
  { id: 'good', type: 0, label: 'Good', icon: 'fa-shield-alt', color: 'var(--lf-faction-good)', ink: 'var(--lf-faction-good-ink)' },
  { id: 'evil', type: 1, label: 'Evil', icon: 'fa-paw', color: 'var(--lf-faction-evil)', ink: 'var(--lf-faction-evil-ink)' },
  { id: 'stealer', type: 2, label: 'Victory stealer', icon: 'fa-user-secret', color: 'var(--lf-faction-stealer)', ink: 'var(--lf-faction-stealer-ink)' },
  { id: 'neutral', type: 3, label: 'Neutral', icon: 'fa-theater-masks', color: 'var(--lf-faction-neutral)', ink: 'var(--lf-faction-neutral-ink)' },
];

/** Faction metadata from the numeric role type, or undefined for unknown types. */
export function factionFromType(type) {
  return FACTIONS.find((f) => f.type === type);
}

/** Faction chip: icon + label on the faction colour. `faction` = id ('good' | 'evil' | 'stealer' | 'neutral'). */
export function FactionBadge({ faction, className = '' }) {
  const f = FACTIONS.find((x) => x.id === faction);
  if (!f) return null;
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', className)}
      style={{ backgroundColor: f.color, color: f.ink }}
    >
      <i className={cn('fas', f.icon)} aria-hidden="true" />
      {f.label}
    </span>
  );
}
