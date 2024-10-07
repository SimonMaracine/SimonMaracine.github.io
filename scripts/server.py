#! /usr/bin/env python3

import sys
import subprocess

if __name__ == "__main__":
    try:
        port = [sys.argv[1]]
    except IndexError:
        port = []

    subprocess.run(["python3", "-m", "http.server", "--directory", ".."] + port)
