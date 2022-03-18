const toTopButton = document.getElementById("back-to-top");

function onScroll() {
    if (document.body.scrollTop > 1950 || document.documentElement.scrollTop > 1950) {
        toTopButton.style.display = "block";
    } else {
        toTopButton.style.display = "none";
    }
}

function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

window.onscroll = onScroll;
toTopButton.addEventListener("click", backToTop);
