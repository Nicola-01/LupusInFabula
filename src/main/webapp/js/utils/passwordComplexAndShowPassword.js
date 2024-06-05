/**
 * It includes functions for handling password visibility and complexity hints.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */

/**
 * Shows or hides the password complexity hint.
 *
 * @param {boolean} toShow - If true, shows the hint; otherwise, hides it.
 */
function showPasswordHint(toShow){
    const passwordComplex = document.getElementById("passwordComplex");
    if (toShow)
        passwordComplex.classList.remove("d-none");
    else
        passwordComplex.classList.add("d-none");
}

/**
 * An object that defines the criteria for password complexity.
 *
 * @property {RegExp} passwordLength - A regular expression that checks if the password length is between 8 and 20 characters.
 * @property {RegExp} passwordUppercase - A regular expression that checks if the password contains at least one uppercase letter.
 * @property {RegExp} passwordLowercase - A regular expression that checks if the password contains at least one lowercase letter.
 * @property {RegExp} passwordNumber - A regular expression that checks if the password contains at least one number.
 * @property {RegExp} passwordSymbol - A regular expression that checks if the password contains at least one of the specified symbols (!@#$%^&*).
 */
const criteria = {
    passwordLength: /^.{8,20}$/,
    passwordUppercase: /[A-Z]/,
    passwordLowercase: /[a-z]/,
    passwordNumber: /\d/,
    passwordSymbol: /[!@#$%^&*]/
};

/**
 * Shows hints for password complexity based on the given password.
 *
 * @param {string} password - The password to check.
 */
function passwordComplexHint(password) {

    for (let criterion in criteria) {
        const element = document.getElementById(criterion);
        if (criteria[criterion].test(password)) {
            element.classList.remove('invalid');
            element.classList.add('valid');
        } else {
            element.classList.remove('valid');
            element.classList.add('invalid');
        }
    }
}

/**
 * Toggles the visibility of the password in the input field.
 *
 * @param {string} idInput - The ID of the input field.
 */
function showPassword(idInput) {
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