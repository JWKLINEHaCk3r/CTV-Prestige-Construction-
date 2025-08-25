// Quick Image Test for Lower Portfolio Pictures
const portfolioImages = [
    'assets/sample-photos/welding/welding-project-2.jpg',
    'assets/sample-photos/container-repair/container-repair-2.jpg',
    'assets/sample-photos/pressure-washing/pressure-washing-2.jpg'
];

console.log('🔍 Testing Lower Portfolio Images...');

portfolioImages.forEach((src, index) => {
    const img = new Image();
    
    img.onload = function() {
        console.log(`✅ Image ${index + 1}: ${src} - LOADED SUCCESSFULLY`);
        console.log(`   Dimensions: ${this.naturalWidth}x${this.naturalHeight}px`);
    };
    
    img.onerror = function() {
        console.error(`❌ Image ${index + 1}: ${src} - FAILED TO LOAD`);
    };
    
    img.src = src;
});

// Also check if images are properly styled
setTimeout(() => {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    console.log(`\n📊 Found ${portfolioItems.length} portfolio items in DOM`);
    
    portfolioItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.portfolio-overlay');
        
        console.log(`Portfolio Item ${index + 1}:`);
        console.log(`  Image src: ${img?.src || 'NO SOURCE'}`);
        console.log(`  Image loaded: ${img?.complete && img?.naturalWidth > 0 ? 'YES' : 'NO'}`);
        console.log(`  Has overlay: ${overlay ? 'YES' : 'NO'}`);
        console.log(`  Computed height: ${getComputedStyle(img || {}).height || 'UNKNOWN'}`);
    });
}, 1000);
