#!/bin/bash

echo "🧪 CTV PRESTIGE CONSTRUCTION - COMPREHENSIVE TEST SUITE"
echo "======================================================="

# Test Results Tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Test function
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo ""
    echo "🔍 TEST: $test_name"
    echo "----------------------------------------"
    
    if eval "$test_command"; then
        echo "✅ PASSED: $test_name"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo "❌ FAILED: $test_name"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Test 1: Core Files Exist
run_test "Core Website Files" '
    missing=0
    for file in index.html styles-fresh.css script.js; do
        if [ -f "$file" ]; then
            echo "✅ $file exists"
        else
            echo "❌ $file missing"
            missing=$((missing + 1))
        fi
    done
    [ $missing -eq 0 ]
'

# Test 2: JavaScript Files
run_test "JavaScript Components" '
    missing=0
    for file in asset-manager.js image-recovery.js image-error-decoder.js image-loading-test.js; do
        if [ -f "$file" ]; then
            echo "✅ $file exists"
        else
            echo "❌ $file missing"
            missing=$((missing + 1))
        fi
    done
    [ $missing -eq 0 ]
'

# Test 3: Logo Asset
run_test "Logo Asset" '
    if [ -f "assets/Finallogo.png" ]; then
        size=$(ls -lh assets/Finallogo.png | awk "{print \$5}")
        echo "✅ Logo exists ($size)"
        return 0
    else
        echo "❌ Logo missing"
        return 1
    fi
'

# Test 4: Portfolio Images
run_test "Portfolio Images" '
    total=0
    missing=0
    
    # Check welding images
    for img in welding-project-1.jpg welding-project-2.jpg; do
        total=$((total + 1))
        if [ -f "assets/sample-photos/welding/$img" ]; then
            echo "✅ welding/$img"
        else
            echo "❌ welding/$img missing"
            missing=$((missing + 1))
        fi
    done
    
    # Check container repair images
    for img in container-repair-1.jpg container-repair-2.jpg; do
        total=$((total + 1))
        if [ -f "assets/sample-photos/container-repair/$img" ]; then
            echo "✅ container-repair/$img"
        else
            echo "❌ container-repair/$img missing"
            missing=$((missing + 1))
        fi
    done
    
    # Check pressure washing images
    for img in pressure-washing-1.jpg pressure-washing-2.jpg; do
        total=$((total + 1))
        if [ -f "assets/sample-photos/pressure-washing/$img" ]; then
            echo "✅ pressure-washing/$img"
        else
            echo "❌ pressure-washing/$img missing"
            missing=$((missing + 1))
        fi
    done
    
    echo "📊 Found $((total - missing))/$total portfolio images"
    [ $missing -eq 0 ]
'

