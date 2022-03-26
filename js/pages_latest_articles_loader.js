import { loadFileFromServer } from "./load_file_from_server.js";

function onError() {
    const pagesDiv = document.querySelector("#pages .container");
    pagesDiv.innerHTML = '<p style="text-align: center;">There was an error getting the latest articles. :(</p>';
}

function onLoad(result) {
    const articles = JSON.parse(result);
    const articlesFirstPage = articles["first-page-latest"];

    const pagesDivColumn1 = document.querySelector("#pages .column1");
    const pagesDivColumn2 = document.querySelector("#pages .column2");

    for (let i = 0; i < 4; i++) {
        const article = articlesFirstPage[i];

        if (article === undefined) {
            break;
        }

        const path = "/html/pages/articles/" + article + "/" + article + ".json";

        loadFileFromServer(
            path,
            articleResult => {
                const articleDetails = JSON.parse(articleResult);

                let div;

                switch (i) {
                    case 0:
                    case 2:
                        div = pagesDivColumn1;
                        break;
                    case 1:
                    case 3:
                        div = pagesDivColumn2;
                        break;
                };

                div.innerHTML += `
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
            },
            () => {
                console.log("Error getting article '" + article + "'");
            }
        );
    }
}

loadFileFromServer("/html/pages/articles.json", onLoad, onError);
