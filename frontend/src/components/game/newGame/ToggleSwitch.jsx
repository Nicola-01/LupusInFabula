import { Switch } from '@/components/ui/switch';

/*
 * On/off switch for the game options (port of HTML_switch / .toggle-switch). Radix Switch: role=switch and keyboard for free.
 * Usage: <ToggleSwitch id="x" checked={on} onChange={(v) => ...} />
 * The data-state variants override the default ui/switch colours (they would win over plain classes).
 */
export default function ToggleSwitch({ checked, onChange, ...rest }) {
    return (
        <Switch
            checked={checked}
            onCheckedChange={onChange}
            className="h-7 w-12 shrink-0 border-2 border-lf-brass data-[state=checked]:border-lf-felt data-[state=checked]:bg-lf-felt data-[state=unchecked]:bg-[#b9a58a] dark:data-[state=unchecked]:bg-[#5c4a36] [&>[data-slot=switch-thumb]]:size-6 [&>[data-slot=switch-thumb]]:bg-lf-paper"
            {...rest}
        />
    );
}
