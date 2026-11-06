#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
bin="$(mktemp "${TMPDIR:-/tmp}/dijkstra-test.XXXXXX")"
trap 'rm -f "$bin"' EXIT
c++ -std=c++17 -Wall -Wextra -pedantic tests/test.cpp -o "$bin"
"$bin"
c++ -std=c++17 -Wall -Wextra -pedantic dijkstra.cpp -o "$bin"
output="$("$bin")"
printf '%s\n' "$output"
[[ "$output" == *"dist[5] = 9"* && "$output" == *"0 -> 1 -> 3 -> 5"* ]]
node tests/trace.test.js
