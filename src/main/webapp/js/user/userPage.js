// Get reference to the div elements containing the JSP includes
const friendsPage = document.getElementById('friendsPage');
const changeCredentialsPage = document.getElementById('changeCredentialsPage');
const deleteAccountPage = document.getElementById('deleteAccountPage');
const playerCardsPage = document.getElementById('playerCardsPage');

// Add event listener to the radio buttons
const radioInputs = document.querySelectorAll('.radio-inputs input[type="radio"]');

loadPage()

/**
 * Loads the page based on the URL parameter 'page'.
 * Hides all pages initially and displays the selected page.
 */
function loadPage() {
    let params = new URLSearchParams(window.location.search);
    const page = params.get('page');

    friendsPage.style.display = 'none';
    changeCredentialsPage.style.display = 'none';
    deleteAccountPage.style.display = 'none';
    playerCardsPage.style.display = 'none';

    switch (page) {
        case 'friends':
            friendsPage.style.display = 'block';
            break;
        case 'changeCredentials':
            changeCredentialsPage.style.display = 'block';
            break;
        case 'deleteAccount':
            deleteAccountPage.style.display = 'block';
            break;
        case 'playerCards':
            playerCardsPage.style.display = 'block';
            break;
        default:
            let url = new URL(location.protocol + '//' + location.host + location.pathname);
            url.searchParams.set('page', 'friends');
            window.location.href = url;
            return;
    }

    // Check the corresponding radio button
    document.querySelector("input[type='radio'][value=" + page + "]").checked = true
}

// Add change event listeners to the radio buttons
radioInputs.forEach(input => {
    input.addEventListener('change', function () {

        let url = new URL(contextPath + "habitant/me");
        url.searchParams.set('page', this.value);
        window.location.href = url;

    });
});

// Reference to the alert placeholders for delete and put actions.
const alertPlaceholderDelete = document.getElementById('liveAlertPlaceholderDelete');
const alertPlaceholderPut = document.getElementById('liveAlertPlaceholderPut');

/**
 * Appends an alert to the specified alert placeholder.
 *
 * @param {string} message - The alert message.
 * @param {string} type - The type of alert (e.g., 'success', 'danger').
 * @param {string} action - The action that triggered the alert (e.g., 'DELETE', 'PUT').
 */
const appendAlert = (message, type, action) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');

    if (action === 'DELETE')
        alertPlaceholderDelete.append(wrapper);
    else if (action === 'PUT')
        alertPlaceholderPut.append(wrapper);
}
