// CTV Image Loading Test and Fix Script
console.log('🔧 CTV Image Loading Diagnostics Starting...');

const requiredImages = [
    'assets/sample-photos/welding/welding-project-1.jpg',
    'assets/sample-photos/welding/welding-project-2.jpg',
    'assets/sample-photos/container-repair/container-repair-1.jpg', 
    'assets/sample-photos/container-repair/container-repair-2.jpg',
    'assets/sample-photos/pressure-washing/pressure-washing-1.jpg',
    'assets/sample-photos/pressure-washing/pressure-washing-2.jpg'
];

let totalImages = requiredImages.length;
let loadedImages = 0;
let errorImages = 0;
const results = [];

function testImageLoad(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const startTime = performance.now();
        
        img.onload = function() {
            const loadTime = Math.round(performance.now() - startTime);
            const result = {
                src: src,
                status: 'success',
                width: this.naturalWidth,
                height: this.naturalHeight,
                loadTime: loadTime,
                fileSize: 'Unknown'
            };
            
            console.log(`✅ ${src} - Loaded successfully (${this.naturalWidth}x${this.naturalHeight}px, ${loadTime}ms)`);
            loadedImages++;
            resolve(result);
        };
        
        img.onerror = function() {
            const result = {
                src: src,
                status: 'error',
                error: 'Failed to load',
                loadTime: Math.round(performance.now() - startTime)
            };
            
            console.error(`❌ ${src} - Failed to load`);
            errorImages++;
            reject(result);
        };
        
        img.src = src;
    });
}

async function runImageDiagnostics() {
    console.log(`\n📊 Testing ${totalImages} required images...\n`);
    
    const promises = requiredImages.map(async (src, index) => {
        console.log(`🔍 Testing ${index + 1}/${totalImages}: ${src}`);
        
        try {
            const result = await testImageLoad(src);
            results.push(result);
            return result;
        } catch (error) {
            results.push(error);
            return error;
        }
    });
    
    try {
        await Promise.all(promises);
    } catch (error) {
        // Some images failed, but continue with report
    }
    
    // Generate comprehensive report
    setTimeout(generateReport, 500);
}

function generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 CTV IMAGE LOADING DIAGNOSTIC REPORT');
    console.log('='.repeat(60));
    
    const successRate = Math.round((loadedImages / totalImages) * 100);
    
    console.log(`\n📈 SUMMARY STATISTICS:`);
    console.log(`   Total Images: ${totalImages}`);
    console.log(`   Successfully Loaded: ${loadedImages}`);
    console.log(`   Failed to Load: ${errorImages}`);
    console.log(`   Success Rate: ${successRate}%`);
    
    if (loadedImages === totalImages) {
        console.log('\n🎉 SUCCESS: All images loaded correctly!');
        console.log('✅ No fixes needed - your image loading is working perfectly');
    } else {
        console.log('\n🚨 ISSUES DETECTED:');
        
        const failedImages = results.filter(r => r.status === 'error');
        failedImages.forEach((failed, index) => {
            console.log(`\n❌ Failed Image ${index + 1}:`);
            console.log(`   Path: ${failed.src}`);
            console.log(`   Error: ${failed.error}`);
            console.log(`   Suggested Fixes:`);
            console.log(`     • Verify file exists: Check if ${failed.src} exists`);
            console.log(`     • Check permissions: chmod 644 ${failed.src}`);
            console.log(`     • Test direct access in browser`);
            console.log(`     • Verify server is serving static files`);
        });
        
        console.log('\n🔧 RECOMMENDED ACTIONS:');
        console.log('   1. Run the fix script: ./fix-image-loading.sh');
        console.log('   2. Open diagnostic page: image-diagnostic-test.html');
        console.log('   3. Start local server: python3 -m http.server 8000');
        console.log('   4. Check browser console for additional errors');
    }
    
    console.log('\n📊 DETAILED RESULTS:');
    results.forEach((result, index) => {
        if (result.status === 'success') {
            console.log(`${index + 1}. ✅ ${result.src}`);
            console.log(`     Size: ${result.width}x${result.height}px`);
            console.log(`     Load Time: ${result.loadTime}ms`);
        } else {
            console.log(`${index + 1}. ❌ ${result.src}`);
            console.log(`     Error: ${result.error}`);
        }
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('Diagnostic completed at:', new Date().toLocaleString());
    console.log('='.repeat(60));
}

// Auto-run diagnostics if in browser
if (typeof window !== 'undefined') {
    // Browser environment
    console.log('🌐 Running in browser environment');
    runImageDiagnostics();
} else {
    // Node.js environment
    console.log('🖥️  Running in Node.js environment');
    console.log('⚠️  Image loading tests require browser environment');
    console.log('💡 To test images:');
    console.log('   1. Open image-diagnostic-test.html in browser');
    console.log('   2. Or include this script in your HTML page');
}

// Export for use in other scripts
if (typeof module !== 'undefined') {
    module.exports = { runImageDiagnostics, testImageLoad };
}
