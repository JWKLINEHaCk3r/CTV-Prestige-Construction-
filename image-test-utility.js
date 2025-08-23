// CTV Image Test Utility - Comprehensive image loading diagnostics
class ImageTestUtility {
    constructor() {
        this.testResults = [];
        this.expectedImages = [
            'assets/Finallogo.png',
            'assets/sample-photos/welding/welding-project-1.jpg',
            'assets/sample-photos/welding/welding-project-2.jpg',
            'assets/sample-photos/container-repair/container-repair-1.jpg',
            'assets/sample-photos/container-repair/container-repair-2.jpg',
            'assets/sample-photos/pressure-washing/pressure-washing-1.jpg',
            'assets/sample-photos/pressure-washing/pressure-washing-2.jpg'
        ];
        this.init();
    }

    init() {
        console.log('🔍 CTV Image Test Utility - Initializing...');
        this.createTestPanel();
        this.runComprehensiveTests();
    }

    async testImageLoad(url) {
        return new Promise((resolve) => {
            const testImg = new Image();
            const startTime = Date.now();
            
            testImg.onload = () => {
                const loadTime = Date.now() - startTime;
                resolve({
                    url,
                    status: 'loaded',
                    loadTime,
                    width: testImg.naturalWidth,
                    height: testImg.naturalHeight,
                    size: this.getImageSize(url)
                });
            };
            
            testImg.onerror = () => {
                resolve({
                    url,
                    status: 'failed',
                    loadTime: Date.now() - startTime,
                    error: 'Failed to load image',
                    size: this.getImageSize(url)
                });
            };
            
            testImg.src = url;
            
            // Timeout after 5 seconds
            setTimeout(() => {
                if (testImg.complete === false) {
                    resolve({
                        url,
                        status: 'timeout',
                        loadTime: 5000,
                        error: 'Load timeout after 5 seconds'
                    });
                }
            }, 5000);
        });
    }

    getImageSize(url) {
        // This would need server-side implementation for actual file size
        // For now, we'll return estimated sizes based on typical image types
        if (url.endsWith('.png')) return '50-200KB (estimated)';
        if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return '100-500KB (estimated)';
        return 'Unknown size';
    }

    async runComprehensiveTests() {
        console.log('🧪 Running comprehensive image tests...');
        
        const results = [];
        
        // Test all expected images
        for (const imageUrl of this.expectedImages) {
            const result = await this.testImageLoad(imageUrl);
            results.push(result);
            console.log(`${result.status === 'loaded' ? '✅' : '❌'} ${imageUrl}: ${result.status}`);
        }
        
        this.testResults = results;
        this.updateTestPanel();
        
        // Generate comprehensive report
        this.generateReport();
    }

    createTestPanel() {
        const panel = document.createElement('div');
        panel.id = 'image-test-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
            border: 2px solid #00aaff;
            border-radius: 12px;
            padding: 15px;
            color: white;
            font-family: 'Inter', monospace;
            font-size: 12px;
            z-index: 10001;
            max-width: 400px;
            max-height: 500px;
            overflow-y: auto;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
        `;

        const header = document.createElement('div');
        header.innerHTML = '🔍 CTV Image Test Utility';
        header.style.cssText = `
            font-weight: bold;
            color: #00aaff;
            margin-bottom: 10px;
            text-align: center;
        `;

        const content = document.createElement('div');
        content.id = 'test-results-content';
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 10px;
            background: none;
            border: none;
            color: #00aaff;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
        `;
        closeBtn.onclick = () => panel.style.display = 'none';

        panel.appendChild(closeBtn);
        panel.appendChild(header);
        panel.appendChild(content);
        document.body.appendChild(panel);

        this.testPanel = panel;
    }

