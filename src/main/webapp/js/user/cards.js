/**
 * This script manages the cards inside the user's personal area.
 *
 * @author LupusInFabula Group
 * @version 1.0
 * @since 1.0
 */

/**
 * function that loads all the cards to show them in user personal area
 */
function loadImages()
{
    var imagesFolder = "../media/cards/card_back/";
    var imageContainer = document.getElementById("imageContainer");
    var imageFiles = ["lupusBack.png", "fantasy1.png", "fantasy2.png", "yugioh.png", "standard_red.png", "standard_blue.png","standard_blue_white_border.png" ,"wooden.png"];
    var selectedBack = getCookie("selectedCard");

    imageFiles.forEach(function(imageName)
    {
        var div_img = document.createElement("div");
        div_img.classList.add("col-sm-6", "col-md-4", "col-lg-3", "p-2", "d-flex");

        var img = document.createElement("img");
        img.src = imagesFolder + imageName;
        img.alt = imageName;
        img.classList.add("img-fluid", "p-2", "m-auto", "internalCard");

        var radioBtn = document.createElement("input");
        radioBtn.type = "radio";
        radioBtn.name = "cardSelection";
        radioBtn.classList.add("d-none")
        radioBtn.value = imageName;

        img.addEventListener("click", function()
        {
            document.querySelectorAll('.img-fluid').forEach(function(img)
            {
                img.classList.remove('selected-card');
            });

            img.classList.add('selected-card');
            radioBtn.checked = true;
        });

        // if there's already a previously selected card back (cookie is set), apply colored border
        if(selectedBack)
        {
            if(selectedBack === imageName)
            {
                img.classList.add('selected-card');
            }
        }
        else // else, apply colored border to default card
        {
            if(imageName === imageFiles[0])
                img.classList.add('selected-card');
        }

        div_img.appendChild(img);
        div_img.appendChild(radioBtn);


        imageContainer.appendChild(div_img);
    });

}

// when the document is fully loaded, call loadImages()
document.addEventListener("DOMContentLoaded", loadImages);

// when the user wants to update his/her card
document.getElementById("updateCard").addEventListener("click", function(event)
{
    event.preventDefault();

    var selectedCard = document.querySelector('input[name="cardSelection"]:checked').value;

    /* remove comments if you want the following:
        when the user updates the card, all the borders are deleted except for the one that
        was just chosen.
        Use only if there's a distinction between a border for normal cards and a border for the card
        saved in the cookie
     */
    // document.querySelectorAll('.img-fluid').forEach(function(img)
    // {
    //     img.classList.remove('selected-card');
    //     img.classList.remove('selected-card-cookie');
    //     if(img.alt === selectedCard)
    //         img.classList.add('selected-card-cookie');
    // });

    setCookie("selectedCard", selectedCard)
    // Display a success message to the user
    var msg = "Card backing successfully updated to "+selectedCard.split('.').slice(0, -1).join('.');
    populateInfoMessage("#playerCardsPage .infoMessage", "Card backing changed", msg);
    window.scrollTo({top: 0, behavior: 'smooth'})
});
