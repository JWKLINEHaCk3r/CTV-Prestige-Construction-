#!/bin/bash

echo "🖼️ Quick Image Loading Test"
echo "=========================="

# Test image loading through local server
echo "Testing image loading via local server..."

# Test each image
images=(
  "assets/sample-photos/welding/welding-project-1.jpg"
  "assets/sample-photos/welding/welding-project-2.jpg"
  "assets/sample-photos/container-repair/container-repair-1.jpg"
  "assets/sample-photos/container-repair/container-repair-2.jpg"
  "assets/sample-photos/pressure-washing/pressure-washing-1.jpg"
  "assets/sample-photos/pressure-washing/pressure-washing-2.jpg"
  "assets/Finallogo.png"
)

all_good=true

for image in "${images[@]}"; do
  if curl -s -o /dev/null -w "%{http_code}" "http://localhost:8000/$image" | grep -q "200"; then
    echo "✅ $image - Accessible"
  else
    echo "❌ $image - Not accessible"
    all_good=false
  fi
done

echo ""
if [ "$all_good" = true ]; then
  echo "🎉 ALL IMAGES LOADING SUCCESSFULLY!"
  echo "The website is working perfectly through the local server."
else
  echo "⚠️  Some images failed to load. Check the paths and file permissions."
fi

echo ""
echo "🌐 Website URL: http://localhost:8000"
