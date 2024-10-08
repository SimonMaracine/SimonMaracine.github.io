#! /usr/bin/env -S python3 -B

import sys
import json

import make_html


def article_template(title: str, date: str, preview: str, article_name: str) -> str:
    return \
f"""
<div class="pages-item">
    <h2 lang="ro">{title}</h2>
    <p>{date}</p>
    <p lang="ro">{preview}...</p>
    <div class="read-page-container">
        <a class="item-link read-page" href="/pages/{article_name}.html">
            Read Page
        </a>
    </div>
</div>
""".strip()


def pagination_template(index: int, active: bool) -> str:
    return \
f"""
<li {'class="active"' if active else ''}>
    <a class="page-link" href="/archive{index}.html">{index}</a>
</li>
""".strip()


def build_index():
    with open("../articles/articles.json", "r") as file:
        articles = json.load(file)

    latest_articles = list(reversed(articles[-4:]))
    latest_articles_content: list[str] = []

    for article in latest_articles:
        with open(f"../articles/{article}.json", "r") as file:
            article_metadata = json.load(file)

        date = article_metadata["date"]
        last_modified = article_metadata["last-modified"]
        keywords = article_metadata["keywords"]

        latest_articles_content.append(
            article_template(
                article_metadata["title"],
                f"{date["month"]} {date["day"]}, {date["year"]}",
                article_metadata["preview"],
                article
            )
        )

    make_html.make_html(
        "../html/templates/index.html",
        "../index.html",
        [
            make_html.Macro("M_NAVIGATION_BAR", "../html/navigation_bar.html", True),
            make_html.Macro("M_BACK_TO_TOP_BUTTON", "../html/back_to_top_button.html", True),
            make_html.Macro("M_COPYRIGHT", "../html/copyright.html", True),
            make_html.Macro("M_PAGE_11", latest_articles_content[0], False),
            make_html.Macro("M_PAGE_12", latest_articles_content[1], False),
            make_html.Macro("M_PAGE_21", latest_articles_content[2], False),
            make_html.Macro("M_PAGE_22", latest_articles_content[3], False)
        ]
    )


def build_archive():
    with open("../articles/articles.json", "r") as file:
        articles = json.load(file)

    COUNT = 10

    d, r = divmod(len(articles), COUNT)
    article_pages = d + int(r > 0)

    for index in range(article_pages):
        articles_in_page = articles[COUNT * index:COUNT * (index + 1)]
        articles_in_page_content: list[str] = []

        for article in articles_in_page:
            with open(f"../articles/{article}.json", "r") as file:
                article_metadata = json.load(file)

            date = article_metadata["date"]
            last_modified = article_metadata["last-modified"]
            keywords = article_metadata["keywords"]

            articles_in_page_content.append(
                article_template(
                    article_metadata["title"],
                    f"{date["month"]} {date["day"]}, {date["year"]}",
                    article_metadata["preview"],
                    article
                )
            )

        pagination_content = [pagination_template(i + 1, index == i) for i in range(article_pages)]

        make_html.make_html(
            "../html/templates/archive.html",
            f"../archive{index + 1}.html",
            [
                make_html.Macro("M_NAVIGATION_BAR", "../html/navigation_bar.html", True),
                make_html.Macro("M_BACK_TO_TOP_BUTTON", "../html/back_to_top_button.html", True),
                make_html.Macro("M_COPYRIGHT", "../html/copyright.html", True),
                make_html.Macro("M_ARTICLES", "\n".join(articles_in_page_content), False),
                make_html.Macro("M_PAGINATION", "\n".join(pagination_content), False)
            ]
        )


def build_pages():
    with open("../articles/articles.json", "r") as file:
        articles = json.load(file)

    for article in articles:
        with open(f"../articles/{article}.json", "r") as file:
            article_metadata = json.load(file)

        date = article_metadata["date"]
        last_modified = article_metadata["last-modified"]
        keywords = article_metadata["keywords"]

        make_html.make_html(
            "../html/templates/article.html",
            f"../pages/{article}.html",
            [
                make_html.Macro("M_NAVIGATION_BAR", "../html/navigation_bar.html", True),
                make_html.Macro("M_BACK_TO_TOP_BUTTON", "../html/back_to_top_button.html", True),
                make_html.Macro("M_COPYRIGHT", "../html/copyright.html", True),
                make_html.Macro("M_TITLE", article_metadata["title"], False),
                make_html.Macro("M_DATE", f"{date["month"]} {date["day"]}, {date["year"]}", False),
                make_html.Macro("M_KEYWORDS", ", ".join(keywords), False),
                make_html.Macro("M_LAST_MODIFIED", f"{last_modified["month"]} {last_modified["day"]}, {last_modified["year"]}", False),
                make_html.Macro("M_CONTENTS", f"../html/articles/{article}.html", True)
            ]
        )


def main(args: list[str]) -> int:
    try:
        build_index()
        build_archive()
        build_pages()
    except Exception as err:
        print(f"An error occurred building the pages: {err}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
