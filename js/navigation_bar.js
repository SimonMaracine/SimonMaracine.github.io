fetch("./components/navigation_bar.html")
    .then(response => response.text())
    .then(data => {
        const navigationBarDiv = document.getElementById("navigation-bar");

        navigationBarDiv.innerHTML = data;
    });
