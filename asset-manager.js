// CTV Prestige Construction - Asset Reference Manager
// This file helps manage and reference logo assets throughout the website

class AssetManager {
    constructor() {
        this.logoAssets = {
            primary: 'assets/ctv-logo-optimized.svg',
            fallback: 'assets/ctv-logo-final.png',
            variations: [
                'assets/ctv-logo.svg',
                'assets/ctv-logo-ultimate.png',
                'assets/ctv-logo-professional.png'
            ]
        };
        
        this.brandColors = {
            primary: '#FF7700',
            primaryDark: '#FF5500', 
            primaryLight: '#FF9930',
            silver: '#C0C0C0',
            darkSilver: '#A8A8A8',
            lightSilver: '#E8E8E8',
            black: '#000000',
            gold: '#FFD700'
        };
        
        this.placeholderReplacements = {
            heroImage: this.createHeroPlaceholder.bind(this),
            serviceCard: this.createServiceCardPlaceholder.bind(this),
            galleryPlaceholder: this.createGalleryPlaceholder.bind(this),
            backgroundPattern: this.createBackgroundPattern.bind(this)
        };
    }

    // Get the primary logo for navigation and main branding
    getPrimaryLogo() {
        return this.logoAssets.primary;
    }

    // Get logo with fallback for older browsers
    getLogoWithFallback() {
        return {
            svg: this.logoAssets.primary,
            png: this.logoAssets.fallback
        };
    }

    // Create branded hero section placeholder
    createHeroPlaceholder() {
        return `
        <div class="hero-logo-background" style="
            background: linear-gradient(135deg, ${this.brandColors.black} 0%, ${this.brandColors.primaryDark} 100%);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
        ">
            <img src="${this.logoAssets.primary}" alt="CTV Prestige Construction" 
                 style="height: 200px; opacity: 0.8; filter: drop-shadow(0 0 30px ${this.brandColors.primary});">
        </div>
        `;
    }

    // Create service card with logo elements
    createServiceCardPlaceholder(serviceName) {
        return `
        <div class="service-card-branded" style="
            background: linear-gradient(135deg, ${this.brandColors.black} 0%, rgba(255, 119, 0, 0.1) 100%);
            border: 2px solid ${this.brandColors.primary};
            border-radius: 12px;
            padding: 20px;
            text-align: center;
        ">
            <div style="
                width: 60px;
                height: 60px;
                margin: 0 auto 15px;
                background: ${this.brandColors.primary};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <span style="color: white; font-weight: bold; font-size: 24px;">
                    ${serviceName.charAt(0)}
                </span>
            </div>
            <h3 style="color: ${this.brandColors.primary};">${serviceName}</h3>
        </div>
        `;
    }

    // Create gallery placeholder with branding
    createGalleryPlaceholder() {
        return `
        <div class="gallery-placeholder" style="
            background: linear-gradient(45deg, ${this.brandColors.silver} 0%, ${this.brandColors.lightSilver} 100%);
            border: 3px dashed ${this.brandColors.primary};
            border-radius: 8px;
            padding: 40px;
            text-align: center;
            color: ${this.brandColors.primaryDark};
        ">
            <div style="font-size: 48px; margin-bottom: 10px;">📷</div>
            <p>Upload Your Project Photos</p>
            <small>Show off your welding and construction work</small>
        </div>
        `;
    }

    // Create background pattern using brand elements
    createBackgroundPattern() {
        return `
        background-image: 
            radial-gradient(circle at 20% 20%, ${this.brandColors.primary}22 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${this.brandColors.silver}11 0%, transparent 50%);
        `;
    }

    // Get all available logo assets for reference
    getAllAssets() {
        return {
            ...this.logoAssets,
            brandColors: this.brandColors,
            usage: {
                navigation: this.logoAssets.primary,
                favicon: this.logoAssets.primary,
                socialMedia: this.logoAssets.primary,
                print: this.logoAssets.fallback
            }
        };
    }

    // Initialize asset manager and replace placeholders
    init() {
        console.log('🎨 CTV Asset Manager initialized');
        console.log('Primary Logo:', this.logoAssets.primary);
        console.log('Brand Colors:', this.brandColors);
        
        // Log asset recommendations
        console.log('\n📋 Asset Usage Recommendations:');
        console.log('- Use ctv-logo-optimized.svg for all web display');
        console.log('- Brand colors: Orange #FF7700, Silver #C0C0C0, Black #000000');
        console.log('- Replace generic photos with branded elements');
        console.log('- Maintain professional construction aesthetic');
        
        return this;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AssetManager;
}

// Make available globally
window.AssetManager = AssetManager;
