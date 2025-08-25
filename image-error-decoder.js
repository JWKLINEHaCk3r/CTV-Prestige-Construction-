/**
 * CTV PRESTIGE CONSTRUCTION - IMAGE ERROR DECODER & FIXER
 * Comprehensive solution for detecting and fixing image loading issues
 */

class ImageErrorDecoder {
    constructor() {
        this.errors = [];
        this.fixes = [];
        this.diagnostics = {
            totalImages: 0,
            loadedImages: 0,
            failedImages: 0,
            missingImages: 0,
            brokenUrls: 0
        };
        this.init();
    }

    init() {
        console.log('🔧 CTV Image Error Decoder - Initializing...');
        this.scanAllImages();
        this.setupErrorHandlers();
        this.createDiagnosticPanel();
        this.runDiagnostics();
    }

    scanAllImages() {
        const allImages = document.querySelectorAll('img');
        this.diagnostics.totalImages = allImages.length;
        
        console.log(`📊 Found ${allImages.length} images to analyze`);
        
        allImages.forEach((img, index) => {
            this.analyzeImage(img, index);
        });
    }

    analyzeImage(img, index) {
        const src = img.getAttribute('src') || img.src;
        const alt = img.getAttribute('alt') || 'No alt text';
        const isVisible = img.offsetWidth > 0 && img.offsetHeight > 0;
        
        const imageData = {
            element: img,
            index: index,
            src: src,
            alt: alt,
            isVisible: isVisible,
            status: 'unknown',
            errors: []
        };

        // Check for obvious issues
        if (!src || src === '') {
            imageData.status = 'empty-src';
            imageData.errors.push('Empty or missing src attribute');
            this.diagnostics.missingImages++;
        } else if (src.includes('20230428_081145')) {
            imageData.status = 'broken-filename';
            imageData.errors.push('Known broken filename detected');
            this.diagnostics.brokenUrls++;
        } else if (src.startsWith('blob:') && !src.startsWith('data:')) {
            imageData.status = 'invalid-blob';
            imageData.errors.push('Invalid blob URL (likely expired)');
            this.diagnostics.brokenUrls++;
        } else {
            // Test if image actually loads
            this.testImageLoad(img, imageData);
        }

        if (imageData.errors.length > 0) {
            this.errors.push(imageData);
            console.warn(`❌ Image ${index + 1}: ${imageData.errors.join(', ')}`, img);
        }
    }

    testImageLoad(img, imageData) {
        const testImg = new Image();
        
        testImg.onload = () => {
            imageData.status = 'loaded';
            this.diagnostics.loadedImages++;
            console.log(`✅ Image ${imageData.index + 1}: Loaded successfully`);
        };
        
        testImg.onerror = () => {
            imageData.status = 'load-error';
            imageData.errors.push('Failed to load from server');
            this.diagnostics.failedImages++;
            this.errors.push(imageData);
            console.error(`❌ Image ${imageData.index + 1}: Load failed`, img);
            this.applyFallbackForImage(img, imageData);
        };
        
        testImg.src = img.src;
    }

