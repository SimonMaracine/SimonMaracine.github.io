import { loadFileFromServer } from "./load_file_from_server.js";
import { Article } from "./article.js";

function showArticles(articles, articlesDiv) {
    const minIndex = Math.min(...Object.values(articles).map(article => article.index));
    let index = minIndex;

    // Clear the placeholder code
    articlesDiv.innerHTML = "";

    for (let i = 0; i < Object.keys(articles).length; i++) {
        articlesDiv.innerHTML += articles[index].htmlContent;
        index++;
    }
}

function processArticles(articlesInPage, articlesDiv) {
    const articles = {};
    let articlesProcessed = 0;

    for (const article of articlesInPage) {
        const filePath = "/html/pages/articles/" + article + "/" + article + ".json";

        loadFileFromServer(
            filePath,
            articleResult => {
                const articleDetails = JSON.parse(articleResult);
                const index = articleDetails["index"];
                const date = articleDetails["date"];

                articles[index] = new Article(
                    index,
                    `
                        <div class="pages-item">
                            <h2 lang="ro">${articleDetails['title']}</h2>
                            <p>${date['month']} ${date['day']}, ${date['year']}</p>
                            <p lang="ro">${articleDetails['preview']}...</p>
                            <div class="read-page-container">
                                <a class="item-link read-page" href="${'/html/pages/article.html?article=' + article}">
                                    Read Page
                                </a>
                            </div>
                        </div>
                    `
                );

                if (++articlesProcessed === articlesInPage.length) {
                    showArticles(articles, articlesDiv);
                }
            },
            () => {
                console.log("Error getting article '" + article + "'");
                onError();
            }
        );
    }
}

function onLoad(result) {
    const articles = JSON.parse(result);

    const ARTICLES = 10;
    const articlesInPage = articles.slice(ARTICLES * (paginationNumber - 1), ARTICLES * paginationNumber);

    if (articlesInPage === undefined) {
        onError();
        return;
    }

    const articlesDiv = document.getElementById("articles");

    processArticles(articlesInPage, articlesDiv);
}

function onError() {
    const articlesDiv = document.getElementById("articles");
    articlesDiv.innerHTML = '<p style="text-align: center;">There was an error getting the articles. :(</p>';
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

    const activePage = listItems[paginationNumber - 1];

    if (activePage !== undefined) {
        activePage.classList.add("active");
    } else {
        console.log("Invalid argument passed to 'pagination'");
        onError();
    }
} else {
    console.log("Invalid argument passed to 'pagination'");
    onError();
}
