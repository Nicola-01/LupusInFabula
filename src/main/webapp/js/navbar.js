document.addEventListener('DOMContentLoaded', function () {
    // Add active class based on current URL
    const currentPath = window.location.pathname;

    // Check for Game section paths
    if (currentPath !== "/lupus/habitant/me") {
        const gamePaths = ["/rules", "/newVillage", "/village"];
        document.querySelectorAll('.nav-item .nav-link').forEach(navLink => {
            if (currentPath.includes(navLink.getAttribute('href')))
                navLink.classList.add('active');
            else if (currentPath.includes(gamePaths[0]) || currentPath.includes(gamePaths[1]) || currentPath.includes(gamePaths[2]))
                document.querySelector('.dropdown-toggle').classList.add('active')
        });
    }

    //Buttons theme creation
    const themeButton = document.getElementById('theme-button');
    const logoutLink = document.getElementById('logout');
    const loginLink = document.getElementById('login');
    const menuOpenCheckbox = document.getElementById('menu-open');
    let circlesCreated = false;

    const theme = getCookie("theme");

    themeButton.addEventListener('click', function () {
        if (!circlesCreated) {
            for (let i = 0; i < 4; i++) {
                const newItem = document.createElement('a');
                newItem.classList.add('menu-item', 'menu-item-new');

                switch (i) {
                    case 3:
                        newItem.setAttribute('theme', 'dynamic');
                        newItem.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="15" viewBox="0 0 512 512"  style="vertical-align: unset;"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M448 256c0-106-86-192-192-192V448c106 0 192-86 192-192zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"/></svg>';
                        if (theme === 'dynamic')
                            newItem.classList.add('active');
                        break;
                    case 2:
                        newItem.setAttribute('theme', 'auto');
                        newItem.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="15" viewBox="0 0 384 512" style="vertical-align: unset;"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M221.5 51.7C216.6 39.8 204.9 32 192 32s-24.6 7.8-29.5 19.7l-120 288-40 96c-6.8 16.3 .9 35 17.2 41.8s35-.9 41.8-17.2L93.3 384H290.7l31.8 76.3c6.8 16.3 25.5 24 41.8 17.2s24-25.5 17.2-41.8l-40-96-120-288zM264 320H120l72-172.8L264 320z"/></svg>';
                        if (theme === 'auto')
                            newItem.classList.add('active');
                        break;
                    case 1:
                        newItem.setAttribute('theme', 'light');
                        newItem.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="15" viewBox="0 0 512 512" style="vertical-align: unset;"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"/></svg>';
                        if (theme === 'light')
                            newItem.classList.add('active');
                        break;
                    case 0:
                        newItem.setAttribute('theme', 'dark');
                        newItem.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="15" viewBox="0 0 384 512" style="vertical-align: unset;"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"/></svg>';
                        if (theme === 'dark')
                            newItem.classList.add('active');
                        break;
                }

                if (logoutLink !== null)
                    logoutLink.parentNode.insertBefore(newItem, logoutLink.nextSibling);
                if (loginLink !== null)
                    loginLink.parentNode.insertBefore(newItem, loginLink.nextSibling);
            }

            // Get all anchor elements within the ul with class "menu-item-new"
            const createdThemeElements = document.querySelectorAll(".menu-item-new");

            createdThemeElements.forEach(function (a) {
                a.addEventListener('click', function () {
                    // Remove "active" class from all anchor elements
                    createdThemeElements.forEach(function (item) {
                        item.classList.remove("active");
                    });

                    // Add "active" class to the clicked anchor element
                    a.classList.add("active");

                    // Set the theme cookie based on the clicked anchor element's theme attribute
                    document.cookie = "theme=" + a.getAttribute("theme") + ";path=/;SameSite=Lax;";

                    // Reload the theme
                    loadTheme();
                })
            })

            circlesCreated = true;

        } else {
            const newItems = document.querySelectorAll('.menu-item-new');
            newItems.forEach(item => item.remove());
            circlesCreated = false;
        }
    });

    menuOpenCheckbox.addEventListener('click', function () {
        if (circlesCreated) {
            const newItems = document.querySelectorAll('.menu-item-new');
            newItems.forEach(item => item.remove());
            circlesCreated = false;
        }
    });

});

const responsiveThemeElements = document.querySelectorAll("#theme a");

responsiveThemeElements.forEach(function (a) {

    a.addEventListener('click', function () {
        // Remove "active" class from all anchor elements
        responsiveThemeElements.forEach(function (item) {
            item.classList.remove("active");
        });

        // Add "active" class to the clicked anchor element
        a.classList.add("active");

        // Set the theme cookie based on the clicked anchor element's theme attribute
        setCookie("theme", a.getAttribute("theme"));

        // Reload the theme
        loadTheme();
    })
})

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
}