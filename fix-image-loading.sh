#!/bin/bash

# CTV Prestige Construction - Image Loading Fix Script
echo "🔧 CTV Image Loading Fix Script Starting..."
echo "========================================"

# Define image paths
WELDING_DIR="assets/sample-photos/welding"
CONTAINER_DIR="assets/sample-photos/container-repair"
PRESSURE_DIR="assets/sample-photos/pressure-washing"

# Array of all image files that should exist
declare -a REQUIRED_IMAGES=(
    "$WELDING_DIR/welding-project-1.jpg"
    "$WELDING_DIR/welding-project-2.jpg" 
    "$CONTAINER_DIR/container-repair-1.jpg"
    "$CONTAINER_DIR/container-repair-2.jpg"
    "$PRESSURE_DIR/pressure-washing-1.jpg"
    "$PRESSURE_DIR/pressure-washing-2.jpg"
)

echo ""
echo "📋 Phase 1: File Existence Check"
echo "--------------------------------"

MISSING_FILES=0
for image in "${REQUIRED_IMAGES[@]}"; do
    if [ -f "$image" ]; then
        echo "✅ Found: $image"
    else
        echo "❌ Missing: $image"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
done

echo ""
echo "🔐 Phase 2: Setting File Permissions"
echo "------------------------------------"

for image in "${REQUIRED_IMAGES[@]}"; do
    if [ -f "$image" ]; then
        chmod 644 "$image"
        echo "✅ Set permissions 644 for: $image"
    fi
done

echo ""
echo "📊 Phase 3: File Information"
echo "---------------------------"

for image in "${REQUIRED_IMAGES[@]}"; do
    if [ -f "$image" ]; then
        SIZE=$(ls -lh "$image" | awk '{print $5}')
        PERMISSIONS=$(ls -l "$image" | awk '{print $1}')
        echo "📄 $image"
        echo "   Size: $SIZE"
        echo "   Permissions: $PERMISSIONS"
        echo ""
    fi
done

echo ""
echo "🌐 Phase 4: Directory Structure Check"
echo "------------------------------------"

echo "📁 Welding directory:"
ls -la "$WELDING_DIR/" 2>/dev/null || echo "❌ Directory not found: $WELDING_DIR"

echo ""
echo "📁 Container repair directory:"
ls -la "$CONTAINER_DIR/" 2>/dev/null || echo "❌ Directory not found: $CONTAINER_DIR"

echo ""
echo "📁 Pressure washing directory:"
ls -la "$PRESSURE_DIR/" 2>/dev/null || echo "❌ Directory not found: $PRESSURE_DIR"

echo ""
echo "🔧 Phase 5: HTML Reference Check"
echo "-------------------------------"

echo "Checking index.html for image references..."
if [ -f "index.html" ]; then
    echo "📄 Images referenced in index.html:"
    grep -o 'assets/sample-photos/[^"]*\.jpg' index.html | sort | uniq
else
    echo "❌ index.html not found"
fi

echo ""
echo "📋 SUMMARY REPORT"
echo "================="

if [ $MISSING_FILES -eq 0 ]; then
    echo "✅ All required images found and accessible"
    echo "✅ File permissions set to 644"
    echo "✅ Directory structure is correct"
    echo ""
    echo "🎉 SUCCESS: All image loading issues should now be resolved!"
    echo ""
    echo "Next steps:"
    echo "1. Open image-diagnostic-test.html in your browser"
    echo "2. Start a local server: python3 -m http.server 8000"
    echo "3. Navigate to http://localhost:8000/image-diagnostic-test.html"
    echo "4. Verify all images load correctly"
else
    echo "❌ $MISSING_FILES image file(s) missing"
    echo "⚠️  Some images may not load correctly"
    echo ""
    echo "Required actions:"
    echo "1. Ensure all image files are present"
    echo "2. Check if image files were moved or renamed"
    echo "3. Verify directory structure is correct"
fi

echo ""
echo "🔧 Additional Debugging Commands:"
echo "================================="
echo "• Test all images: find assets/sample-photos -name '*.jpg' -type f"
echo "• Check permissions: ls -la assets/sample-photos/*/*.jpg"
echo "• Start test server: python3 -m http.server 8000"
echo "• Open diagnostic page: open http://localhost:8000/image-diagnostic-test.html"
echo ""
echo "Script completed at $(date)"
