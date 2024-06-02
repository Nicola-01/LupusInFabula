

function loadImages()
{
    var imagesFolder = "../lupus/media/cards/card_back/";

    var imageContainer = document.getElementById("imageContainer");
    var selectionFieldset = document.getElementById("selectionFieldset");

    var imageFiles = ["fantasy1.png", "fantasy2.png", "yugioh.png"];

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

        imageContainer.appendChild(div_img);
        div_img.appendChild(img);

        var radioBtn = document.createElement("input");
        radioBtn.type = "radio";
        radioBtn.name = "cardSelection";
        radioBtn.value = imageName;
        selectionFieldset.appendChild(radioBtn);

        var label = document.createElement("label");
        label.textContent = imageName;
        selectionFieldset.appendChild(label);

        selectionFieldset.appendChild(document.createElement("br"));
    });

}

document.addEventListener("DOMContentLoaded", loadImages);


document.getElementById("selectionForm").addEventListener("submit", function(event)
{
    event.preventDefault();

    var selectedCard = document.querySelector('input[name="cardSelection"]:checked').value;

    document.cookie = "selectedCard=" + selectedCard + ";path=/; max-age=" + (60 * 60 * 24 * 365);  // 1 year

    console.log("SET COOKIE: Selected card: " + selectedCard);
});

function setImageCookie()
{
    const selectedImage = document.querySelector('input[name="selectedImage"]:checked').value;
    if (selectedImage) {
        document.cookie = "selectedImage=" + selectedImage + "; path=/; max-age=" + (60 * 60 * 24 * 365);
        alert("Image selected: " + selectedImage);
    } else {
        alert("Please select an image.");
    }
}

function getCookie(name)
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


let selectedImage = getCookie("selectedCard");
if (selectedImage)
{
    console.log("GET COOKIE: Selected image:", selectedImage);
}