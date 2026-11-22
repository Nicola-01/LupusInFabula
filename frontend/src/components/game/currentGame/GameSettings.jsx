import { useEffect, useState } from 'react';
import Modal from '../../Modal.jsx';
import { contextPath, genericPUTRequest, getMessage, HTTP_STATUS_OK } from '../../../utils/utils.js';
import { populateErrorMessage } from '../../../utils/message.js';

/*
 * Master settings (old gameSettings.js + settings markup of currentGame.jsp / modal.jsp).
 * Errors go to the .errorMessage popup of GameActions (the only one on the master page), as before.
 * gear button, popup with "Skip first day" / "Previous phase" / "End game", confirmation modal, PUT game/update.
 */
const TEXTS = {
    skipDay: "Confirm to skip first Day.",
    previousRound: "Confirm to return to previous phase.",
    endGame: "Confirm to end the game.",
};

export default function GameSettings({ gameId }) {
    const [open, setOpen] = useState(false);
    const [modal, setModal] = useState(null); // {text, value} while the confirmation modal is shown

    // close the popup on any click outside of it (old document click listener)
    useEffect(() => {
        const onDocClick = (event) => {
            if (event.target.id === "gameSettings" || event.target.parentElement?.id === "gameSettings")
                return;
            if (event.target.id === "settingsContainer" || event.target.parentElement?.id === "settingsContainer")
                return;
            setOpen(false);
        };
        document.addEventListener('click', onDocClick);
        return () => document.removeEventListener('click', onDocClick);
    }, []);

    const settingsCallback = (req) => {
        if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === HTTP_STATUS_OK) {
                location.reload();
            } else {
                setOpen(false);
                const msg = getMessage(req);
                populateErrorMessage(".errorMessage", msg.message, msg.errorCode, msg.errorDetails);
            }
        }
    };

    const confirm = () => {
        setModal(null);
        genericPUTRequest(contextPath + "game/update/" + gameId, JSON.stringify({"settings": modal.value}), settingsCallback);
    };

    const choose = (value) => setModal({ text: TEXTS[value] ?? "Not valid value.", value });

    return (
        <>
            <div className="flex w-1/3 shrink-0 justify-center p-0">
                <button id="gameSettings" type="button" className="flex items-center justify-center rounded-full"
                        onClick={() => setOpen((o) => !o)}>
                    <i id="settingsIcon" className="fas fa-cog"></i>
                </button>
                <div id="settingsContainer" className="flex flex-col px-2 py-4" style={{ display: open ? 'flex' : 'none' }}>
                    <button id="skipDayBT" className="gradientButton mb-2" value="skipDay"
                            onClick={(e) => choose(e.currentTarget.value)}>Skip first day
                    </button>
                    <button id="previousRoundBT" className="gradientButton mb-2" value="previousRound"
                            onClick={(e) => choose(e.currentTarget.value)}>Previous phase
                    </button>
                    <button id="endGameBT" className="gradientButton" value="endGame"
                            onClick={(e) => choose(e.currentTarget.value)}>End game
                    </button>
                </div>
            </div>

            <Modal open={modal !== null} onClose={() => setModal(null)} title="Confirmation required"
                   footer={
                       <>
                           <button type="button" id="modalCancel" className="rounded bg-[#6c757d] px-3 py-1.5 text-white"
                                   onClick={() => setModal(null)}>Close</button>
                           <button type="button" id="modalConfirm" className="rounded bg-[#0d6efd] px-3 py-1.5 text-white"
                                   onClick={confirm}>Confirm</button>
                       </>
                   }>
                <div id="modalBodyText">{modal?.text}</div>
            </Modal>
        </>
    );
}
