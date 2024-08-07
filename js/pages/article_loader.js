import { loadFileFromServer } from "./load_file_from_server.js";

function onLoad(result) {
    const articleDetails = JSON.parse(result);

    const title = document.getElementById("title");
    title.innerText = articleDetails["title"];

    {
        const date = document.getElementById("date");
        const day = articleDetails["date"]["day"];
        const month = articleDetails["date"]["month"];
        const year = articleDetails["date"]["year"];
        date.innerText = `${month} ${day}, ${year}`;
    }

    const keywords = document.getElementById("keywords");
    keywords.innerText = articleDetails["keywords"].join(", ");

    {
        const lastModified = document.getElementById("last-modified");
        const day = articleDetails["last-modified"]["day"];
        const month = articleDetails["last-modified"]["month"];
        const year = articleDetails["last-modified"]["year"];
        lastModified.innerText = `${month} ${day}, ${year}`;
    }
}

function onError() {
    const main = document.getElementsByTagName("main");
    main[0].innerHTML = '<p style="text-align: center;">There was an error getting the article. :(</p>';
}

const urlSearchParameters = new URLSearchParams(window.location.search);
const parameters = Object.fromEntries(urlSearchParameters.entries());
const articleName = parameters["article"];

if (articleName !== undefined && /^(([a-z]+[0-9]*(\-)?)+)$/.test(articleName)) {
    const articlePath = "/html/pages/articles/" + articleName + "/" + articleName;

    loadFileFromServer(articlePath + ".json", onLoad, onError);

    $(function() {
        $("#article-content").load(articlePath + ".html");
    });
} else {
    console.log("Invalid argument passed to 'article'");
    onError();
}
