#! /usr/bin/env -S python3 -B

import sys
import json

import make_html


def stringify_month(month: int) -> str:
    match month:
        case 1:
            return "January"
        case 2:
            return "February"
        case 3:
            return "March"
        case 4:
            return "April"
        case 5:
            return "May"
        case 6:
            return "June"
        case 7:
            return "July"
        case 8:
            return "August"
        case 9:
            return "September"
        case 10:
            return "October"
        case 11:
            return "November"
        case 12:
            return "December"
        case _:
            raise RuntimeError("Invalid month")


def pages_article_template(title: str, date: str, preview: str, article_name: str) -> str:
    return \
f"""
<div class="pages-article">
    <p class="page-title" lang="ro">{title}</p>
    <p>{date}</p>
    <p lang="ro">{preview}...</p>
    <p class="read-page">
        <a class="generic-link" href="/pages/{article_name}.html">Read Page</a>
    </p>
</div>
""".strip()


def pages_pagination_template(index: int, active: bool) -> str:
    return \
f"""
<li {'class="active"' if active else ''}>
    <a href="/pages-archive-{index}.html">{index}</a>
</li>
""".strip()


def simon_says_article_template(title: str, date: str, article_name: str) -> str:
    return \
f"""
<li class="simon-says-article">
    <a class="outlined-link" href="/simon-says/{article_name}.html">{title} | {date}</a>
</li>
""".strip()


def build_index():
    with open("../articles/pages/ALL.json", "r") as file:
        articles = json.load(file)

    latest_articles = list(reversed(articles[-4:]))
    latest_articles_content: list[str] = []

    for article in latest_articles:
        with open(f"../articles/pages/{article}.json", "r") as file:
            article_metadata = json.load(file)

        date = article_metadata["date"]

        latest_articles_content.append(
            pages_article_template(
                article_metadata["title"],
                f"{stringify_month(date["month"])} {date["day"]}, {date["year"]}",
                article_metadata["preview"],
                article
            )
        )

    make_html.make_html(
        "../html/templates/index.html",
        "../index.html",
        [
            make_html.Macro("M_NAVIGATION_BAR", "../html/navigation-bar.html", True),
            make_html.Macro("M_BACK_TO_TOP_BUTTON", "../html/back-to-top-button.html", True),
            make_html.Macro("M_COPYRIGHT", "../html/copyright.html", True),
            make_html.Macro("M_PAGE_11", latest_articles_content[0], False),
            make_html.Macro("M_PAGE_12", latest_articles_content[1], False),
            make_html.Macro("M_PAGE_21", latest_articles_content[2], False),
            make_html.Macro("M_PAGE_22", latest_articles_content[3], False)
        ]
    )


def build_pages_archive():
    with open("../articles/pages/ALL.json", "r") as file:
        articles = json.load(file)

    COUNT = 10

    d, r = divmod(len(articles), COUNT)
    article_pages = d + int(r > 0)

    for index in range(article_pages):
        articles_in_page = articles[COUNT * index:COUNT * (index + 1)]
        articles_in_page_content: list[str] = []

        for article in articles_in_page:
            with open(f"../articles/pages/{article}.json", "r") as file:
                article_metadata = json.load(file)

            date = article_metadata["date"]

            articles_in_page_content.append(
                pages_article_template(
                    article_metadata["title"],
                    f"{stringify_month(date["month"])} {date["day"]}, {date["year"]}",
                    article_metadata["preview"],
                    article
                )
            )

        pagination_content = [pages_pagination_template(i + 1, index == i) for i in range(article_pages)]

        make_html.make_html(
            "../html/templates/pages-archive.html",
            f"../pages-archive-{index + 1}.html",
            [
                make_html.Macro("M_NAVIGATION_BAR", "../html/navigation-bar.html", True),
                make_html.Macro("M_BACK_TO_TOP_BUTTON", "../html/back-to-top-button.html", True),
                make_html.Macro("M_COPYRIGHT", "../html/copyright.html", True),
                make_html.Macro("M_ARTICLES", "\n".join(articles_in_page_content), False),
                make_html.Macro("M_PAGINATION", "\n".join(pagination_content), False)
            ]
        )


def build_pages_articles():
    with open("../articles/pages/ALL.json", "r") as file:
        articles = json.load(file)

    for article in articles:
        with open(f"../articles/pages/{article}.json", "r") as file:
            article_metadata = json.load(file)

        date = article_metadata["date"]
        last_modified = article_metadata["last-modified"]
        keywords = article_metadata["keywords"]

        make_html.make_html(
            "../html/templates/pages-article.html",
            f"../pages/{article}.html",
            [
                make_html.Macro("M_NAVIGATION_BAR", "../html/navigation-bar.html", True),
                make_html.Macro("M_BACK_TO_TOP_BUTTON", "../html/back-to-top-button.html", True),
                make_html.Macro("M_COPYRIGHT", "../html/copyright.html", True),
                make_html.Macro("M_TITLE", article_metadata["title"], False),
                make_html.Macro("M_DATE", f"{stringify_month(date["month"])} {date["day"]}, {date["year"]}", False),
                make_html.Macro("M_KEYWORDS", ", ".join(keywords), False),
                make_html.Macro("M_LAST_MODIFIED", f"{stringify_month(last_modified["month"])} {last_modified["day"]}, {last_modified["year"]}", False),
                make_html.Macro("M_CONTENTS", f"../html/articles/pages/{article}.html", True)
            ]
        )


def build_simon_says_archive():
    with open("../articles/simon-says/ALL.json", "r") as file:
        articles = json.load(file)

    for article in articles:
        with open(f"../articles/simon-says/{article}.json", "r") as file:
            article_metadata = json.load(file)

        articles_content: list[str] = []

        date = article_metadata["date"]

        articles_content.append(
            simon_says_article_template(
                article_metadata["title"],
                f"{stringify_month(date["month"])} {date["day"]}, {date["year"]}",
                article
            )
        )

    make_html.make_html(
        "../html/templates/simon-says-archive.html",
        f"../simon-says-archive.html",
        [
            make_html.Macro("M_NAVIGATION_BAR", "../html/navigation-bar.html", True),
            make_html.Macro("M_BACK_TO_TOP_BUTTON", "../html/back-to-top-button.html", True),
            make_html.Macro("M_COPYRIGHT", "../html/copyright.html", True),
            make_html.Macro("M_ARTICLES", "\n".join(articles_content), False)
        ]
    )


def build_simon_says_articles():
    pass


def main(args: list[str]) -> int:
    try:
        build_index()
        build_pages_archive()
        build_pages_articles()
        build_simon_says_archive()
        build_simon_says_articles()
    except Exception as err:
        print(f"An error occurred building the pages: {err}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
