// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle (if needed in future)
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Load gallery images on page load
    loadGalleryImages();
});

// Load gallery images from localStorage
function loadGalleryImages() {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) return;

    const savedImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    
    if (savedImages.length === 0) {
        // Keep placeholder if no images
        return;
    }

    // Clear placeholder and show images
    galleryContainer.innerHTML = '';
    
    savedImages.forEach(imageData => {
        const imgElement = document.createElement('div');
        imgElement.className = 'gallery-item';
        imgElement.innerHTML = `
            <img src="${imageData.url}" alt="${imageData.name}" loading="lazy">
            <div class="gallery-overlay">
                <span>${imageData.name}</span>
            </div>
        `;
        galleryContainer.appendChild(imgElement);
    });
}

// Simple form validation for contact (if form is added back)
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
    });

    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.service-card, .gallery-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // Add navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(30, 41, 59, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = '#1e293b';
            navbar.style.backdropFilter = 'none';
        }
    });
});

// Utility function to show messages
function showMessage(elementId, message, isError = false) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.color = isError ? '#dc2626' : '#059669';
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    }
}

// Check if gallery needs to be updated (for admin changes)
function checkGalleryUpdate() {
    const lastUpdate = localStorage.getItem('galleryLastUpdate');
    const currentUpdate = new Date().getTime();
    
    // Update gallery every 30 seconds if needed
    if (!lastUpdate || (currentUpdate - lastUpdate) > 30000) {
        loadGalleryImages();
        localStorage.setItem('galleryLastUpdate', currentUpdate);
    }
}

// Periodically check for gallery updates
setInterval(checkGalleryUpdate, 10000);

// Initialize gallery on load
window.addEventListener('load', function() {
    loadGalleryImages();
    
    // Check if we're coming from admin page with new upload
    if (sessionStorage.getItem('newUpload')) {
        sessionStorage.removeItem('newUpload');
        loadGalleryImages();
    }
});
