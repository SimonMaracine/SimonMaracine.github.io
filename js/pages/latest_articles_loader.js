import { loadFileFromServer } from "./load_file_from_server.js";
import { Article } from "./article.js";

function showArticles(articles, pagesDivRow1Column1, pagesDivRow1Column2, pagesDivRow2Column1, pagesDivRow2Column2) {
    const maxIndex = Math.max(...Object.values(articles).map(article => article.index));
    let index = maxIndex;

    pagesDivRow1Column1.innerHTML = articles[index--].htmlContent;
    pagesDivRow1Column2.innerHTML = articles[index--].htmlContent;
    pagesDivRow2Column1.innerHTML = articles[index--].htmlContent;
    pagesDivRow2Column2.innerHTML = articles[index--].htmlContent;
}

function processArticles(latestArticles, pagesDivRow1Column1, pagesDivRow1Column2, pagesDivRow2Column1, pagesDivRow2Column2) {
    const articles = {};
    let articlesProcessed = 0;

    for (const article of latestArticles) {
        const filePath = "/html/pages/articles/" + article + "/" + article + ".json";

        loadFileFromServer(
            filePath,
            articleResult => {
                const articleDetails = JSON.parse(articleResult);
                const index = articleDetails["index"];
                const date = articleDetails['date'];

                articles[index] = new Article(
                    index,
                    `
                        <div class="pages-item">
                            <h2 class="title">${articleDetails['title']}</h2>
                            <p class="date">${date['month']} ${date['day']}, ${date['year']}</p>
                            <p class="preview">${articleDetails['preview']}...</p>
                            <div class="read-page-container">
                                <a class="item-link read-page" href="${'/html/pages/article.html?article=' + article}">
                                    Read Page
                                </a>
                            </div>
                        </div>
                    `
                );

                if (++articlesProcessed === 4) {
                    showArticles(
                        articles,
                        pagesDivRow1Column1,
                        pagesDivRow1Column2,
                        pagesDivRow2Column1,
                        pagesDivRow2Column2
                    );
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

    const ARTICLES = 4;
    const latestArticles = articles.slice(-ARTICLES);

    const pagesDivRow1Column1 = document.querySelector("#pages-section .row1 .column1");
    const pagesDivRow1Column2 = document.querySelector("#pages-section .row1 .column2");
    const pagesDivRow2Column1 = document.querySelector("#pages-section .row2 .column1");
    const pagesDivRow2Column2 = document.querySelector("#pages-section .row2 .column2");

    processArticles(
        latestArticles,
        pagesDivRow1Column1,
        pagesDivRow1Column2,
        pagesDivRow2Column1,
        pagesDivRow2Column2
    );
}

function onError() {
    const pagesDiv = document.querySelector("#pages-section .container");
    pagesDiv.innerHTML = '<p style="text-align: center;">There was an error getting the latest articles. :(</p>';
}

let loadedArticles = false;

window.addEventListener("scroll", () => {
    const pagesSection = document.getElementById("pages-section");
    const scrollY = window.scrollY + window.innerHeight;

    if (!loadedArticles && scrollY > pagesSection.offsetTop) {
        loadFileFromServer("/html/pages/articles.json", onLoad, onError);

        loadedArticles = true;
    }
});
