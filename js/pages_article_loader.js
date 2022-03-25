function loadContents(filePath, loader) {
    const request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (this.readyState === this.DONE) {
            if (request.status == 200) {
                const result = request.responseText;

                loader(result);
            }
        }
    }

    request.open("GET", filePath);
    request.send();
}

const urlSearchParameters = new URLSearchParams(window.location.search);
const parameters = Object.fromEntries(urlSearchParameters.entries());

const articleName = "/html/pages_articles/" + parameters["article"] + "/" + parameters["article"];

loadContents(articleName + ".json", result => {
    const articleDetails = JSON.parse(result);

    const title = document.getElementById("title");
    title.innerText = articleDetails["title"];

    const date = document.getElementById("date");
    date.innerText = articleDetails["date"];

    const tags = document.getElementById("tags");
    tags.innerText = articleDetails["tags"];

    const lastModified = document.getElementById("last-modified");
    lastModified.innerText = articleDetails["last-modified"];
});

$(function() {
    $("#article-content").load(articleName + ".html");
});
