// ENHANCED IMAGE RECOVERY SCRIPT - Creates working sample images
class ImageRecoverySystem {
    constructor() {
        this.placeholderCache = new Map();
        this.init();
    }

    init() {
        console.log('🖼️ CTV Image Recovery System - Initializing...');
        this.createPlaceholderImages();
        this.setupImageErrorHandling();
        this.processExistingImages();
    }

    createPlaceholderImage(text, bgColor, textColor, icon, width = 400, height = 300) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, bgColor);
        gradient.addColorStop(0.5, '#2a2a2a');
        gradient.addColorStop(1, '#000000');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Add subtle pattern
        ctx.fillStyle = 'rgba(255, 119, 0, 0.05)';
        for (let i = 0; i < width; i += 40) {
            ctx.fillRect(i, 0, 2, height);
        }
        
        // Add border
        ctx.strokeStyle = '#FF7700';
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, width - 4, height - 4);
        
        // Add icon
        ctx.font = `bold ${Math.min(width/8, 48)}px Arial`;
        ctx.fillStyle = '#FF7700';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#FF7700';
        ctx.shadowBlur = 10;
        ctx.fillText(icon, width/2, height/3);
        
        // Reset shadow
        ctx.shadowBlur = 0;
        
        // Add main text
        ctx.font = `bold ${Math.min(width/20, 20)}px Arial`;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.fillText(text, width/2, height/2);
        
        // Add company name
        ctx.font = `bold ${Math.min(width/25, 16)}px Arial`;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('CTV PRESTIGE CONSTRUCTION', width/2, height/1.6);
        
        // Add tagline
        ctx.font = `${Math.min(width/28, 14)}px Arial`;
        ctx.fillStyle = '#CCCCCC';
        ctx.fillText('Professional Mobile Welding Services', width/2, height/1.4);
        
        return canvas.toDataURL('image/png');
    }

    createPlaceholderImages() {
        // Create high-quality placeholder images
        const placeholders = [
            {
                keys: ['welding-project-1.jpg', 'welding'],
                image: this.createPlaceholderImage('PROFESSIONAL WELDING', '#1a1a1a', '#FFFFFF', '⚡')
            },
            {
                keys: ['welding-project-2.jpg', 'expert-repairs'],
                image: this.createPlaceholderImage('EXPERT REPAIRS', '#1a1a1a', '#FFFFFF', '🔧')
            },
            {
                keys: ['container-repair-1.jpg', 'container'],
                image: this.createPlaceholderImage('CONTAINER RESTORATION', '#1a1a1a', '#FFFFFF', '🚛')
            },
            {
                keys: ['container-repair-2.jpg', 'quality'],
                image: this.createPlaceholderImage('QUALITY ASSURED', '#1a1a1a', '#FFFFFF', '✅')
            },
            {
                keys: ['pressure-washing-1.jpg', 'pressure'],
                image: this.createPlaceholderImage('PRESSURE CLEANING', '#1a1a1a', '#FFFFFF', '💧')
            },
            {
                keys: ['pressure-washing-2.jpg', 'pristine'],
                image: this.createPlaceholderImage('PRISTINE RESULTS', '#1a1a1a', '#FFFFFF', '🌟')
            }
        ];

        // Cache all placeholders
        placeholders.forEach(placeholder => {
            placeholder.keys.forEach(key => {
                this.placeholderCache.set(key, placeholder.image);
            });
        });

        // Create logo placeholder
        const logoPlaceholder = this.createPlaceholderImage('CTV', '#FF7700', '#FFFFFF', 'CTV', 200, 200);
        this.placeholderCache.set('logo', logoPlaceholder);
        this.placeholderCache.set('Finallogo.png', logoPlaceholder);
        this.placeholderCache.set('ctv-correct-logo.png.png', logoPlaceholder);
        this.placeholderCache.set('ctv-professional-logo.svg', logoPlaceholder);

        console.log(`📦 Created ${this.placeholderCache.size} placeholder images`);
    }

    setupImageErrorHandling() {
        // Global error handler for all images
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                this.handleImageError(e.target);
            }
        }, true);

        // Monitor for dynamically added images
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const newImages = node.tagName === 'IMG' ? [node] : node.querySelectorAll('img');
                        newImages.forEach(img => this.processImage(img));
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    handleImageError(img) {
        console.warn('🚨 Image error detected:', img.src);
        
        const filename = img.src.split('/').pop();
        const alt = img.alt?.toLowerCase() || '';
        
        // Find best matching placeholder
        let placeholderKey = filename;
        
        // Try to match by filename first
        if (!this.placeholderCache.has(placeholderKey)) {
            // Try to match by alt text content
            for (const [key] of this.placeholderCache) {
                if (alt.includes(key.replace(/[-_]/g, ' ').toLowerCase())) {
                    placeholderKey = key;
                    break;
                }
            }
        }
        
        // Fallback to generic placeholder based on context
        if (!this.placeholderCache.has(placeholderKey)) {
            if (alt.includes('welding')) placeholderKey = 'welding';
            else if (alt.includes('container')) placeholderKey = 'container';
            else if (alt.includes('pressure')) placeholderKey = 'pressure';
            else if (alt.includes('logo')) placeholderKey = 'logo';
            else placeholderKey = 'welding'; // Default to welding
        }

        const placeholder = this.placeholderCache.get(placeholderKey);
        if (placeholder) {
            img.src = placeholder;
            img.onerror = null; // Prevent infinite loop
            console.log(`✅ Applied placeholder for: ${filename}`);
        }
    }

    processImage(img) {
        // Check if image is already broken
        if (img.complete && img.naturalWidth === 0 && img.src) {
            this.handleImageError(img);
        } else {
            // Set up error handler for future errors
            img.onerror = () => this.handleImageError(img);
        }
    }

    processExistingImages() {
        const allImages = document.querySelectorAll('img');
        console.log(`🔍 Processing ${allImages.length} existing images...`);
        
        allImages.forEach(img => this.processImage(img));
        
        console.log('✅ All existing images processed');
    }

    // Public method to refresh all images
    refresh() {
        console.log('🔄 Refreshing image recovery system...');
        this.processExistingImages();
    }

    // Public method to get diagnostic info
    getDiagnostics() {
        return {
            placeholderCount: this.placeholderCache.size,
            availablePlaceholders: Array.from(this.placeholderCache.keys())
        };
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.ctvImageRecovery = new ImageRecoverySystem();
    });
} else {
    window.ctvImageRecovery = new ImageRecoverySystem();
}

// Global function for manual refresh
window.refreshImageRecovery = () => window.ctvImageRecovery?.refresh();

console.log('🖼️ Enhanced Image Recovery System loaded - Use refreshImageRecovery() in console');