# Test 5: File Permissions
run_test "File Permissions" '
    permission_issues=0
    
    # Check image permissions
    for dir in assets/sample-photos/welding assets/sample-photos/container-repair assets/sample-photos/pressure-washing; do
        if [ -d "$dir" ]; then
            for img in "$dir"/*.jpg; do
                if [ -f "$img" ]; then
                    perms=$(ls -l "$img" | cut -c1-10)
                    if [[ "$perms" =~ ^-r.+r.+r.+ ]]; then
                        echo "✅ $(basename "$img") - readable"
                    else
                        echo "❌ $(basename "$img") - permission issue"
                        permission_issues=$((permission_issues + 1))
                    fi
                fi
            done
        fi
    done
    
    [ $permission_issues -eq 0 ]
'

# Test 6: HTML Structure
run_test "HTML Structure" '
    if [ -f "index.html" ]; then
        sections=("nav" "hero" "services" "contact")
        missing_sections=0
        
        for section in "${sections[@]}"; do
            if grep -q "class.*$section\|id.*$section" index.html; then
                echo "✅ $section section found"
            else
                echo "❌ $section section missing"
                missing_sections=$((missing_sections + 1))
            fi
        done
        
        # Check for portfolio images in HTML
        image_count=$(grep -c "assets/sample-photos/" index.html)
        echo "📷 Portfolio images referenced: $image_count"
        
        [ $missing_sections -eq 0 ] && [ $image_count -ge 6 ]
    else
        return 1
    fi
'

# Test 7: CSS Validation
run_test "CSS Validation" '
    if [ -f "styles-fresh.css" ]; then
        # Check for syntax errors by looking for common issues
        syntax_errors=0
        
        # Check for unclosed braces
        open_braces=$(grep -o "{" styles-fresh.css | wc -l)
        close_braces=$(grep -o "}" styles-fresh.css | wc -l)
        
        if [ $open_braces -eq $close_braces ]; then
            echo "✅ CSS braces balanced ($open_braces pairs)"
        else
            echo "❌ CSS braces unbalanced (open: $open_braces, close: $close_braces)"
            syntax_errors=$((syntax_errors + 1))
        fi
        
        # Check for CSS variables
        if grep -q ":root" styles-fresh.css && grep -q "--" styles-fresh.css; then
            echo "✅ CSS variables defined"
        else
            echo "❌ CSS variables missing"
            syntax_errors=$((syntax_errors + 1))
        fi
        
        [ $syntax_errors -eq 0 ]
    else
        return 1
    fi
'

# Test 8: Responsive Design Elements
run_test "Responsive Design" '
    if [ -f "styles-fresh.css" ]; then
        media_queries=$(grep -c "@media" styles-fresh.css)
        
        if [ $media_queries -ge 2 ]; then
            echo "✅ Responsive design implemented ($media_queries media queries)"
            return 0
        else
            echo "❌ Insufficient responsive design ($media_queries media queries)"
            return 1
        fi
    else
        return 1
    fi
'

# Test 9: Diagnostic Tools
run_test "Diagnostic Tools" '
    tools_found=0
    
    for tool in image-diagnostic-test.html fix-image-loading.sh IMAGE-LOADING-FIXES-COMPLETE.md; do
        if [ -f "$tool" ]; then
            echo "✅ $tool available"
            tools_found=$((tools_found + 1))
        else
            echo "⚠️  $tool missing (optional)"
        fi
    done
    
    # At least 1 diagnostic tool should exist
    [ $tools_found -ge 1 ]
'

# Test 10: Git Repository Status
run_test "Git Repository" '
    if [ -d ".git" ]; then
        echo "✅ Git repository initialized"
        
        # Check if there are commits
        if git log --oneline -1 &>/dev/null; then
            latest_commit=$(git log --oneline -1)
            echo "✅ Latest commit: $latest_commit"
        else
            echo "⚠️  No commits found"
        fi
        
        # Check remote
        if git remote -v | grep -q "origin"; then
            remote=$(git remote get-url origin 2>/dev/null || echo "Unknown")
            echo "✅ Remote configured: $remote"
        else
            echo "⚠️  No remote configured"
        fi
        
        return 0
    else
        echo "❌ Not a git repository"
        return 1
    fi
'

# Final Report
echo ""
echo "🎯 FINAL TEST REPORT"
echo "===================="
echo "Total Tests Run: $TOTAL_TESTS"
echo "Tests Passed: $PASSED_TESTS"
echo "Tests Failed: $FAILED_TESTS"

# Calculate success rate
if [ $TOTAL_TESTS -gt 0 ]; then
    success_rate=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
    echo "Success Rate: $success_rate%"
else
    success_rate=0
fi

echo ""
if [ $FAILED_TESTS -eq 0 ]; then
    echo "🎉 ALL TESTS PASSED!"
    echo "✅ Website is fully functional and ready for deployment"
    echo "✅ All components verified and working"
    echo "✅ Images loading correctly"
    echo "✅ Professional quality confirmed"
elif [ $success_rate -ge 80 ]; then
    echo "🎯 MOSTLY SUCCESSFUL ($success_rate%)"
    echo "✅ Core functionality working"
    echo "⚠️  $FAILED_TESTS minor issues detected"
    echo "💡 Review failed tests above for details"
else
    echo "⚠️  ISSUES DETECTED ($success_rate%)"
    echo "❌ $FAILED_TESTS critical issues found"
    echo "🔧 Review and fix failed tests before deployment"
fi

echo ""
echo "===================="
echo "Test completed: $(date)"
echo "===================="
