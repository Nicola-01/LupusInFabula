function getCardCookie(name)
{
    let cookieArr = document.cookie.split(";");
    for(let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if(name == cookiePair[0].trim())
        {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

function loadImages()
{
    var imagesFolder = "../media/cards/card_back/";
    var imageContainer = document.getElementById("imageContainer");
    var imageFiles = ["fantasy1.png", "fantasy2.png", "yugioh.png", "standard_red.png", "standard_blue.png", "wooden.png", "japo_lightblue.png", "japo_white.png"];
    var selectedBack = getCardCookie("selectedCard");

    imageFiles.forEach(function(imageName)
    {
        var div_img = document.createElement("div");
        div_img.classList.add("col-sm-6");
        div_img.classList.add("col-md-4");
        div_img.classList.add("col-lg-3");

        var img = document.createElement("img");
        img.src = imagesFolder + imageName;
        img.alt = imageName;
        img.classList.add("img-fluid");

        var radioBtn = document.createElement("input");
        radioBtn.type = "radio";
        radioBtn.name = "cardSelection";
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
                img.classList.add('selected-card-cookie');
            }
        }

        div_img.appendChild(img);
        div_img.appendChild(radioBtn);

        var label = document.createElement("label");
        label.textContent = imageName.split('.').slice(0, -1).join('.');
        div_img.appendChild(label);

        imageContainer.appendChild(div_img);
    });

}

document.addEventListener("DOMContentLoaded", loadImages);


document.getElementById("updateCard").addEventListener("click", function(event)
{
    event.preventDefault();

    var selectedCard = document.querySelector('input[name="cardSelection"]:checked').value;

    document.querySelectorAll('.img-fluid').forEach(function(img)
    {
        img.classList.remove('selected-card');
        img.classList.remove('selected-card-cookie');
        if(img.alt === selectedCard)
            img.classList.add('selected-card-cookie');
    });


    document.cookie = "selectedCard=" + selectedCard + ";path=/; max-age=" + (60 * 60 * 24 * 365);  // 1 year
    var msg = "Card backing successfully updated to "+selectedCard.split('.').slice(0, -1).join('.');
    populateInfoMessage("#playerCardsPage #infoMessage", "Card backing changed", msg);
    window.scrollTo({top: 0, behavior: 'smooth'})
});
