#! /usr/bin/env python3

import sys
import dataclasses


@dataclasses.dataclass(frozen=True)
class Macro:
    key: str
    value: str
    file: bool


def print_help():
    print(
"""make_html.py <template> <destination> [#macro=value...] [$macro=file_path...]

Where `template` is a path to the template file, `destination` is a path to the result, `macro` is a string identifier,
`value` is a string and `file_path` a path to a file that contains the actual contents.""",
        file=sys.stderr
    )


def parse_macro_arguments(args: list[str]) -> list[Macro]:
    if len(args) == 3:
        return []

    result: list[Macro] = []

    for i in range(3, len(args)):
        tokens = args[i].split("=")

        if len(tokens) != 2:
            raise RuntimeError("Invalid macro: There may be a single equation")

        key = tokens[0]
        value = tokens[1]

        if key.startswith("#"):
            file = False
        elif key.startswith("$"):
            file = True
        else:
            raise RuntimeError("Invalid macro: Invalid key type")

        result.append(Macro(key.lstrip("#$"), value, file))

    return result


def process_template(template_contents: str, macros: list[Macro]) -> str:
    result = template_contents

    for macro in macros:
        if macro.file:
            try:
                with open(macro.value, "r") as file:
                    value = file.read()
            except FileNotFoundError as err:
                raise RuntimeError(f"Could not find macro file: {err}")
            except Exception as err:
                raise RuntimeError(f"Could not open macro file: {err}")
        else:
            value = macro.value

        result = result.replace(macro.key, value)

    return result


def main(args: list[str]) -> int:
    if len(args) < 3:
        print_help()
        return 1

    template_file_path = args[1]
    destination_file_path = args[2]

    try:
        macros = parse_macro_arguments(args)
    except RuntimeError as err:
        print(f"Could not parse macros: {err}", file=sys.stderr)
        return 1

    try:
        with open(template_file_path, "r") as template_file:
            template_contents = template_file.read()
    except FileNotFoundError as err:
        print(f"Could not find template file: {err}", file=sys.stderr)
        return 1
    except Exception as err:
        print(f"Could not open template file: {err}", file=sys.stderr)
        return 1

    try:
        destination_contents = process_template(template_contents, macros)
    except RuntimeError as err:
        print(f"Could not process template: {err}", file=sys.stderr)
        return 1

    try:
        with open(destination_file_path, "w") as destination_file:
            destination_file.write(destination_contents)
    except Exception as err:
        print(f"Could not write to destination file: {err}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))