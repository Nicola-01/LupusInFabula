import { useEffect, useState } from 'react';
import Modal from '../../Modal.jsx';
import { contextPath, genericGETRequest, capitalizeFirstLetter, HTTP_STATUS_OK, JSON_resource_list } from '../../../utils/utils.js';

/*
 * "Show Roles" button and the roles-in-game modal of a player (old rolesModal.jsp + gameConf fill of currentGame.js).
 * The configuration is loaded once when the page is shown (GET game/configuration/<id>).
 */
export default function RolesModal({ gameId }) {
    const [open, setOpen] = useState(false);
    // one list of "name (n)" strings per role type: good, evil, victory stealer, neutral
    const [groups, setGroups] = useState({ good: [], evil: [], victoryStealer: [], neutral: [] });

    useEffect(() => {
        genericGETRequest(contextPath + "game/configuration/" + gameId, (req) => {
            if (req.readyState === XMLHttpRequest.DONE && req.status === HTTP_STATUS_OK) {
                const list = JSON.parse(req.responseText)[JSON_resource_list];
                const next = { good: [], evil: [], victoryStealer: [], neutral: [] };
                for (let i = 0; i < list.length; i++) {
                    const role = list[i]['role'];
                    let key;
                    switch (role.type) {
                        case 0: key = 'good'; break;
                        case 1: key = 'evil'; break;
                        case 2: key = 'victoryStealer'; break;
                        case 3: key = 'neutral'; break;
                        default: continue;
                    }
                    let text = capitalizeFirstLetter(role.name);
                    if (role.max_number > 1)
                        text += " (" + role.max_number + ")";
                    next[key].push(text);
                }
                setGroups(next);
            }
        });
    }, [gameId]);

    const groupDivs = [
        ['gameConfEvil', 'evilRoles', groups.evil],
        ['gameConfNeutral', 'neutralRoles', groups.neutral],
        ['gameConfGood', 'goodRoles', groups.good],
        ['gameConfVictoryStealer', 'victoryStealerRoles', groups.victoryStealer],
    ];

    return (
        <>
            <div className="mb-4 flex flex-wrap -mx-3">
                <div className="m-auto flex justify-center">
                    <button id="gameConfBT" type="button" onClick={() => setOpen(true)}>
                        <span className="circle" aria-hidden="true">
                            <span className="icon arrow"></span>
                        </span>
                        <span className="button-text">Show Roles</span>
                    </button>
                </div>
            </div>

            <Modal open={open} onClose={() => setOpen(false)} title="ROLES IN GAME" id="rolesModal" centered footerClassName="justify-center"
                   footer={
                       <button type="button" id="closeRolesModal" className="rounded w-[100px] bg-navbar-inverted-bg hover:bg-navbar-inverted-second-bg px-3 py-1.5 text-white"
                               onClick={() => setOpen(false)}>Close</button>
                   }>
                {groupDivs.map(([id, cls, items]) => (
                    items.length > 0 && (
                        <div key={id} id={id} className={`${cls} mb-1`}>
                            {items.map((t, i) => <span key={i}>{t}<br /></span>)}
                        </div>
                    )
                ))}
            </Modal>
        </>
    );
}
