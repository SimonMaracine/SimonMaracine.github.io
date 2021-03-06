import { loadFileFromServer } from "./load_file_from_server.js";

class Article {
    constructor(index, htmlContent) {
        this.index = index;
        this.htmlContent = htmlContent;
    }
}

function showArticles(articles, pagesDivRow1Column1, pagesDivRow1Column2, pagesDivRow2Column1, pagesDivRow2Column2) {  
    const maxIndex = Math.max(...Object.values(articles).map(article => article.index));
    let index = maxIndex;

    for (let i = 0; i < 4; i++) {
        let div;

        switch (i) {
            case 0:
                div = pagesDivRow1Column1;
                break;
            case 1:
                div = pagesDivRow1Column2;
                break;
            case 2:
                div = pagesDivRow2Column1;
                break;
            case 3:
                div = pagesDivRow2Column2;
                break;
        };

        div.innerHTML += articles[index].htmlContent;

        index--;
    }

    // Jump to section
    const urlSearchParameters = new URLSearchParams(window.location.search);
    const parameters = Object.fromEntries(urlSearchParameters.entries());

    const section = parameters["s"];

    if (section !== undefined && /^([a-z0-9\-]+)$/.test(section)) {
        document.getElementById(section).scrollIntoView({
            behavior: "smooth"
        });
    }
}

function onError() {
    const pagesDiv = document.querySelector("#pages .container");
    pagesDiv.innerHTML = '<p style="text-align: center;">There was an error getting the latest articles. :(</p>';
}

function processArticles(articlesFirstPage, pagesDivRow1Column1, pagesDivRow1Column2,
        pagesDivRow2Column1, pagesDivRow2Column2) {
    const articles = {};

    let articlesProcessed = 0;

    for (const article of articlesFirstPage) {
        const filePath = "/html/pages/articles/" + article + "/" + article + ".json";

        loadFileFromServer(
            filePath,
            (articleResult) => {
                const articleDetails = JSON.parse(articleResult);
                const index = articleDetails["index"];

                articles[index] = new Article(
                    index,
                    `
                        <div class="pages-item">
                            <h2>${articleDetails['title']}</h2>
                            <p class="date">${articleDetails['date']['month']} ${articleDetails['date']['day']}, ${articleDetails['date']['year']}</p>
                            <p class="preview">${articleDetails['preview']}</p>
                            <div class="read-more-container">
                                <a class="item-link" href="${'/html/pages/article.html?article=' + article}">
                                    <p class="read-more">Read More</p>
                                </a>
                            </div>
                        </div>
                    `
                );

                articlesProcessed++;

                // Show these articles in the page
                if (articlesProcessed === 4) {
                    showArticles(articles, pagesDivRow1Column1, pagesDivRow1Column2, pagesDivRow2Column1, pagesDivRow2Column2);
                }
            },
            () => {
                console.log("Error getting article '" + article + "'");
            }
        );
    }
}

function onLoad(result) {
    const articles = JSON.parse(result);
    const articlesFirstPage = articles["first-page-latest"];

    const pagesDivRow1Column1 = document.querySelector("#pages .row1 .column1");
    const pagesDivRow1Column2 = document.querySelector("#pages .row1 .column2");
    const pagesDivRow2Column1 = document.querySelector("#pages .row2 .column1");
    const pagesDivRow2Column2 = document.querySelector("#pages .row2 .column2");

    processArticles(
        articlesFirstPage, pagesDivRow1Column1, pagesDivRow1Column2, pagesDivRow2Column1, pagesDivRow2Column2
    );   
}

loadFileFromServer("/html/pages/articles.json", onLoad, onError);
