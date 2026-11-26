import { Check, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import FriendsPanel from '../components/friend/FriendsPanel.jsx';
import CardsPanel from '../components/user/CardsPanel.jsx';
import UpdateCredentialsPanel from '../components/user/UpdateCredentialsPanel.jsx';
import DeleteAccountPanel from '../components/user/DeleteAccountPanel.jsx';
import { useLoginChecker } from '../utils/session.js';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Panel, PageTitle, USER_COLORS, UserToken, userColor } from '@/components/lupus';
import '../styles/userPage.css';

/* Port of jsp/user/userPage.jsp (route /habitant/me). The tab is the ?page= query parameter, as before. */
const RADIOS = [
    ['friends', 'Friends'],
    ['playerCards', 'Cards'],
    ['changeCredentials', 'Change Credentials'],
    ['deleteAccount', 'Delete Account'],
];
const PAGES = RADIOS.map(([value]) => value);
const withPage = (params, page) => { const next = new URLSearchParams(params); next.set('page', page); return next; };

// shortcut: custom colour is local only, saving to DB is a TODO (docs/ui-redesign/TODO.md)
const COLOUR_KEY = 'lupus-user-colour';

function readStoredColour() {
    const stored = localStorage.getItem(COLOUR_KEY);
    return USER_COLORS.some((c) => c.hex === stored) ? stored : null; // null = hash default
}

/* Profile card: avatar, username and e-mail of the logged user, and the "Your colour" picker. */
function ProfileCard({ user, colour, onPick }) {
    const shown = userColor(user.username, colour);
    const name = USER_COLORS.find((c) => c.hex === shown)?.name;

    return (
        <Panel className="flex flex-wrap items-center gap-5 p-5 sm:p-6">
            <UserToken username={user.username} custom={colour} size="lg" />
            <div className="min-w-0 flex-1">
                <h2 className="m-0 break-all font-lf-title text-2xl font-bold sm:text-3xl">{user.username}</h2>
                <p className="mt-2 flex items-center gap-2 text-[15px] text-lf-ink2">
                    <Mail className="size-4 shrink-0 text-lf-brass" aria-hidden="true" />
                    {user.email}
                </p>
            </div>

            <div className="flex w-full flex-col gap-3 border-t border-dashed border-lf-brass pt-4">
                <h3 className="up-h2">Your colour</h3>
                <p className="up-hint">Shown on your avatar. Current: {name}.</p>
                <ul aria-label="Colours" className="up-swatches">
                    {USER_COLORS.map((c) => {
                        const selected = c.hex === shown;
                        return (
                            <li key={c.hex}>
                                <button type="button" aria-label={`Use colour ${c.name}`} aria-pressed={selected} title={c.name}
                                        onClick={() => onPick(c.hex)} className="up-swatch" style={{ backgroundColor: c.hex }}>
                                    {selected && <Check aria-hidden="true" />}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </Panel>
    );
}

export default function UserPage() {
    const { user, loading } = useLoginChecker();
    const [colour, setColour] = useState(readStoredColour);
    const [params, setParams] = useSearchParams();
    // unknown or missing page -> friends, and the URL is corrected with replace (no history entry)
    const requested = params.get('page');
    const page = PAGES.includes(requested) ? requested : 'friends';

    useEffect(() => {
        if (requested !== page)
            setParams((prev) => withPage(prev, page), { replace: true });
    }, [requested, page, setParams]);

    // tab change: a new history entry, so back and forward switch tabs
    const onTab = (value) => {
        setParams((prev) => withPage(prev, value));
    };

    const pickColour = (hex) => {
        localStorage.setItem(COLOUR_KEY, hex);
        setColour(hex);
    };

    return (
        <div className="user-page lf-page flex min-h-screen flex-col font-lf-body text-lf-ink">
            <Navbar />

            <main className="mx-auto flex w-full max-w-4xl flex-grow flex-col gap-5 px-4 py-6">
                <PageTitle>Your personal area</PageTitle>

                {user && <ProfileCard user={user} colour={colour} onPick={pickColour} />}

                <Tabs value={page} activationMode="manual" onValueChange={onTab} className="gap-0">
                    <TabsList className="!h-auto !w-full grid grid-cols-2 gap-2 bg-transparent p-0 sm:grid-cols-4">
                        {RADIOS.map(([value, label]) => (
                            <TabsTrigger key={value} value={value}
                                         className="!h-11 min-w-0 whitespace-normal rounded-md border-2 border-lf-brass bg-transparent px-2 font-lf-heading text-[0.9rem] font-semibold leading-tight tracking-[.04em] text-lf-ink transition-colors hover:bg-lf-hl data-[state=active]:border-lf-felt data-[state=active]:bg-lf-felt data-[state=active]:text-lf-on-felt motion-reduce:transition-none">
                                {label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <Panel className="p-0">
                    <div id="contentBox">
                        <FriendsPanel show={page === 'friends'} user={user} />
                        <CardsPanel show={page === 'playerCards'} />
                        <UpdateCredentialsPanel show={page === 'changeCredentials'} user={user} loading={loading} />
                        <DeleteAccountPanel show={page === 'deleteAccount'} user={user} loading={loading} />
                    </div>
                </Panel>
            </main>

        </div>
    );
}
