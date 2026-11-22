import { Minus, Plus } from 'lucide-react';

/*
 * Number stepper with − and + buttons (port of HTML_number_input / .number_container). Buttons are 44px touch targets.
 * Usage: <NumberInput value={n} max={3} label="wolf" onChange={(v) => ...} />
 */
const BUTTON = 'grid size-11 place-items-center rounded-full border-2 border-lf-brass bg-lf-paper text-lf-ink hover:bg-lf-hl disabled:cursor-not-allowed disabled:opacity-40';

export default function NumberInput({ value, max, label = '', onChange }) {
    const name = label ? ` ${label}` : '';
    return (
        <div className="inline-flex items-center gap-1">
            <button type="button" aria-label={`Decrease${name}`} disabled={value <= 0}
                    onClick={() => onChange(value - 1)} className={BUTTON}>
                <Minus className="size-4" aria-hidden="true" />
            </button>
            <output aria-live="polite" className="min-w-8 text-center font-lf-heading font-bold">{value}</output>
            <button type="button" aria-label={`Increase${name}`} disabled={value >= max}
                    onClick={() => onChange(value + 1)} className={BUTTON}>
                <Plus className="size-4" aria-hidden="true" />
            </button>
        </div>
    );
}
