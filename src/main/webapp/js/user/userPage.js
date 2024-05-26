// Get reference to the div elements containing the JSP includes
const friendsPage = document.getElementById('friendsPage');
const changeCredentialsPage = document.getElementById('changeCredentialsPage');
const deleteAccountPage = document.getElementById('deleteAccountPage');

// Add event listener to the radio buttons
const radioInputs = document.querySelectorAll('.radio-inputs input[type="radio"]');
radioInputs.forEach(input => {
    input.addEventListener('change', function() {
        // Toggle display based on selected radio button
        if (this.value === 'friends') {
            friendsPage.style.display = 'block';
            changeCredentialsPage.style.display = 'none';
            deleteAccountPage.style.display = 'none';
        } else if (this.value === 'changeCredentials') {
            friendsPage.style.display = 'none';
            changeCredentialsPage.style.display = 'block';
            deleteAccountPage.style.display = 'none';
        } else if (this.value === 'deleteAccount') {
            friendsPage.style.display = 'none';
            changeCredentialsPage.style.display = 'none';
            deleteAccountPage.style.display = 'block';
        }
    });
});

const alertPlaceholderDelete = document.getElementById('liveAlertPlaceholderDelete');
const alertPlaceholderPut= document.getElementById('liveAlertPlaceholderPut');

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
