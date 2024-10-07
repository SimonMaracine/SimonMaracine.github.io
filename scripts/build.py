#! /usr/bin/env python3

import sys
import subprocess
import json


def make_html(template: str, destination: str, macros: list[str]):
    result = subprocess.run(["./make_html.py", template, destination] + macros)

    if result.returncode != 0:
        raise RuntimeError(f"An error occurred processing the HTML for `{template}`")


def main(args: list[str]) -> int:
    try:
        make_html(
            "../html/templates/index.html",
            "../index.html",
            [
                "$M_NAVIGATION_BAR=../html/navigation_bar.html",
                "$M_BACK_TO_TOP_BUTTON=../html/back_to_top_button.html",
                "$M_COPYRIGHT=../html/copyright.html"
            ]
        )

        make_html(
            "../html/templates/archive.html",
            "../archive.html",
            [
                "$M_NAVIGATION_BAR=../html/navigation_bar.html",
                "$M_BACK_TO_TOP_BUTTON=../html/back_to_top_button.html",
                "$M_COPYRIGHT=../html/copyright.html"
            ]
        )

        with open("../html/articles/articles.json", "r") as file:
            articles = json.load(file)

        for article in articles:
            with open(f"../html/articles/{article}/{article}.json", "r") as file:
                article_metadata = json.load(file)

            date = article_metadata["date"]
            last_modified = article_metadata["last-modified"]
            keywords = article_metadata["keywords"]

            make_html(
                "../html/templates/article.html",
                f"../pages/{article}.html",
                [
                    "$M_NAVIGATION_BAR=../html/navigation_bar.html",
                    "$M_BACK_TO_TOP_BUTTON=../html/back_to_top_button.html",
                    "$M_COPYRIGHT=../html/copyright.html",
                    f"#M_TITLE={article_metadata["title"]}",
                    f"#M_DATE={f"{date["month"]} {date["day"]}, {date["year"]}"}",
                    f"#M_KEYWORDS={", ".join(keywords)}",
                    f"#M_LAST_MODIFIED={f"{last_modified["month"]} {last_modified["day"]}, {last_modified["year"]}"}",
                    f"$M_CONTENTS={f"../html/articles/{article}/{article}.html"}"
                ]
            )
    except Exception as err:
        print(f"An error occurred building the pages: {err}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
