// Get reference to the div elements containing the JSP includes
const friendsPage = document.getElementById('friendsPage');
const changeCredentialsPage = document.getElementById('changeCredentialsPage');
const deleteAccountPage = document.getElementById('deleteAccountPage');
const playerCardsPage = document.getElementById('playerCardsPage');

// Add event listener to the radio buttons
const radioInputs = document.querySelectorAll('.radio-inputs input[type="radio"]');

radioInputs.forEach(input => {
    input.addEventListener('change', function () {
        // Toggle display based on selected radio button
        friendsPage.style.display = 'none';
        changeCredentialsPage.style.display = 'none';
        deleteAccountPage.style.display = 'none';
        playerCardsPage.style.display = 'none';

        switch (this.value) {
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
        }

    });
});

const alertPlaceholderDelete = document.getElementById('liveAlertPlaceholderDelete');
const alertPlaceholderPut = document.getElementById('liveAlertPlaceholderPut');

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
