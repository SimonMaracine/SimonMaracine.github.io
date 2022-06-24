import { loadFileFromServer } from "./load_file_from_server.js";

function onError() {
    const articlesDiv = document.getElementById("articles");
    articlesDiv.innerHTML = '<p style="text-align: center;">There was an error getting the articles in this page. :(</p>';
}

function processArticles(articlesInPage, articlesInOrder, articlesDiv) {
    let articleIndex = 0;
    let numberOfArticlesProcessed = 0;

    for (const article of articlesInPage) {
        const filePath = "/html/pages/articles/" + article + "/" + article + ".json";

        loadFileFromServer(
            filePath,
            (articleResult, index) => {
                const articleDetails = JSON.parse(articleResult);

                articlesInOrder[index] = `
                    <div class="row"></div>
                        <div class="col-lg-12">
                            <div class="pages-item">
                                <h2 class="title">${articleDetails['title']}</h2>
                                <p class="date">${articleDetails['date']['month']} ${articleDetails['date']['day']}, ${articleDetails['date']['year']}</p>
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

                numberOfArticlesProcessed++;

                // Show these articles in the page
                if (numberOfArticlesProcessed === articlesInOrder.length) {
                    for (const articleHTML of articlesInOrder) {
                        articlesDiv.innerHTML += articleHTML;
                    }
                }
            },
            () => {
                console.log("Error getting article '" + article + "'");
            },
            articleIndex
        );

        articleIndex++;
    }
}

function onLoad(result) {
    const articles = JSON.parse(result);
    const articlesInPage = articles["archive-pagination"][paginationNumber - 1];

    if (articlesInPage === undefined) {
        onError();
        return;
    }

    const articlesDiv = document.getElementById("articles");

    const articlesInOrder = [];
    for (const article of articlesInPage) {
        articlesInOrder.push("");
    }

    processArticles(articlesInPage, articlesInOrder, articlesDiv);
}

const urlSearchParameters = new URLSearchParams(window.location.search);
const parameters = Object.fromEntries(urlSearchParameters.entries());

const paginationNumber = parameters["pagination"];

if (paginationNumber !== undefined && /^([0-9]+)$/.test(paginationNumber) && paginationNumber > 0) {
    loadFileFromServer("/html/pages/articles.json", onLoad, onError);

    const listItems = document.querySelectorAll(".pagination li");
    for (const listItem of listItems) {
        listItem.classList.remove("active");
    }
    listItems[paginationNumber - 1].classList.add("active");
} else {
    console.log("Invalid argument passed to 'pagination'");
    onError();
}
