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

// Load gallery images from localStorage with loading states
function loadGalleryImages() {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) return;

    // Show loading state
    galleryContainer.innerHTML = `
        <div class="gallery-placeholder">
            <div class="loading" style="margin-bottom: 1rem;"></div>
            <p>Loading gallery...</p>
        </div>
    `;

    setTimeout(() => {
        try {
            const savedImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');
            
            if (savedImages.length === 0) {
                // Show empty state
                galleryContainer.innerHTML = `
                    <div class="gallery-placeholder">
                        <p>No photos uploaded yet.</p>
                        <p style="font-size: 0.9rem; margin-top: 0.5rem; color: var(--text-muted);">
                            Upload photos from the admin panel to showcase your work.
                        </p>
                    </div>
                `;
                return;
            }

            // Clear and show images
            galleryContainer.innerHTML = '';
            
            savedImages.forEach((imageData, index) => {
                const imgElement = document.createElement('div');
                imgElement.className = 'gallery-item';
                imgElement.setAttribute('data-image-index', index);
                imgElement.innerHTML = `
                    <img src="${imageData.url}" alt="${imageData.name || 'Gallery image'}" loading="lazy" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDMyMCAyNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMyMCIgaGVpZ2h0PSIyNDAiIGZpbGw9IiMxYTFhMWEiLz48dGV4dCB4PSIxNjAiIHk9IjEyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk0YTNiOCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9IjUwMCI+SW1hZ2UgTm90IExvYWRlZDwvdGV4dD48L3N2Zz4='">
                    <div class="gallery-overlay">
                        <span>${imageData.name || 'Untitled'}</span>
                        ${imageData.timestamp ? `<small style="display: block; margin-top: 0.5rem; opacity: 0.8;">${new Date(imageData.timestamp).toLocaleDateString()}</small>` : ''}
                    </div>
                `;
                
                // Add click to view larger (future enhancement)
                imgElement.addEventListener('click', () => {
                    showImageModal(imageData);
                });
                
                galleryContainer.appendChild(imgElement);
            });

            // Re-initialize scroll animations
            initScrollAnimations();

        } catch (error) {
            console.error('Error loading gallery:', error);
            galleryContainer.innerHTML = `
                <div class="gallery-placeholder">
                    <p style="color: var(--error);">Error loading gallery</p>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem; color: var(--text-muted);">
                        Please try refreshing the page.
                    </p>
                </div>
            `;
        }
    }, 500); // Small delay for better UX
}

// Show image modal (future enhancement)
function showImageModal(imageData) {
    console.log('Viewing image:', imageData.name);
    // This could be expanded to show a modal with larger image view
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

// Initialize scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Stop observing after animation
                observer.unobserve(entry.target);
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
}

// Initialize scroll animations on load
initScrollAnimations();

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

    // Register service worker for offline functionality
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('Service Worker registered with scope:', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('New service worker found:', newWorker.state);
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('New content is available; please refresh.');
                        }
                    });
                });
            })
            .catch(function(error) {
                console.log('Service Worker registration failed:', error);
            });
    }

    // Initialize performance monitoring in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const script = document.createElement('script');
        script.src = '/performance-monitor.js';
        script.defer = true;
        document.head.appendChild(script);
    }
});

// Preload critical resources
function preloadCriticalResources() {
    const resources = [
        '/styles.css',
        '/script.js',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
    ];

    resources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.css') ? 'style' : resource.endsWith('.js') ? 'script' : 'font';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
}

// Execute preload on DOM content loaded
document.addEventListener('DOMContentLoaded', preloadCriticalResources);
