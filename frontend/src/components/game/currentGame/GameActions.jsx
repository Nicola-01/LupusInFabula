import { sendActions } from './gameActions.js';
import { ErrorMessage, WarningMessage } from '../../Messages.jsx';

/*
 * Master's action form (old gameActions.jsp). The form content (#gameActions) and the button state are
 * built by the engine (gameActions.js); this component only renders the containers and the popups.
 */
export default function GameActions() {
    return (
        <>
            <div className="flex flex-wrap -mx-3">
                <div className="m-auto w-full p-2 min-[992px]:w-11/12 min-[1200px]:w-5/6">
                    <h2 className="mt-0 mb-2 text-[calc(1.3rem+.6vw)] font-medium leading-[1.2]">HABITANTS ACTIONS</h2>
                    <div id="gameActions"></div>
                </div>
            </div>

            <WarningMessage />
            <ErrorMessage />

            <div className="button-container">
                <button id="sendActions" type="button" className="gradientButton" style={{ display: 'none' }}
                        onClick={() => sendActions()}>
                    <span className="text" id="textActionsBt"></span>
                </button>
            </div>
        </>
    );
}
