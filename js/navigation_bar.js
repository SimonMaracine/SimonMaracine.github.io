function afterLoad() {
    const themeButton = document.getElementById("theme-button");

    themeButton.addEventListener("click", () => {
        const currentTheme = localStorage.getItem("theme");
        const newTheme = currentTheme === "dark" ? "dark" : "light";

        applyTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    });
}

$(function() {
    $("#navigation-bar").load("/html/components/navigation_bar.html", afterLoad);
});
