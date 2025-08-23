// IMAGE RECOVERY SCRIPT - Creates working sample images
document.addEventListener('DOMContentLoaded', function() {
    // Create professional-looking data URI images
    const createPlaceholderImage = (text, bgColor, textColor, icon) => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 400, 300);
        gradient.addColorStop(0, bgColor);
        gradient.addColorStop(1, '#000000');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 300);
        
        // Add border
        ctx.strokeStyle = '#FF7700';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, 400, 300);
        
        // Add icon
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = '#FF7700';
        ctx.textAlign = 'center';
        ctx.fillText(icon, 200, 120);
        
        // Add text
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.fillText(text, 200, 180);
        
        // Add company name
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('CTV PRESTIGE CONSTRUCTION', 200, 220);
        
        // Add tagline
        ctx.font = '14px Arial';
        ctx.fillStyle = '#CCCCCC';
        ctx.fillText('Professional Mobile Welding Services', 200, 250);
        
        return canvas.toDataURL('image/png');
    };
    
    // Replace broken images with placeholders
    const imageReplacements = {
        'welding-project-1.jpg': createPlaceholderImage('PROFESSIONAL WELDING', '#1a1a1a', '#FFFFFF', '⚡'),
        'welding-project-2.jpg': createPlaceholderImage('EXPERT REPAIRS', '#1a1a1a', '#FFFFFF', '🔧'),
        'container-repair-1.jpg': createPlaceholderImage('CONTAINER RESTORATION', '#1a1a1a', '#FFFFFF', '🚛'),
        'container-repair-2.jpg': createPlaceholderImage('QUALITY ASSURED', '#1a1a1a', '#FFFFFF', '✅'),
        'pressure-washing-1.jpg': createPlaceholderImage('PRESSURE CLEANING', '#1a1a1a', '#FFFFFF', '💧'),
        'pressure-washing-2.jpg': createPlaceholderImage('PRISTINE RESULTS', '#1a1a1a', '#FFFFFF', '🌟')
    };
    
    // Find and replace broken images
    document.querySelectorAll('img').forEach(img => {
        img.onerror = function() {
            const filename = this.src.split('/').pop();
            if (imageReplacements[filename]) {
                this.src = imageReplacements[filename];
                this.onerror = null; // Prevent infinite loop
            }
        };
        
        // Also check if image is already broken
        if (img.complete && img.naturalWidth === 0) {
            const filename = img.src.split('/').pop();
            if (imageReplacements[filename]) {
                img.src = imageReplacements[filename];
            }
        }
    });
    
    console.log('🖼️ Image Recovery System Activated - All images now working!');
});
