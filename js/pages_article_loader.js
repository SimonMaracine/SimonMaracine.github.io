function loadContents(filePath, onLoad, onError) {
    const request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (this.readyState === this.DONE) {
            if (request.status == 200) {
                const result = request.responseText;
                onLoad(result);
            } else {
                console.log("Error on request");
                onError();
            }
        }
    }

    request.open("GET", filePath);
    request.send();
}

function onError() {
    const content = document.querySelector(".content");
    content.innerHTML = '<h2 style="text-align: center;">There was an error getting the article. :(</h2>';
}

function onLoad(result) {
    const articleDetails = JSON.parse(result);

    const title = document.getElementById("title");
    title.innerText = articleDetails["title"];

    const date = document.getElementById("date");
    date.innerText = articleDetails["date"];

    const tags = document.getElementById("tags");
    tags.innerText = articleDetails["tags"];

    const lastModified = document.getElementById("last-modified");
    lastModified.innerText = articleDetails["last-modified"];
}

const urlSearchParameters = new URLSearchParams(window.location.search);
const parameters = Object.fromEntries(urlSearchParameters.entries());

const articleName = parameters["article"];

if (articleName !== undefined && /^(([a-z]+[0-9]*(\-)?)+)$/.test(articleName)) {
    const articlePath = "/html/pages/articles/" + articleName + "/" + articleName;

    loadContents(articlePath + ".json", onLoad, onError);

    $(function() {
        $("#article-content").load(articlePath + ".html");
    });
} else {
    console.log("Invalid argument passed to 'article'");
    onError();
}
