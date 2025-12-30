#!/bin/bash
# Quick validation that all the new API routes exist

echo "Checking API route files..."

routes=(
  "src/app/api/articles/[id]/like/route.ts"
  "src/app/api/articles/[id]/comment/route.ts"
  "src/app/api/articles/comment/[pk]/like/route.ts"
  "src/app/api/articles/comment/[pk]/reply/route.ts"
)

all_exist=true

for route in "${routes[@]}"; do
  if [ -f "$route" ]; then
    echo "✓ $route exists"
  else
    echo "✗ $route MISSING"
    all_exist=false
  fi
done

if [ "$all_exist" = true ]; then
  echo ""
  echo "All API routes exist!"
  exit 0
else
  echo ""
  echo "Some routes are missing!"
  exit 1
fi
