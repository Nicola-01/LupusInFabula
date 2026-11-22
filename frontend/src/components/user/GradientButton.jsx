/*
 * Port of the .gradientButton of css/common.css: gradient frame, dark inner span, and the hover/disabled states.
 */
export default function GradientButton({ id, disabled = false, onClick, children }) {
    return (
        <button type="button" id={id} disabled={disabled} onClick={onClick}
                className="flex items-center justify-center min-w-[140px] max-w-full p-[3px] rounded-lg border-0 text-white text-[18px] leading-none whitespace-nowrap select-none cursor-pointer transition-all duration-300 bg-[linear-gradient(144deg,#AF40FF,#5B42F3_33%,#3f72f1_66%,#00DDEB)] disabled:cursor-not-allowed disabled:bg-none enabled:active:scale-90 [&:enabled:hover>span]:[background:none] [&:disabled>span]:bg-[rgb(162,15,18)]">
            <span className="block w-full h-full px-6 py-4 rounded-md bg-[rgb(5,6,45)] transition duration-300">{children}</span>
        </button>
    );
}
