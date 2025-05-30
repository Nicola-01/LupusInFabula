document.addEventListener('DOMContentLoaded', function (event) {
    showSlides(1, 0);
    showSlides(1, 1);
    showSlides(1, 2);
    showSlides(1, 3);
});

var slideIndex = [1, 1, 1, 1];
var slideId = ["slide1", "slide2", "slide3", "slide4"]

function plusSlides(n, no) {
    showSlides(slideIndex[no] += n, no);
}

function showSlides(n, no) {
    var i;
    var x = document.getElementsByClassName(slideId[no]);
    if (n > x.length)
        slideIndex[no] = 1
    if (n < 1)
        slideIndex[no] = x.length
    for (i = 0; i < x.length; i++)
        x[i].style.display = "none";
    x[slideIndex[no] - 1].style.display = "block";
}

// uploads lower resolution images and then replaces them with higher resolution
(() => {
    'use strict';
    // Page is loaded
    const objects = document.getElementsByClassName('asyncImage');
    Array.from(objects).map((item) => {
        // Start loading image
        const img = new Image();
        img.src = item.dataset.src;
        // Once image is loaded replace the src of the HTML element
        img.onload = () => {
            item.classList.remove('asyncImage');
            return item.nodeName === 'IMG' ?
                item.src = item.dataset.src :
                item.style.backgroundImage = `url(${item.dataset.src})`;
        };
    });
})();