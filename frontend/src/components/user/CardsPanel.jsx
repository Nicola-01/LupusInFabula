import { useState } from 'react';
import { Check } from 'lucide-react';
import { InfoMessage } from '../Messages.jsx';
import { getCookie, setCookie } from '../../utils/utils.js';
import { populateInfoMessage } from '../../utils/message.js';
import GradientButton from './GradientButton.jsx';

/*
 * Port of jsp/user/cards.jsp + js/user/cards.js ("Cards" tab): choose the card back, saved in the selectedCard cookie.
 * Restyled as the mock F: big preview of the highlighted card and a strip of thumbnails (buttons, not bare images).
 */
const IMAGE_FILES = ["lupusBack.png", "fantasy1.png", "fantasy2.png", "yugioh.png", "standard_red.png", "standard_blue.png", "standard_blue_white_border.png", "wooden.png", "japo_lightblue.png", "japo_white.png"];
const IMAGES_FOLDER = "/media/cards/card_back/";

const nameOf = (file) => file.split('.').slice(0, -1).join('.');
const labelOf = (file) => nameOf(file).replace(/_/g, ' ');

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
            "Card backing successfully updated to " + nameOf(picked));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div id="playerCardsPage" className={show ? 'up-section' : 'hidden'}>
            <h2 className="up-h2">Card back</h2>
            <p className="up-hint">Choose the back of the cards shown during a game.</p>
            <InfoMessage />

            <div className="up-cards-layout">
                <figure className="m-0 flex flex-col items-center gap-3">
                    <div className="up-preview">
                        <img src={IMAGES_FOLDER + highlight} alt={`Preview of ${labelOf(highlight)}`} />
                    </div>
                    <figcaption className="up-caption">{labelOf(highlight)}</figcaption>
                </figure>

                <div className="up-main">
                    <div id="imageContainer" className="up-strip" role="group" aria-label="Card backs">
                        {IMAGE_FILES.map((name) => {
                            const selected = highlight === name;
                            return (
                                <button key={name} type="button" aria-pressed={selected} aria-label={labelOf(name)}
                                        className="up-thumb"
                                        onClick={() => { setHighlight(name); setPicked(name); }}>
                                    <img src={IMAGES_FOLDER + name} alt="" loading="lazy" />
                                    {selected && <span className="up-check"><Check aria-hidden="true" /></span>}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex justify-center">
                        <GradientButton id="updateCard" onClick={updateCard}>Update the card</GradientButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
