/**
 * Password hint and show/hide helpers (port of js/utils/passwordComplexAndShowPassword.js).
 * They work on the elements rendered by the pages (ids: passwordComplex, passwordLength, passwordUppercase,
 * passwordLowercase, passwordNumber, passwordSymbol, and "<inputId>" / "<inputId>_eyeIcon").
 * The hint box is hidden with the Tailwind class "hidden"; criteria get Tailwind classes (see VALID_CLASSES).
 */

// Tailwind classes of a satisfied (valid) / unsatisfied (invalid) criterion.
const VALID_CLASSES = ['line-through', 'text-green-600'];
const INVALID_CLASSES = ['text-red-600'];

/**
 * Shows or hides the password complexity hint.
 *
 * @param {boolean} toShow - true shows the hint, false hides it.
 */
export function showPasswordHint(toShow) {
    const passwordComplex = document.getElementById("passwordComplex");
    if (toShow)
        passwordComplex.classList.remove("hidden");
    else
        passwordComplex.classList.add("hidden");
}

/**
 * Password complexity criteria.
 * passwordLength: 8-20 chars; uppercase; lowercase; number; symbol (!@#$%^&*).
 */
export const criteria = {
    passwordLength: /^.{8,20}$/,
    passwordUppercase: /[A-Z]/,
    passwordLowercase: /[a-z]/,
    passwordNumber: /\d/,
    passwordSymbol: /[!@#$%^&*]/
};

/**
 * Marks each criterion element valid/invalid for the given password.
 *
 * @param {string} password - The password to check.
 */
export function passwordComplexHint(password) {
    for (let criterion in criteria) {
        const element = document.getElementById(criterion);
        if (criteria[criterion].test(password)) {
            element.classList.remove(...INVALID_CLASSES);
            element.classList.add(...VALID_CLASSES);
        } else {
            element.classList.remove(...VALID_CLASSES);
            element.classList.add(...INVALID_CLASSES);
        }
    }
}

/**
 * Toggles the visibility of the password in an input field.
 *
 * @param {string} idInput - The id of the input field.
 */
export function showPassword(idInput) {
    const input = document.getElementById(idInput)
    const eyeIcon = document.getElementById(idInput + "_eyeIcon");

    if (eyeIcon.classList.contains("fa-eye")) {
        input.type = "text";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    }
}
