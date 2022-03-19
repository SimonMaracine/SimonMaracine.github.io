const hello1 = document.getElementById("hello1");
const hello2 = document.getElementById("hello2");

window.onload = function() {
    setTimeout(() => {
        hello1.classList.remove("initially-hidden");
        hello1.classList.add("fade-in");
    }, 500);

    setTimeout(() => {
        hello2.classList.remove("initially-hidden");
        hello2.classList.add("fade-in");
    }, 2000);
}