    updateTestPanel() {
        const content = document.getElementById('test-results-content');
        if (!content) return;

        const loaded = this.testResults.filter(r => r.status === 'loaded').length;
        const failed = this.testResults.filter(r => r.status !== 'loaded').length;
        const total = this.testResults.length;

        let html = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px;">
                <div>📊 Total: <span style="color: #00aaff;">${total}</span></div>
                <div>✅ Loaded: <span style="color: #00ff88;">${loaded}</span></div>
                <div>❌ Failed: <span style="color: #ff4444;">${failed}</span></div>
                <div>📈 Success: <span style="color: ${loaded === total ? '#00ff88' : '#ffaa00'};">${Math.round((loaded / total) * 100)}%</span></div>
            </div>
        `;

        // Detailed results
        html += '<div style="max-height: 300px; overflow-y: auto; font-size: 11px;">';
        
        this.testResults.forEach((result, index) => {
            const statusColor = result.status === 'loaded' ? '#00ff88' : '#ff4444';
            const statusIcon = result.status === 'loaded' ? '✅' : '❌';
            const filename = result.url.split('/').pop();
            
            html += `
                <div style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 6px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: ${statusColor}; font-weight: bold;">${statusIcon} ${filename}</span>
                        <span style="color: #ccc; font-size: 10px;">${result.status}</span>
                    </div>
                    <div style="font-size: 9px; color: #888; margin-top: 4px;">
                        Path: ${result.url}<br>
                        ${result.loadTime ? `Load time: ${result.loadTime}ms` : ''}
                        ${result.size ? ` | Size: ${result.size}` : ''}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';

        // Action buttons
        html += `
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #444;">
                <button onclick="window.imageTestUtility?.runComprehensiveTests()" style="
                    background: #00aaff;
                    border: none;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 10px;
                    margin-right: 8px;
                ">🔄 Retest</button>
                
                <button onclick="window.imageTestUtility?.showFixSuggestions()" style="
                    background: #ff7700;
                    border: none;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 10px;
                ">🔧 Fix Suggestions</button>
            </div>
        `;

        content.innerHTML = html;
    }

    generateReport() {
        const failedImages = this.testResults.filter(r => r.status !== 'loaded');
        
        console.group('📄 CTV Image Test Report');
        console.log('Total Images Tested:', this.testResults.length);
        console.log('Successfully Loaded:', this.testResults.filter(r => r.status === 'loaded').length);
        console.log('Failed to Load:', failedImages.length);
        console.log('Success Rate:', Math.round((this.testResults.filter(r => r.status === 'loaded').length / this.testResults.length) * 100) + '%');
        
        if (failedImages.length > 0) {
            console.group('🚨 Failed Images:');
            failedImages.forEach(image => {
                console.warn('❌', image.url, '-', image.error || 'Unknown error');
            });
            console.groupEnd();
        }
        
        console.groupEnd();
    }

    showFixSuggestions() {
        const failedImages = this.testResults.filter(r => r.status !== 'loaded');
        
        if (failedImages.length === 0) {
            alert('🎉 All images are loading successfully! No fixes needed.');
            return;
        }

        let suggestions = '🔧 Image Loading Fix Suggestions:\n\n';
        
        failedImages.forEach(image => {
            suggestions += `❌ ${image.url.split('/').pop()}\n`;
            
            if (image.url.includes('sample-photos')) {
                suggestions += `   → Check file exists: ls assets/sample-photos/*/*.jpg\n`;
                suggestions += `   → Verify file permissions: chmod 644 ${image.url}\n`;
                suggestions += `   → Test direct access: open ${image.url} in browser\n\n`;
            } else {
                suggestions += `   → Verify file exists at: ${image.url}\n`;
                suggestions += `   → Check server configuration for static files\n\n`;
            }
        });

        suggestions += '💡 General Tips:\n';
        suggestions += '• Run: python -m http.server 8000 (for local testing)\n';
        suggestions += '• Check browser console for CORS errors\n';
        suggestions += '• Verify all image paths are correct\n';

        alert(suggestions);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.imageTestUtility = new ImageTestUtility();
    });
} else {
    window.imageTestUtility = new ImageTestUtility();
}

// Global functions
window.runImageTests = () => window.imageTestUtility?.runComprehensiveTests();
window.showImageFixSuggestions = () => window.imageTestUtility?.showFixSuggestions();

console.log('🔍 CTV Image Test Utility loaded - Use runImageTests() or showImageFixSuggestions() in console');
