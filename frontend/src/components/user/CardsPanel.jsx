import { useState } from 'react';
import { InfoMessage } from '../Messages.jsx';
import { getCookie, setCookie } from '../../utils/utils.js';
import { populateInfoMessage } from '../../utils/message.js';
import { ROW } from './shared.js';
import GradientButton from './GradientButton.jsx';

/*
 * Port of jsp/user/cards.jsp + js/user/cards.js ("Cards" tab): choose the card back, saved in the selectedCard cookie.
 */
const IMAGE_FILES = ["lupusBack.png", "fantasy1.png", "fantasy2.png", "yugioh.png", "standard_red.png", "standard_blue.png", "standard_blue_white_border.png", "wooden.png", "japo_lightblue.png", "japo_white.png"];
const IMAGES_FOLDER = "/lupus/media/cards/card_back/";

// css/user/cards.css .selected-card (coloured frame)
const SELECTED = 'border-[3px] border-solid border-transparent [background:linear-gradient(var(--bg-second-color),var(--bg-second-color))_padding-box,linear-gradient(145deg,#e81cff,#40c9ff)_border-box]';

export default function CardsPanel({ show }) {
    // highlighted card: the cookie one, or the first one when no cookie (same as the old loadImages)
    const [highlight, setHighlight] = useState(() => getCookie("selectedCard") || IMAGE_FILES[0]);
    // card picked by a click (the old radio button); null = none picked
    const [picked, setPicked] = useState(null);

    const updateCard = () => {
        // The old code read querySelector(...:checked).value, which throws when no card was clicked: nothing happens.
        if (picked === null) return;
        setCookie("selectedCard", picked);
        populateInfoMessage("#playerCardsPage .infoMessage", "Card backing changed",
            "Card backing successfully updated to " + picked.split('.').slice(0, -1).join('.'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div id="playerCardsPage" className={show ? `${ROW}` : 'hidden'}>
            <InfoMessage />

            <div id="imageContainer" className="flex flex-wrap w-full shrink-0 px-3 m-auto">
                {IMAGE_FILES.map((name) => {
                    const selected = highlight === name;
                    return (
                        <div key={name} className="flex shrink-0 p-2 w-full min-[576px]:w-1/2 min-[768px]:w-1/3 min-[992px]:w-1/4">
                            <img src={IMAGES_FOLDER + name} alt={name}
                                 onClick={() => { setHighlight(name); setPicked(name); }}
                                 className={`m-auto p-2 w-[200px] min-w-[200px] h-[280px] max-w-full rounded-[.6em] ${selected ? SELECTED : ''}`} />
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-center w-full shrink-0 px-3 mt-6 mb-0">
                <GradientButton id="updateCard" onClick={updateCard}>Update the card</GradientButton>
            </div>
        </div>
    );
}
