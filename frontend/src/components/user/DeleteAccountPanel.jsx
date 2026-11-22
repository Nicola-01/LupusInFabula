import { useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import { ErrorMessage, SuccessMessage } from '../Messages.jsx';
import { contextPath, genericDELETERequest, getMessage, HTTP_STATUS_OK } from '../../utils/utils.js';
import { populateErrorMessage, populateSuccessMessage } from '../../utils/message.js';
import { showPassword } from '../../utils/passwordComplexAndShowPassword.js';
import { errorListOf } from './shared.js';
import { Button, buttonVariants } from '@/components/ui/button';
import { Seal } from '@/components/lupus';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

/*
 * Port of jsp/user/deleteAccount.jsp + js/user/deleteAccount.js ("Delete Account" tab).
 * The DELETE is sent only after the confirmation dialog (Cancel closes it without any request).
 */
export default function DeleteAccountPanel({ show, user, loading }) {
    const [password, setPassword] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);

    const email = user?.email ?? '';
    const enabled = email.trim() !== '' && password.trim() !== '';

    const sendDeleteUpdate = () => {
        const json = {
            userUpdate: {
                // The original reads formData.get('email') from the form, but the #email input is disabled and
                // disabled controls are not in FormData, so it sends null. Kept as is (bug reported).
                oldEmail: null,
                newEmail: '',
                oldPassword: password,
                newPassword: '',
                repeatNewPassword: '',
            },
        };
        genericDELETERequest(contextPath + "user/me", JSON.stringify(json), updateDeleteStatus);
    };

    const updateDeleteStatus = (req) => {
        const message = getMessage(req);
        if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === HTTP_STATUS_OK) {
                populateSuccessMessage("#deleteAccountPage .successMessage", "DELETE DONE:", message.message);
                setPassword(''); // form.reset()
            } else if (message != null) {
                populateErrorMessage("#deleteAccountPage .errorMessage", message.message, message.errorCode, message.errorDetails);
            } else {
                const errors = errorListOf(req);
                if (errors != null)
                    populateErrorMessage("#deleteAccountPage .errorMessage", errors.msgs, errors.errorCodes, errors.errorDetails);
            }
        }
    };

    // Enter asks for the same confirmation as the button (it used to send the DELETE at once).
    const onEnter = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (enabled) setConfirmOpen(true);
        }
    };

    return (
        <div id="deleteAccountPage" className={show ? 'up-section' : 'hidden'}>
            <h2 className="up-h2">Delete account</h2>
            <p className="up-hint">Deleting the account is permanent. Enter your password to continue.</p>
            {user && (
                <>
                    <div id="liveAlertPlaceholderDelete"></div>
                    <SuccessMessage />
                    <ErrorMessage />

                    <form id="deleteForm" className="flex w-full flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="up-field">
                            <label htmlFor="nameDelete" className="up-label">Username</label>
                            <input id="nameDelete" type="text" name="name" className="up-input" value={user.username} disabled readOnly />
                        </div>

                        <div className="up-field">
                            <label htmlFor="email" className="up-label">E-mail</label>
                            <input id="email" type="text" name="email" className="up-input" value={email} disabled readOnly />
                        </div>

                        <div className="up-field">
                            <label htmlFor="password" className="up-label">Password</label>
                            <div className="up-pw">
                                <input type="password" name="password" id="password" className="up-input" autoComplete="current-password"
                                       value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={onEnter} />
                                <button type="button" id="password_ShowPassword" className="up-eye" aria-label="Show password" tabIndex={-1}
                                        onClick={(e) => { e.preventDefault(); showPassword("password"); }}>
                                    <i id="password_eyeIcon" className="fas fa-eye" aria-hidden="true" />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <Button type="button" variant="wax" size="touch" id="deleteButton" disabled={!enabled}
                                    onClick={() => setConfirmOpen(true)} className="min-w-[10rem] max-w-full text-base">
                                Delete Account
                            </Button>
                        </div>
                    </form>

                    <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                        <AlertDialogContent className="up-dialog">
                            <div className="flex items-center gap-4 text-left">
                                <Seal><TriangleAlert className="size-5" aria-hidden="true" /></Seal>
                                <div>
                                    <AlertDialogTitle className="up-dialog-title">Delete your account?</AlertDialogTitle>
                                    <AlertDialogDescription className="up-dialog-desc">
                                        This permanently deletes the account {user.username}. It cannot be undone.
                                    </AlertDialogDescription>
                                </div>
                            </div>
                            <AlertDialogFooter className="up-dialog-foot">
                                <AlertDialogCancel className={buttonVariants({ variant: 'brass' })}>Cancel</AlertDialogCancel>
                                <AlertDialogAction className={buttonVariants({ variant: 'wax' })} onClick={sendDeleteUpdate}>
                                    Delete forever
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )}
            {!user && !loading && <div><strong>NOT LOGGED IN</strong></div>}
        </div>
    );
}
