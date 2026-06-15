#!/usr/bin/env sh
# Regenerate the simplified TopoJSON used by /congress-map.
# Source: public/data/congress-map/us_congress_2016_lower_48.json (kept out of git;
# fetch from US Census TIGER/Line or your archive). Output is committed.
set -e

INPUT="${1:-public/data/congress-map/us_congress_2016_lower_48.json}"
OUTPUT="public/data/congress-map/us_congress_2016_lower_48.topo.json"

if [ ! -f "$INPUT" ]; then
  echo "Source GeoJSON not found at $INPUT" >&2
  exit 1
fi

bunx mapshaper "$INPUT" \
  -simplify 10% \
  -o format=topojson "$OUTPUT"

echo "Wrote $OUTPUT ($(wc -c <"$OUTPUT" | awk '{print $1/1024 "K"}'))"
