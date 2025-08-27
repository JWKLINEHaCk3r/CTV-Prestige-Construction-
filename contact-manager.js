// CTV Prestige Construction - Enhanced Contact Form with Database Integration
import ctvDatabase from './database.js';

class CTVContactManager {
    constructor() {
        this.initializeContactForm();
        this.setupFormValidation();
    }

    initializeContactForm() {
        // Create enhanced contact form
        const contactSection = document.querySelector('.contact-section') || this.createContactSection();
        
        const enhancedFormHTML = `
            <div class="contact-container">
                <div class="contact-header">
                    <h2>🔥 Get Your Free Welding Quote Today!</h2>
                    <p>Professional mobile welding services across Connecticut</p>
                </div>

                <form id="ctv-contact-form" class="contact-form">
                    <div class="form-group">
                        <label for="client-name">Full Name *</label>
                        <input type="text" id="client-name" name="clientName" required>
                    </div>

                    <div class="form-row">
                        <div class="form-group half">
                            <label for="client-email">Email Address *</label>
                            <input type="email" id="client-email" name="email" required>
                        </div>
                        <div class="form-group half">
                            <label for="client-phone">Phone Number</label>
                            <input type="tel" id="client-phone" name="phone">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="service-type">Service Needed *</label>
                        <select id="service-type" name="serviceType" required>
                            <option value="">Select a service...</option>
                            <option value="residential-welding">Residential Welding</option>
                            <option value="commercial-welding">Commercial Welding</option>
                            <option value="structural-repairs">Structural Repairs</option>
                            <option value="custom-fabrication">Custom Fabrication</option>
                            <option value="emergency-repairs">Emergency Repairs</option>
                            <option value="inspection">Welding Inspection</option>
                            <option value="consultation">Free Consultation</option>
                        </select>
                    </div>

                    <div class="form-row">
                        <div class="form-group half">
                            <label for="preferred-date">Preferred Date</label>
                            <input type="date" id="preferred-date" name="preferredDate">
                        </div>
                        <div class="form-group half">
                            <label for="budget-range">Budget Range</label>
                            <select id="budget-range" name="budgetRange">
                                <option value="">Select budget range...</option>
                                <option value="under-500">Under $500</option>
                                <option value="500-1000">$500 - $1,000</option>
                                <option value="1000-2500">$1,000 - $2,500</option>
                                <option value="2500-5000">$2,500 - $5,000</option>
                                <option value="over-5000">Over $5,000</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="project-location">Project Location</label>
                        <input type="text" id="project-location" name="location" placeholder="City, CT">
                    </div>

                    <div class="form-group">
                        <label for="urgency-level">Project Urgency</label>
                        <select id="urgency-level" name="urgency">
                            <option value="normal">Normal - Within 2 weeks</option>
                            <option value="urgent">Urgent - Within 1 week</option>
                            <option value="emergency">Emergency - ASAP</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="project-description">Project Description *</label>
                        <textarea id="project-description" name="description" rows="4" 
                                placeholder="Please describe your welding project, materials involved, and any specific requirements..." required></textarea>
                    </div>

                    <div class="form-actions">
                        <button type="submit" id="submit-contact" class="submit-btn">
                            🔥 Get My Free Quote
                        </button>
                        <div id="form-status" class="form-status"></div>
                    </div>
                </form>

                <div class="contact-info">
                    <div class="contact-details">
                        <h3>📱 Quick Contact</h3>
                        <p><strong>Phone:</strong> <a href="tel:+1234567890">(123) 456-7890</a></p>
                        <p><strong>Email:</strong> <a href="mailto:info@ctvprestige.com">info@ctvprestige.com</a></p>
                        <p><strong>Service Area:</strong> All of Connecticut</p>
                    </div>
                </div>
            </div>
        `;

        contactSection.innerHTML = enhancedFormHTML;
        this.addContactFormStyles();
    }

    createContactSection() {
        const contactSection = document.createElement('section');
        contactSection.className = 'contact-section';
        contactSection.id = 'contact';
        document.body.appendChild(contactSection);
        return contactSection;
    }

    setupFormValidation() {
        const form = document.getElementById('ctv-contact-form');
        if (form) {
            form.addEventListener('submit', this.handleFormSubmission.bind(this));
        }
    }

    async handleFormSubmission(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const contactData = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitBtn = document.getElementById('submit-contact');
        const statusDiv = document.getElementById('form-status');
        
        submitBtn.textContent = '🔄 Submitting...';
        submitBtn.disabled = true;

        try {
            // Submit to database
            await ctvDatabase.submitServiceInquiry(contactData);

            // Show success message
            statusDiv.innerHTML = `
                <div class="success-message">
                    ✅ <strong>Quote Request Submitted Successfully!</strong><br>
                    We'll contact you within 24 hours with your free quote.
                </div>
            `;

            // Reset form
            event.target.reset();
            
            // Send notification email (if configured)
            this.sendNotificationEmail(contactData);

        } catch (error) {
            console.error('Form submission error:', error);
            
            statusDiv.innerHTML = `
                <div class="error-message">
                    ❌ <strong>Submission Failed</strong><br>
                    Please try again or call us directly at (123) 456-7890
                </div>
            `;
        } finally {
            submitBtn.textContent = '🔥 Get My Free Quote';
            submitBtn.disabled = false;
        }
    }

