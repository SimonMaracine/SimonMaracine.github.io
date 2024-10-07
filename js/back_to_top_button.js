let toTopButton;

function onScroll() {
    const show = (
        document.body.scrollTop > document.body.scrollHeight / 2 ||
        document.documentElement.scrollTop > document.body.scrollHeight / 2
    );

    toTopButton.style.display = show ? "block" : "none";
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

document.addEventListener("DOMContentLoaded", doneLoading);
