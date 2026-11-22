import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import FriendsPanel from '../components/friend/FriendsPanel.jsx';
import CardsPanel from '../components/user/CardsPanel.jsx';
import UpdateCredentialsPanel from '../components/user/UpdateCredentialsPanel.jsx';
import DeleteAccountPanel from '../components/user/DeleteAccountPanel.jsx';
import { useLoginChecker } from '../utils/session.js';
import { contextPath } from '../utils/utils.js';
import { CONTAINER } from '../components/user/shared.js';
import '../styles/userPage.css';

/* Port of jsp/user/userPage.jsp (route /habitant/me). The tab is the ?page= query parameter, as before. */
const RADIOS = [
    ['friends', 'Friends'],
    ['playerCards', 'Cards'],
    ['changeCredentials', 'Change Credentials'],
    ['deleteAccount', 'Delete Account'],
];
const PAGES = RADIOS.map(([value]) => value);

export default function UserPage() {
    const { user, loading } = useLoginChecker();
    const [page] = useState(() => new URLSearchParams(window.location.search).get('page'));
    const valid = PAGES.includes(page);

    useEffect(() => {
        // loadPage() default case: unknown or missing page -> ?page=friends
        if (!valid) {
            const url = new URL(location.protocol + '//' + location.host + location.pathname);
            url.searchParams.set('page', 'friends');
            window.location.href = url;
        }
    }, [valid]);

    // radio "change": full page load on the new tab, as before
    const onRadio = (value) => {
        const url = new URL(contextPath + "habitant/me");
        url.searchParams.set('page', value);
        window.location.href = url;
    };

    return (
        <div className="user-page min-h-screen flex flex-col font-['Jost',sans-serif] bg-bg-first-color text-text-color">
            <Navbar />

            <main className={`${CONTAINER} flex-grow`}>
                <h1 className="text-[calc(1.25rem_+_1vw)] font-medium leading-[1.2] mt-0 mb-2">Your personal area</h1>

                <div className="relative flex flex-wrap m-0 mb-2 rounded-[0.6rem] bg-inputs-bg-color box-border p-1 text-[14px]">
                    {RADIOS.map(([value, label]) => (
                        <label key={value} className="flex-[1_1_auto] w-1/2 min-[576px]:w-1/4 p-[0.07em] mb-0 text-center">
                            <input type="radio" name="radio" value={value} checked={page === value}
                                   onChange={() => onRadio(value)} className="peer hidden" />
                            <span className="flex h-full py-2 items-center justify-center rounded-[0.4rem] cursor-pointer bg-navbar-second-bg text-text-color transition-all duration-300 ease-in-out peer-checked:bg-navbar-inverted-bg peer-checked:text-text-color-inverted peer-checked:font-semibold">
                                {label}
                            </span>
                        </label>
                    ))}
                </div>

                <div className="bg-bg-second-color rounded-[.6rem] p-4">
                    <div id="contentBox">
                        <FriendsPanel show={page === 'friends'} />
                        <CardsPanel show={page === 'playerCards'} />
                        <UpdateCredentialsPanel show={page === 'changeCredentials'} user={user} loading={loading} />
                        <DeleteAccountPanel show={page === 'deleteAccount'} user={user} loading={loading} />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
