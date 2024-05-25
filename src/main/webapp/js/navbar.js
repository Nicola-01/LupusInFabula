document.addEventListener('DOMContentLoaded', function () {
    // Add active class based on current URL
    const currentPath = window.location.pathname;

    // Check for Game section paths
    if (currentPath === "/lupus/habitant/me") {
        return; // nothing to set active
    }
    const gamePaths = ["/rules", "/newVillage", "/village"];
    document.querySelectorAll('.nav-item .nav-link').forEach(navLink => {
        if (currentPath.includes(navLink.getAttribute('href')))
            navLink.classList.add('active');
        else if (currentPath.includes(gamePaths[0]) || currentPath.includes(gamePaths[1]) || currentPath.includes(gamePaths[2]))
            document.querySelector('.dropdown-toggle').classList.add('active')
    });
});


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

    let themeToSet

    // Set the theme based on the cookie value or system preference
    if (theme === "light" || theme === "dark")
        themeToSet = theme;
    else {
        // If theme is "dynamic" or invalid, set theme based on system preference
        if (window.matchMedia("(prefers-color-scheme: dark)").matches)
            themeToSet = "dark";
        else
            themeToSet = "light";
    }

    // Dynamically change the theme based on game phase if theme is "dynamic" and page is in village section
    if (theme === "dynamic" && window.location.href.includes("/lupus/village/") && document.getElementById("gameStatus") !== null) {
        if (document.getElementById("gameStatus").textContent.toLocaleLowerCase().includes("night"))
            themeToSet = "dark";
        else
            themeToSet = "light";
    }

    document.body.setAttribute("data-bs-theme", themeToSet);

    const iframe = document.getElementById('background');
    if (iframe) {
        const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        innerDoc.body.setAttribute("data-bs-theme", themeToSet);

        iframe.onload = function () {
            const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (innerDoc) innerDoc.body.setAttribute("data-bs-theme", themeToSet);
        };
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