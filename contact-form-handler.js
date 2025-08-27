/**
 * CTV Prestige Construction - Contact Form Handler with Database Integration
 * Handles form submissions and integrates with Neon database
 */

import ctvDatabase from './database.js';

class ContactFormHandler {
    constructor() {
        this.initializeFormHandlers();
        this.setupValidation();
        console.log('📧 Contact Form Handler initialized');
    }

    initializeFormHandlers() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupForms());
        } else {
            this.setupForms();
        }
    }

    setupForms() {
        // Handle contact form in main website
        const contactForm = document.querySelector('#contact-form, .contact-form, form[name="contact"]');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
            console.log('✅ Contact form handler attached');
        }

        // Create dynamic contact form if none exists
        this.createContactFormIfMissing();
    }

    createContactFormIfMissing() {
        // Check if contact section exists but no form
        const contactSection = document.querySelector('#contact, .contact-section');
        
        if (contactSection && !contactSection.querySelector('form')) {
            const formHTML = this.generateContactFormHTML();
            contactSection.insertAdjacentHTML('beforeend', formHTML);
            
            // Attach handler to new form
            const newForm = contactSection.querySelector('#ctv-contact-form');
            newForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
            
            console.log('📋 Dynamic contact form created and attached');
        }
    }

    generateContactFormHTML() {
        return `
        <div class="contact-form-container">
            <h3>Get Your Free Quote Today!</h3>
            <p>Professional mobile welding services across the region. Fast response guaranteed.</p>
            
            <form id="ctv-contact-form" class="ctv-contact-form">
                <div class="form-group">
                    <label for="name">Full Name *</label>
                    <input type="text" id="name" name="name" required 
                           placeholder="Enter your full name">
                </div>

                <div class="form-group">
                    <label for="email">Email Address *</label>
                    <input type="email" id="email" name="email" required 
                           placeholder="your.email@example.com">
                </div>

                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone" 
                           placeholder="(555) 123-4567">
                </div>

                <div class="form-group">
                    <label for="service">Service Needed *</label>
                    <select id="service" name="serviceType" required>
                        <option value="">Select a service...</option>
                        <option value="mobile-welding">Mobile Welding</option>
                        <option value="structural-welding">Structural Welding</option>
                        <option value="aluminum-welding">Aluminum Welding</option>
                        <option value="stainless-steel">Stainless Steel Welding</option>
                        <option value="fabrication">Custom Fabrication</option>
                        <option value="repairs">Welding Repairs</option>
                        <option value="industrial">Industrial Projects</option>
                        <option value="emergency">Emergency Service</option>
                        <option value="consultation">Consultation</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="message">Project Details *</label>
                    <textarea id="message" name="message" required rows="4"
                              placeholder="Describe your welding project, timeline, and any specific requirements..."></textarea>
                </div>

                <div class="form-group">
                    <label for="location">Project Location</label>
                    <input type="text" id="location" name="location" 
                           placeholder="City, State or ZIP code">
                </div>

                <div class="form-group">
                    <label for="timeline">Preferred Timeline</label>
                    <select id="timeline" name="timeline">
                        <option value="">Select timeline...</option>
                        <option value="asap">ASAP / Emergency</option>
                        <option value="this-week">This Week</option>
                        <option value="next-week">Next Week</option>
                        <option value="this-month">This Month</option>
                        <option value="flexible">Flexible</option>
                    </select>
                </div>

                <button type="submit" class="submit-btn">
                    <span class="btn-text">Request Free Quote</span>
                    <span class="btn-loading" style="display: none;">Sending...</span>
                </button>

                <div class="form-status" style="display: none;"></div>
            </form>
        </div>

        <style>
        .contact-form-container {
            max-width: 600px;
            margin: 2rem auto;
            padding: 2rem;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #FF6B35;
            border-radius: 10px;
        }

        .contact-form-container h3 {
            color: #FF6B35;
            margin-bottom: 1rem;
            text-align: center;
        }

        .contact-form-container p {
            color: #ccc;
            text-align: center;
            margin-bottom: 2rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            color: #FF6B35;
            margin-bottom: 0.5rem;
            font-weight: bold;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid #555;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border-radius: 5px;
            font-size: 1rem;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #FF6B35;
            box-shadow: 0 0 5px rgba(255, 107, 53, 0.3);
        }

        .submit-btn {
            width: 100%;
            padding: 1rem 2rem;
            background: linear-gradient(45deg, #FF6B35, #FF8C42);
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .submit-btn:hover {
            background: linear-gradient(45deg, #FF8C42, #FF6B35);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 107, 53, 0.3);
        }

        .submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .form-status {
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
        }

        .form-status.success {
            background: rgba(40, 167, 69, 0.2);
            color: #28a745;
            border: 1px solid #28a745;
        }

        .form-status.error {
            background: rgba(220, 53, 69, 0.2);
            color: #dc3545;
            border: 1px solid #dc3545;
        }

        @media (max-width: 768px) {
            .contact-form-container {
                margin: 1rem;
                padding: 1rem;
            }
        }
        </style>
        `;
    }

    async handleContactSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('.submit-btn');
        const btnText = form.querySelector('.btn-text');
        const btnLoading = form.querySelector('.btn-loading');
        const statusDiv = form.querySelector('.form-status');
        
        // Show loading state
        this.setLoadingState(submitBtn, btnText, btnLoading, true);
        
        try {
            // Extract form data
            const formData = new FormData(form);
            const contactData = {
                name: formData.get('name')?.trim(),
                email: formData.get('email')?.trim(),
                phone: formData.get('phone')?.trim(),
                serviceType: formData.get('serviceType'),
                message: formData.get('message')?.trim(),
                location: formData.get('location')?.trim(),
                timeline: formData.get('timeline'),
                referrer: document.referrer || 'Direct',
                userAgent: navigator.userAgent
            };

            // Validate required fields
            const validation = this.validateContactData(contactData);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            // Submit to database
            const result = await ctvDatabase.submitContactRequest(contactData);
            
            // Show success message
            this.showStatus(statusDiv, 'success', 
                `Thank you ${contactData.name}! Your quote request has been received. 
                 We'll contact you within 24 hours. Reference ID: #${result.id}`
            );
            
            // Reset form
            form.reset();
            
            // Track conversion event
            this.trackConversion(contactData.serviceType);
            
            console.log('✅ Contact form submitted successfully:', result.id);
            
        } catch (error) {
            console.error('❌ Contact form submission failed:', error);
            
            this.showStatus(statusDiv, 'error', 
                'Sorry, there was an issue sending your message. Please try again or call us directly.'
            );
        } finally {
            // Reset loading state
            this.setLoadingState(submitBtn, btnText, btnLoading, false);
        }
    }

    validateContactData(data) {
        if (!data.name || data.name.length < 2) {
            return { valid: false, error: 'Please enter your full name' };
        }
        
        if (!data.email || !this.isValidEmail(data.email)) {
            return { valid: false, error: 'Please enter a valid email address' };
        }
        
        if (!data.serviceType) {
            return { valid: false, error: 'Please select the service you need' };
        }
        
        if (!data.message || data.message.length < 10) {
            return { valid: false, error: 'Please provide more details about your project' };
        }
        
        return { valid: true };
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setLoadingState(btn, textSpan, loadingSpan, isLoading) {
        if (isLoading) {
            btn.disabled = true;
            textSpan.style.display = 'none';
            loadingSpan.style.display = 'inline';
        } else {
            btn.disabled = false;
            textSpan.style.display = 'inline';
            loadingSpan.style.display = 'none';
        }
    }

    showStatus(statusDiv, type, message) {
        statusDiv.className = `form-status ${type}`;
        statusDiv.textContent = message;
        statusDiv.style.display = 'block';
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 8000);
        }
    }

    trackConversion(serviceType) {
        // Track successful form submission
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                'send_to': 'AW-XXXXXXXXX/XXXXXX',
                'event_category': 'Contact Form',
                'event_label': serviceType,
                'value': 1
            });
        }
        
        console.log(`📊 Conversion tracked for service: ${serviceType}`);
    }

    setupValidation() {
        // Real-time validation on form inputs
        document.addEventListener('input', (e) => {
            if (e.target.matches('.ctv-contact-form input, .ctv-contact-form select, .ctv-contact-form textarea')) {
                this.validateField(e.target);
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        switch(field.type) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    isValid = false;
                    message = 'Please enter a valid email address';
                }
                break;
            case 'tel':
                if (value && !/^[\d\s\-\(\)\+\.]+$/.test(value)) {
                    isValid = false;
                    message = 'Please enter a valid phone number';
                }
                break;
        }

        // Visual feedback
        field.style.borderColor = isValid ? '#555' : '#dc3545';
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message if needed
        if (!isValid && message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.cssText = 'color: #dc3545; font-size: 0.8rem; margin-top: 0.25rem;';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        }
    }
}

// Initialize contact form handler
const contactFormHandler = new ContactFormHandler();

// Export for external use
export default contactFormHandler;

// Global access for debugging
if (typeof window !== 'undefined') {
    window.contactFormHandler = contactFormHandler;
    console.log('📧 Contact Form Handler available globally');
}
