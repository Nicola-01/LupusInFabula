import { cn } from '@/lib/utils';

// Font Awesome 5.8.1 (free, global CDN in index.html) icon per role. Names match the `roles` fixture.
export const ROLE_ICONS = {
  farmer: 'fa-seedling', seer: 'fa-eye', knight: 'fa-chess-knight', sheriff: 'fa-star', carpenter: 'fa-hammer',
  hobbit: 'fa-ring', kamikaze: 'fa-bomb', mason: 'fa-hard-hat', medium: 'fa-ghost', sam: 'fa-user-shield',
  wolf: 'fa-moon', berserker: 'fa-fist-raised', dorky: 'fa-dizzy', explorer: 'fa-compass', giuda: 'fa-coins',
  puppy: 'fa-dog', illusionist: 'fa-magic', 'plague spreader': 'fa-biohazard', hamster: 'fa-cheese', jester: 'fa-laugh-squint',
};

/** Role icon: `<i>` with the role's FA class. Unknown role -> fa-question. */
export function RoleIcon({ role, className = '' }) {
  return <i className={cn('fas', ROLE_ICONS[role] ?? 'fa-question', className)} aria-hidden="true" />;
}
