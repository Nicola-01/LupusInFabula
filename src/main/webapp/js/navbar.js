const profile = document.querySelectorAll('.profile');
const dropdown = document.querySelector('.dropdown__wrapper');

profile.forEach((element) => {
    element.addEventListener('click', toggleDropdown);
});

function toggleDropdown() {
    dropdown.classList.remove('none');
    dropdown.classList.toggle('hide');
}

document.addEventListener("click", (event) => {
    const isClickInsideDropdown = dropdown.contains(event.target);
    const isProfileClicked = Array.from(profile).some((element) => element.contains(event.target));

    if (!isClickInsideDropdown && !isProfileClicked) {
        dropdown.classList.add('hide');
        dropdown.classList.add('dropdown__wrapper--fade-in');
    }
});