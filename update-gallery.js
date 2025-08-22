// Gallery Image Updater for CTV Prestige Construction
// This script helps manage the gallery images in index.html

const fs = require('fs');
const path = require('path');

class GalleryUpdater {
    constructor() {
        this.indexFile = path.join(__dirname, 'index.html');
        this.samplePhotosDir = path.join(__dirname, 'assets', 'sample-photos');
        this.categories = ['welding', 'container-repair', 'pressure-washing'];
    }

    // Get all image files from sample photos directory
    getSampleImages() {
        const images = {};
        
        this.categories.forEach(category => {
            const categoryPath = path.join(this.samplePhotosDir, category);
            if (fs.existsSync(categoryPath)) {
                const files = fs.readdirSync(categoryPath);
                images[category] = files.filter(file => 
                    /\.(jpg|jpeg|png|webp)$/i.test(file)
                );
            } else {
                images[category] = [];
            }
        });

        return images;
    }

    // Generate HTML for gallery items
    generateGalleryHTML(images) {
        let html = '';
        let count = 0;
        
        // Generate welding images
        images.welding.forEach((file, index) => {
            if (count >= 6) return;
            html += this.createGalleryItem('welding', file, `Welding Project ${index + 1}`);
            count++;
        });

        // Generate container repair images
        images['container-repair'].forEach((file, index) => {
            if (count >= 6) return;
            html += this.createGalleryItem('container-repair', file, `Container Repair ${index + 1}`);
            count++;
        });

        // Generate pressure washing images
        images['pressure-washing'].forEach((file, index) => {
            if (count >= 6) return;
            html += this.createGalleryItem('pressure-washing', file, `Pressure Washing ${index + 1}`);
            count++;
        });

        return html;
    }

    createGalleryItem(category, filename, altText) {
        const src = `assets/sample-photos/${category}/${filename}`;
        const alt = `${altText} - CTV Prestige Construction`;
        
        return `
                <div class="gallery-item">
                    <img src="${src}" alt="${alt}" loading="lazy">
                    <div class="gallery-overlay">
                        <span>${altText}</span>
                    </div>
                </div>`;
    }

    // Update the index.html file with new gallery content
    updateGallery() {
        try {
            const images = this.getSampleImages();
            const totalImages = Object.values(images).flat().length;
            
            if (totalImages === 0) {
                console.log('No sample images found. Please add images to assets/sample-photos/');
                return;
            }

            const htmlContent = fs.readFileSync(this.indexFile, 'utf8');
            const galleryHTML = this.generateGalleryHTML(images);
            
            // Replace the gallery content
            const updatedContent = htmlContent.replace(
                /<div id="gallery-container" class="gallery-grid">[\s\S]*?<\/div>/,
                `<div id="gallery-container" class="gallery-grid">\n${galleryHTML}\n            </div>`
            );

            fs.writeFileSync(this.indexFile, updatedContent);
            console.log('Gallery updated successfully!');
            console.log(`Found ${totalImages} sample images across categories.`);
            
        } catch (error) {
            console.error('Error updating gallery:', error.message);
        }
    }

    // Display current image statistics
    showStats() {
        const images = this.getSampleImages();
        console.log('\n📊 Sample Photos Statistics:');
        console.log('===========================');
        
        this.categories.forEach(category => {
            const count = images[category].length;
            console.log(`${category}: ${count} images`);
        });
        
        const total = Object.values(images).flat().length;
        console.log('---------------------------');
        console.log(`Total: ${total} images`);
        
        if (total === 0) {
            console.log('\n💡 Tip: Add images to assets/sample-photos/ folders');
            console.log('Supported formats: .jpg, .jpeg, .png, .webp');
        }
    }
}

// Command line interface
if (require.main === module) {
    const updater = new GalleryUpdater();
    
    const command = process.argv[2];
    
    switch (command) {
        case 'update':
            updater.updateGallery();
            break;
        case 'stats':
            updater.showStats();
            break;
        case 'help':
        default:
            console.log(`
Gallery Image Updater - Usage:
  node update-gallery.js update   - Update the gallery with current sample images
  node update-gallery.js stats    - Show statistics about sample images
  node update-gallery.js help     - Show this help message

Make sure to add your images to:
  assets/sample-photos/welding/
  assets/sample-photos/container-repair/
  assets/sample-photos/pressure-washing/
            `);
    }
}

module.exports = GalleryUpdater;