    async sendNotificationEmail(contactData) {
        // This would integrate with a service like Netlify Forms or EmailJS
        try {
            const emailData = {
                to: 'info@ctvprestige.com',
                subject: `New Quote Request - ${contactData.serviceType}`,
                body: `
                    New quote request received:
                    
                    Name: ${contactData.clientName}
                    Email: ${contactData.email}
                    Phone: ${contactData.phone || 'Not provided'}
                    Service: ${contactData.serviceType}
                    Budget: ${contactData.budgetRange || 'Not specified'}
                    Urgency: ${contactData.urgency || 'Normal'}
                    Location: ${contactData.location || 'Not specified'}
                    
                    Project Description:
                    ${contactData.description}
                `
            };
            
            console.log('📧 Email notification prepared:', emailData);
            // Implementation would depend on chosen email service
            
        } catch (error) {
            console.error('Email notification failed:', error);
        }
    }

    addContactFormStyles() {
        const styles = `
            <style>
            .contact-container {
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 20px;
                background: #111;
                border-radius: 12px;
                border: 2px solid #ff4500;
            }

            .contact-header {
                text-align: center;
                margin-bottom: 40px;
            }

            .contact-header h2 {
                color: #ff4500;
                font-size: 2.2em;
                margin-bottom: 10px;
            }

            .contact-header p {
                color: #ccc;
                font-size: 1.1em;
            }

            .contact-form {
                background: #1a1a1a;
                padding: 30px;
                border-radius: 8px;
                margin-bottom: 30px;
            }

            .form-group {
                margin-bottom: 25px;
            }

            .form-row {
                display: flex;
                gap: 20px;
            }

            .form-group.half {
                flex: 1;
            }

            .form-group label {
                display: block;
                color: #ff4500;
                font-weight: bold;
                margin-bottom: 8px;
                font-size: 1.1em;
            }

            .form-group input,
            .form-group select,
            .form-group textarea {
                width: 100%;
                padding: 12px;
                background: #333;
                border: 2px solid #444;
                border-radius: 6px;
                color: #fff;
                font-size: 16px;
                transition: border-color 0.3s ease;
            }

            .form-group input:focus,
            .form-group select:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: #ff4500;
                box-shadow: 0 0 10px rgba(255, 69, 0, 0.3);
            }

            .form-group textarea {
                resize: vertical;
                min-height: 120px;
            }

            .form-actions {
                text-align: center;
                margin-top: 30px;
            }

            .submit-btn {
                background: linear-gradient(45deg, #ff4500, #ff6600);
                color: white;
                padding: 15px 40px;
                border: none;
                border-radius: 8px;
                font-size: 1.2em;
                font-weight: bold;
                cursor: pointer;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                width: 100%;
                max-width: 300px;
            }

            .submit-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(255, 69, 0, 0.4);
            }

            .submit-btn:disabled {
                opacity: 0.7;
                transform: none;
                cursor: not-allowed;
            }

            .form-status {
                margin-top: 20px;
            }

            .success-message {
                background: #2d5a2d;
                color: #90ee90;
                padding: 15px;
                border-radius: 6px;
                border-left: 4px solid #90ee90;
            }

            .error-message {
                background: #5a2d2d;
                color: #ff6b6b;
                padding: 15px;
                border-radius: 6px;
                border-left: 4px solid #ff6b6b;
            }

            .contact-info {
                background: #1a1a1a;
                padding: 25px;
                border-radius: 8px;
                text-align: center;
            }

            .contact-info h3 {
                color: #ff4500;
                margin-bottom: 15px;
            }

            .contact-info p {
                color: #ccc;
                margin-bottom: 10px;
            }

            .contact-info a {
                color: #ff4500;
                text-decoration: none;
            }

            .contact-info a:hover {
                text-decoration: underline;
            }

            @media (max-width: 768px) {
                .form-row {
                    flex-direction: column;
                }
                
                .contact-header h2 {
                    font-size: 1.8em;
                }
                
                .contact-form {
                    padding: 20px;
                }
            }
            </style>
        `;

        // Add styles to head if not already present
        if (!document.querySelector('#contact-form-styles')) {
            const styleElement = document.createElement('div');
            styleElement.id = 'contact-form-styles';
            styleElement.innerHTML = styles;
            document.head.appendChild(styleElement);
        }
    }
}

// Initialize contact manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    new CTVContactManager();
});

// Export for use in other modules
export default CTVContactManager;
