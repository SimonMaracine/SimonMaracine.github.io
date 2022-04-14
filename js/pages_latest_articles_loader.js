import { loadFileFromServer } from "./load_file_from_server.js";

function onError() {
    const pagesDiv = document.querySelector("#pages .container");
    pagesDiv.innerHTML = '<p style="text-align: center;">There was an error getting the latest articles. :(</p>';
}

function processArticles(articlesFirstPage, articlesInOrder, pagesDivColumn1, pagesDivColumn2) {
    let articleIndex = 0;
    let numberOfArticlesProcessed = 0;

    for (const article of articlesFirstPage) {
        const filePath = "/html/pages/articles/" + article + "/" + article + ".json";

        loadFileFromServer(
            filePath,
            (articleResult, index) => {
                const articleDetails = JSON.parse(articleResult);

                articlesInOrder[index] = `
                    <div class="pages-item">
                        <h2>${articleDetails['title']}</h2>
                        <p class="date">${articleDetails['date']}</p>
                        <p class="preview">${articleDetails['preview']}</p>
                        <div class="read-more-container">
                            <a class="item-link" href="${'/html/pages/article.html?article=' + article}">
                                <p class="read-more">Read More</p>
                            </a>
                        </div>
                    </div>
                `;

                numberOfArticlesProcessed++;

                // Show these articles in the page
                if (numberOfArticlesProcessed === articlesInOrder.length) {
                    for (let j = 0; j < articlesInOrder.length; j++) {                  
                        let div;
                        switch (j) {
                            case 0:
                            case 2:
                                div = pagesDivColumn1;
                                break;
                            case 1:
                            case 3:
                                div = pagesDivColumn2;
                                break;
                        };

                        div.innerHTML += articlesInOrder[j];
                    }

                    // Jump to section
                    const urlSearchParameters = new URLSearchParams(window.location.search);
                    const parameters = Object.fromEntries(urlSearchParameters.entries());

                    const section = parameters["s"];

                    if (section !== undefined && /^([a-z\-]+)$/.test(section)) {
                        document.getElementById(section).scrollIntoView({
                            behavior: "smooth"
                        });
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
    const articlesFirstPage = articles["first-page-latest"];

    const pagesDivColumn1 = document.querySelector("#pages .column1");
    const pagesDivColumn2 = document.querySelector("#pages .column2");

    const articlesInOrder = [];
    for (const article of articlesFirstPage) {
        articlesInOrder.push("");
    }

    processArticles(articlesFirstPage, articlesInOrder, pagesDivColumn1, pagesDivColumn2);   
}

loadFileFromServer("/html/pages/articles.json", onLoad, onError);
