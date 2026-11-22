/*
 * Add-to-game toggle for a friend (port of HTML_add_button / .addCheckbox / .checkbox-label / .addButton).
 * Usage: <AddFriendCheckbox username={name} checked={on} onChange={(v) => ...} />
 */
export default function AddFriendCheckbox({ username, checked, onChange }) {
    const id = `addCheckbox_${username}`;
    return (
        <>
            <input type="checkbox" id={id} name={username} className="sr-only"
                   checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <label htmlFor={id}
                   className={`inline-block w-[30px] h-[30px] rounded-full bg-transparent transition-all duration-300 align-middle m-0 ${checked ? 'rotate-45' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                     className={`w-[30px] h-[30px] cursor-pointer fill-none outline-2 outline-transparent outline-offset-2 ${checked ? 'stroke-red-color' : 'stroke-neutral-color-5'}`}>
                    <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" strokeWidth="1.5"></path>
                    <path d="M8 12H16" strokeWidth="1.5"></path>
                    <path d="M12 16V8" strokeWidth="1.5"></path>
                </svg>
            </label>
        </>
    );
}
