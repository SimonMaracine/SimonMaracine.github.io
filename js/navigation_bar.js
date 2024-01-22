function afterLoad() {
    const themeButton = document.getElementById("theme-button");

    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");

        const theme = document.body.classList.contains("dark-theme") ? "dark" : "light";
        localStorage.setItem("theme", theme);
    });

    const currentTheme = localStorage.getItem("theme");

    if (currentTheme === "dark") {
        document.body.classList.add("dark-theme");
        console.log("DARK THEME");
    } else {
        console.log("light theme");
    }
}

$(function() {
    $("#navigation-bar").load("/html/components/navigation_bar.html", afterLoad);
});
