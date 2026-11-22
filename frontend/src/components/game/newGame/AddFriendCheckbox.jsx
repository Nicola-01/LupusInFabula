import { Check } from 'lucide-react';

/*
 * Friend row checkbox: the name is the label (port of HTML_add_button / .addCheckbox). Id and name kept: addCheckbox_<username>.
 * Usage: <AddFriendCheckbox username={name} checked={on} onChange={(v) => ...} />
 */
export default function AddFriendCheckbox({ username, checked, onChange }) {
    const id = `addCheckbox_${username}`;
    return (
        <label htmlFor={id} className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center gap-3 text-[16px]">
            <input type="checkbox" id={id} name={username} className="peer sr-only"
                   checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <span aria-hidden="true"
                  className="grid size-6 shrink-0 place-items-center rounded border-2 border-lf-brass bg-lf-paper text-lf-on-felt peer-checked:border-lf-felt peer-checked:bg-lf-felt peer-focus-visible:ring-2 peer-focus-visible:ring-lf-focus">
                {checked && <Check className="size-4" />}
            </span>
            <span className="min-w-0 truncate">{username}</span>
        </label>
    );
}
