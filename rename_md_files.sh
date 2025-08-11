#!/bin/bash

# Script to rename markdown files to remove spaces and special characters

# Function to convert text to kebab-case
to_kebab_case() {
    echo "$1" | sed 's/ /-/g' | sed "s/'//g" | sed 's/è/e/g' | sed 's/à/a/g' | sed 's/ù/u/g' | sed 's/ò/o/g' | sed 's/ì/i/g' | tr '[:upper:]' '[:lower:]'
}

# Find all markdown files with spaces and rename them
find /Users/moltisantid/Personal/stAItuned/website/cms/articles -name "*.md" | while read file; do
    # Get directory and filename
    dir=$(dirname "$file")
    filename=$(basename "$file")
    
    # Check if filename contains spaces or special characters
    if [[ "$filename" =~ [[:space:]] || "$filename" =~ [èàùòìé] ]]; then
        # Create new filename
        new_filename=$(to_kebab_case "$filename")
        new_file="$dir/$new_filename"
        
        echo "Renaming: $file -> $new_file"
        mv "$file" "$new_file"
    fi
done
