import { loadFileFromServer } from "./load_file_from_server.js";

function onError() {
    const articlesDiv = document.getElementById("articles");
    articlesDiv.innerHTML = '<p style="text-align: center;">There was an error getting the articles in this page. :(</p>';
}

function onLoad(result) {
    const articles = JSON.parse(result);
    const articlesInPage = articles["archive-pagination"][paginationNumber - 1];

    if (articlesInPage === undefined) {
        onError();
        return;
    }

    const articlesDiv = document.getElementById("articles");

    for (const article of articlesInPage) {
        const path = "/html/pages/articles/" + article + "/" + article + ".json";

        loadFileFromServer(
            path,
            articleResult => {
                const articleDetails = JSON.parse(articleResult);

                // FIXME this must be synchronous
                articlesDiv.innerHTML += `
                <div class="row"></div>
                    <div class="col-lg-12">
                        <div class="pages-item">
                            <h2 class="title">${articleDetails['title']}</h2>
                            <p class="date">${articleDetails['date']}</p>
                            <p class="preview">${articleDetails['preview']}</p>
                            <div class="read-more-container">
                                <a class="item-link" href="${'/html/pages/article.html?article=' + article}">
                                    <p class="read-more">Read More</p>
                                </a>
                            </div>
                        </div>
                    <div>
                <div>
                `;
            },
            () => {
                console.log("Error getting article '" + article + "'");
            }
        );
    }
}

const urlSearchParameters = new URLSearchParams(window.location.search);
const parameters = Object.fromEntries(urlSearchParameters.entries());

const paginationNumber = parameters["pagination"];

if (paginationNumber !== undefined && /^([0-9]+)$/.test(paginationNumber) && paginationNumber > 0) {
    loadFileFromServer("/html/pages/articles.json", onLoad, onError);
} else {
    console.log("Invalid argument passed to 'pagination'");
    onError();
}
