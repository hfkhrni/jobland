#!/bin/bash

set -e

echo "Seeding all tables..."
bunx convex run seed:runAll

echo "Uploading SVG logos and capturing storage IDs..."
UPLOAD_OUTPUT=$(bunx convex run seed:uploadSVGLogos)

# Extract storageIds array from the output
STORAGE_IDS=$(echo "$UPLOAD_OUTPUT" | jq '.storageIds')

# Compose the JSON argument string
ARGS_JSON="{\"storageIds\": $STORAGE_IDS}"

echo "Assigning random logos to companies..."
bunx convex run seed:assignRandomLogosToCompanies "$ARGS_JSON"

echo "All seeding steps complete!"