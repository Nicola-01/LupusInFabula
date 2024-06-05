function loadImages()
{
    var imagesFolder = "../media/cards/card_back/";
    var imageContainer = document.getElementById("imageContainer");
    var imageFiles = ["fantasy1.png", "fantasy2.png", "yugioh.png", "standard_red.png", "standard_blue.png","standard_blue_white_border.png" ,"wooden.png", "japo_lightblue.png", "japo_white.png"];
    var selectedBack = getCookie("selectedCard");

    imageFiles.forEach(function(imageName)
    {
        var div_img = document.createElement("div");
        div_img.classList.add("col-sm-6", "col-md-4", "col-lg-3", "p-2", "d-flex");

        var img = document.createElement("img");
        img.src = imagesFolder + imageName;
        img.alt = imageName;
        img.classList.add("img-fluid", "p-1", "m-auto", "internalCard");

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

        // if there's already a selected card back, apply colored border
        if(selectedBack)
        {
            if(selectedBack === imageName)
            {
                img.classList.add('selected-card');
            }
        }
        else
        {
            if(imageName === "fantasy1.png")
                img.classList.add('selected-card');
        }

        div_img.appendChild(img);
        div_img.appendChild(radioBtn);


        imageContainer.appendChild(div_img);
    });

}

document.addEventListener("DOMContentLoaded", loadImages);


document.getElementById("updateCard").addEventListener("click", function(event)
{
    event.preventDefault();

    var selectedCard = document.querySelector('input[name="cardSelection"]:checked').value;

    // document.querySelectorAll('.img-fluid').forEach(function(img)
    // {
    //     img.classList.remove('selected-card');
    //     img.classList.remove('selected-card-cookie');
    //     if(img.alt === selectedCard)
    //         img.classList.add('selected-card-cookie');
    // });

    setCookie("selectedCard", selectedCard)
    var msg = "Card backing successfully updated to "+selectedCard.split('.').slice(0, -1).join('.');
    populateInfoMessage("#playerCardsPage #infoMessage", "Card backing changed", msg);
    window.scrollTo({top: 0, behavior: 'smooth'})
});
