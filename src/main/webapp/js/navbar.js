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

loadTheme();

/**
 * Loads the selected theme based on the theme cookie or system preference.
 * If the selected theme is "dynamic" and the page is in the village section,
 * it dynamically changes the theme based on the game phase (night/day).
 */
function loadTheme() {
    // Get the theme from the cookie
    const theme = getCookie("theme");

    // Set the theme based on the cookie value or system preference
    if (theme === "light" || theme === "dark")
        document.body.setAttribute("data-bs-theme", theme);
    else {
        // If theme is "dynamic" or invalid, set theme based on system preference
        if (window.matchMedia("(prefers-color-scheme: dark)").matches)
            document.body.setAttribute("data-bs-theme", "dark");
        else
            document.body.setAttribute("data-bs-theme", "light");
    }

    // Dynamically change the theme based on game phase if theme is "dynamic" and page is in village section
    if (theme === "dynamic" && window.location.href.includes("/lupus/village/")) {
        if (document.getElementById("gameStatus").textContent.toLocaleLowerCase().includes("night"))
            document.body.setAttribute("data-bs-theme", "dark");
        else
            document.body.setAttribute("data-bs-theme", "light");
    }

    // Set the "active" class for the selected theme in the theme dropdown menu
    const elements = document.querySelectorAll("#theme .dropdown-item");
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].getAttribute("theme") === theme)
            elements[i].classList.add("active");
        else
            elements[i].classList.remove("active");
    }
}

// Get all anchor elements within the ul with id "theme"
const anchorElements = document.querySelectorAll("#theme a");

// Add click event listener to each anchor element
anchorElements.forEach(function (a) {
    a.addEventListener("click", function () {
        // Remove "active" class from all anchor elements
        anchorElements.forEach(function (item) {
            item.classList.remove("active");
        });

        // Add "active" class to the clicked anchor element
        a.classList.add("active");

        // Set the theme cookie based on the clicked anchor element's theme attribute
        document.cookie = "theme=" + a.getAttribute("theme") + ";path=/;SameSite=Lax;";

        // Reload the theme
        loadTheme();
    });
});
