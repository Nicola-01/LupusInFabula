/*
 * On/off switch (port of HTML_switch / .toggle-switch in js/game/createNewGame.js + createNewGame.css).
 * Usage: <ToggleSwitch checked={on} onChange={(v) => ...} />
 */
export default function ToggleSwitch({ checked, onChange }) {
    return (
        <label className="relative inline-block w-[60px] min-w-[60px] h-[30px] cursor-pointer ml-auto mb-0">
            <input type="checkbox" className="hidden" checked={checked}
                   onChange={(e) => onChange(e.target.checked)} />
            <div className={`absolute top-0 left-0 w-full h-full rounded-[20px] transition-colors duration-300 ease-in-out ${checked ? 'bg-navbar-second-bg' : 'bg-[#aaa]'}`}>
                <div className={`absolute top-[5px] left-[5px] w-5 h-5 rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-in-out ${checked ? 'translate-x-[30px]' : ''}`} />
            </div>
        </label>
    );
}
