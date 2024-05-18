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

function loadTheme() {
    const theme = getCookie("theme");

    if (theme === "light" || theme === "dark")
        document.body.setAttribute("data-bs-theme", theme)
    else {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches)
            document.body.setAttribute("data-bs-theme", "dark")
        else
            document.body.setAttribute("data-bs-theme", "light")
    }

    // dynamic -> automatically change the color based on the game phase (night/day)
    // on other pages, it functions like auto mode
    if (theme === "dynamic" && window.location.href.includes("/lupus/village/")) {
        if (document.getElementById("gameStatus").textContent.toLocaleLowerCase().includes("night"))
            document.body.setAttribute("data-bs-theme", "dark")
        else
            document.body.setAttribute("data-bs-theme", "light")
    }

    const elements = document.querySelectorAll("#theme .dropdown-item")
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].getAttribute("theme") === theme)
            elements[i].classList.add("active")
        else
            elements[i].classList.remove("active")
    }
}

// Get all li elements within the ul with id "theam"
const liElements = document.querySelectorAll("#theme a");

// Add click event listener to each li element
liElements.forEach(function (a) {
    a.addEventListener("click", function () {
        // Remove "active" class from all li elements
        liElements.forEach(function (item) {
            item.classList.remove("active");
        });

        // Add "active" class to the clicked li element
        a.classList.add("active");
        document.cookie = "theme=" + a.getAttribute("theme")
        loadTheme()
    });
});