    setupErrorHandlers() {
        // Global image error handler
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                this.handleImageError(e.target);
            }
        }, true);

        // Monitor new images added dynamically
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const newImages = node.tagName === 'IMG' ? [node] : node.querySelectorAll('img');
                        newImages.forEach(img => this.analyzeImage(img, this.diagnostics.totalImages++));
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    handleImageError(img) {
        console.warn('🚨 Runtime image error detected:', img.src);
        
        const errorData = {
            element: img,
            src: img.src,
            alt: img.alt,
            status: 'runtime-error',
            errors: ['Runtime loading error'],
            timestamp: new Date().toISOString()
        };
        
        this.errors.push(errorData);
        this.applyFallbackForImage(img, errorData);
        this.updateDiagnosticPanel();
    }

    applyFallbackForImage(img, imageData) {
        // Determine appropriate fallback based on context
        let fallbackType = 'generic';
        let fallbackIcon = '🏗️';
        let fallbackText = 'CTV PRESTIGE CONSTRUCTION';
        let fallbackColor = '#ff7700';

        if (imageData.alt.toLowerCase().includes('welding')) {
            fallbackType = 'welding';
            fallbackIcon = '⚡';
            fallbackText = 'PROFESSIONAL WELDING';
        } else if (imageData.alt.toLowerCase().includes('container')) {
            fallbackType = 'container';
            fallbackIcon = '🚛';
            fallbackText = 'CONTAINER REPAIR';
        } else if (imageData.alt.toLowerCase().includes('pressure')) {
            fallbackType = 'pressure';
            fallbackIcon = '💧';
            fallbackText = 'PRESSURE WASHING';
            fallbackColor = '#00aaff';
        } else if (imageData.alt.toLowerCase().includes('logo') || imageData.src.includes('logo')) {
            fallbackType = 'logo';
            fallbackIcon = 'CTV';
            fallbackText = 'PRESTIGE CONSTRUCTION';
        }

        // Apply fallback styling
        img.style.cssText = `
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            width: 100%;
            height: ${img.closest('.gallery-item') ? '250px' : '64px'};
            background: linear-gradient(135deg, #1a1a1a 0%, #333 50%, #1a1a1a 100%);
            border: 2px solid rgba(255, 119, 0, 0.3);
            border-radius: 12px;
            position: relative;
            font-family: 'Inter', sans-serif;
            color: white;
            text-align: center;
            font-weight: bold;
            font-size: ${fallbackIcon === 'CTV' ? '18px' : '48px'};
            overflow: hidden;
        `;

        // Add fallback content
        img.innerHTML = '';
        img.removeAttribute('src'); // Prevent further loading attempts

        const iconDiv = document.createElement('div');
        iconDiv.textContent = fallbackIcon;
        iconDiv.style.cssText = `
            font-size: ${fallbackIcon === 'CTV' ? '24px' : '48px'};
            color: ${fallbackColor};
            text-shadow: 0 0 20px ${fallbackColor};
            margin-bottom: 10px;
        `;

        const textDiv = document.createElement('div');
        textDiv.textContent = fallbackText;
        textDiv.style.cssText = `
            font-size: 12px;
            background: rgba(0, 0, 0, 0.8);
            padding: 8px 12px;
            border-radius: 6px;
            letter-spacing: 1px;
            position: absolute;
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%);
            width: calc(100% - 30px);
        `;

        if (img.tagName.toLowerCase() === 'img') {
            // Convert img to div for fallback content
            const fallbackDiv = document.createElement('div');
            fallbackDiv.className = img.className;
            fallbackDiv.style.cssText = img.style.cssText;
            fallbackDiv.appendChild(iconDiv);
            fallbackDiv.appendChild(textDiv);
            img.parentNode.replaceChild(fallbackDiv, img);
        }

        this.fixes.push({
            type: 'fallback-applied',
            fallbackType: fallbackType,
            originalSrc: imageData.src,
            timestamp: new Date().toISOString()
        });

        console.log(`🔧 Applied ${fallbackType} fallback for: ${imageData.src}`);
    }

    createDiagnosticPanel() {
        const panel = document.createElement('div');
        panel.id = 'image-diagnostic-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
            border: 1px solid #ff7700;
            border-radius: 8px;
            padding: 8px;
            color: white;
            font-family: 'Inter', monospace;
            font-size: 10px;
            z-index: 10000;
            max-width: 150px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(5px);
            opacity: 0.9;
        `;

        const header = document.createElement('div');
        header.innerHTML = '🔧 Diagnostics';
        header.style.cssText = `
            font-weight: bold;
            color: #ff7700;
            margin-bottom: 5px;
            text-align: center;
            font-size: 9px;
        `;

        const stats = document.createElement('div');
        stats.id = 'diagnostic-stats';
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 2px;
            right: 5px;
            background: none;
            border: none;
            color: #ff7700;
            font-size: 12px;
            cursor: pointer;
            padding: 0;
            width: 15px;
            height: 15px;
            line-height: 12px;
        `;
        closeBtn.onclick = () => panel.style.display = 'none';

        panel.appendChild(closeBtn);
        panel.appendChild(header);
        panel.appendChild(stats);
        document.body.appendChild(panel);

        this.diagnosticPanel = panel;
        this.updateDiagnosticPanel();
    }

    updateDiagnosticPanel() {
        const statsDiv = document.getElementById('diagnostic-stats');
        if (!statsDiv) return;

        const { totalImages, loadedImages, failedImages, missingImages, brokenUrls } = this.diagnostics;
        const successRate = totalImages > 0 ? Math.round((loadedImages / totalImages) * 100) : 0;
        
        // Compact view with minimal information
        statsDiv.innerHTML = `
            <div style="font-size: 8px; line-height: 1.2;">
                <div>📊 ${totalImages} | ✅ ${loadedImages}</div>
                <div>❌ ${failedImages} | 🔧 ${this.fixes.length}</div>
                <div style="color: #00ff88; margin-top: 2px;">
                    ${successRate}% OK
                </div>
                ${failedImages > 0 ? `
                <div style="margin-top: 3px; padding-top: 3px; border-top: 1px solid #444;">
                    <button onclick="console.log(window.imageErrorDecoder.errors)" style="
                        background: #ff7700;
                        border: none;
                        color: white;
                        padding: 2px 4px;
                        border-radius: 3px;
                        cursor: pointer;
                        font-size: 7px;
                    ">View Errors</button>
                </div>
                ` : ''}
            </div>
        `;
    }

    runDiagnostics() {
        setTimeout(() => {
            this.updateDiagnosticPanel();
            console.log('📋 CTV Image Diagnostics Complete:');
            console.log('Total Images:', this.diagnostics.totalImages);
            console.log('Loaded Successfully:', this.diagnostics.loadedImages);
            console.log('Failed to Load:', this.diagnostics.failedImages);
            console.log('Missing Sources:', this.diagnostics.missingImages);
            console.log('Broken URLs:', this.diagnostics.brokenUrls);
            console.log('Fixes Applied:', this.fixes.length);
            
            if (this.errors.length > 0) {
                console.group('🚨 Image Errors Detected:');
                this.errors.forEach((error, i) => {
                    console.warn(`${i + 1}. ${error.errors.join(', ')}`, error.element);
                });
                console.groupEnd();
            }

            // Auto-hide panel after 30 seconds if no errors
            if (this.errors.length === 0) {
                setTimeout(() => {
                    if (this.diagnosticPanel) {
                        this.diagnosticPanel.style.display = 'none';
                    }
                }, 30000);
            }
        }, 2000);
    }

    // Public method to manually trigger diagnostics
    refresh() {
        this.errors = [];
        this.fixes = [];
        this.diagnostics = {
            totalImages: 0,
            loadedImages: 0,
            failedImages: 0,
            missingImages: 0,
            brokenUrls: 0
        };
        this.scanAllImages();
        this.runDiagnostics();
    }

    // Export diagnostic report
    exportReport() {
        const report = {
            timestamp: new Date().toISOString(),
            diagnostics: this.diagnostics,
            errors: this.errors.map(e => ({
                src: e.src,
                alt: e.alt,
                status: e.status,
                errors: e.errors
            })),
            fixes: this.fixes,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        console.log('📄 CTV Image Diagnostic Report:', report);
        return report;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.ctvImageDecoder = new ImageErrorDecoder();
    });
} else {
    window.ctvImageDecoder = new ImageErrorDecoder();
}

// Global functions for manual diagnostics
window.refreshImageDiagnostics = () => window.ctvImageDecoder?.refresh();
window.exportImageReport = () => window.ctvImageDecoder?.exportReport();

console.log('🔧 CTV Image Error Decoder loaded - Use refreshImageDiagnostics() or exportImageReport() in console');
