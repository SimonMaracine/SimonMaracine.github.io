let toTopButton;

function onScroll() {
    if (document.body.scrollTop > document.body.scrollHeight / 2
            || document.documentElement.scrollTop > document.body.scrollHeight / 2) {
        toTopButton.style.display = "block";
    } else {
        toTopButton.style.display = "none";
    }
}

function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function doneLoading() {
    toTopButton = document.getElementById("back-to-top");

    window.addEventListener("scroll", onScroll);
    toTopButton.addEventListener("click", backToTop);
}

$(function() {
    $("#back-to-top-button").load("/html/components/back_to_top_button.html", doneLoading);
});
