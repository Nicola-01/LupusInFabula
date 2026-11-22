/*
 * Number selector with - and + buttons, shown on hover (port of HTML_number_input / .number_container).
 * Usage: <NumberInput value={n} max={3} onChange={(v) => ...} />
 */
export default function NumberInput({ value, max, onChange }) {
    const minusDisabled = value === 0;
    const plusDisabled = value === max;
    const symbolBorder = (disabled) => (disabled ? 'border-[#888]' : 'border-[#dbdbdb]');

    return (
        <div className={`group relative w-[60px] h-[30px] rounded-[40px] transition duration-500 ml-auto ${value > 0 ? 'bg-navbar-second-bg' : 'bg-[#aaa]'}`}>
            <div className="minus absolute z-[1] left-[10px] group-hover:left-0 w-[30px] h-[30px] cursor-pointer hidden group-hover:block transition duration-500"
                 onClick={() => { if (value > 0) onChange(value - 1); }}>
                <span className={`block absolute top-1/2 left-[10px] w-3 h-3 border-t-2 border-l-2 border-solid ${symbolBorder(minusDisabled)} -translate-y-1/2 rotate-[315deg]`} />
            </div>
            <div className="plus absolute z-[1] right-[10px] group-hover:right-0 w-[30px] h-[30px] cursor-pointer hidden group-hover:block transition duration-500"
                 onClick={() => { if (value < max) onChange(value + 1); }}>
                <span className={`block absolute top-1/2 right-[10px] w-3 h-3 border-t-2 border-l-2 border-solid ${symbolBorder(plusDisabled)} -translate-y-1/2 rotate-[135deg]`} />
            </div>
            <div className="absolute inset-0">
                <span className={`absolute block w-full h-full text-center leading-[30px] select-none transition duration-500 ${value > 0 ? 'text-white font-bold' : '!text-[#555]'}`}>
                    {value}
                </span>
            </div>
        </div>
    );
}
