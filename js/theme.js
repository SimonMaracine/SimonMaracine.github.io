function applyTheme(theme) {
    document.getElementById("style-sheet").href = `${theme}-theme.css`;
}

document.addEventListener("DOMContentLoaded", () => {
    const currentTheme = localStorage.getItem("theme");

    if (currentTheme === "dark") {
        applyTheme("dark");

        console.log("DARK THEME");
    } else {
        applyTheme("light");

        console.log("light theme");
    }
});
