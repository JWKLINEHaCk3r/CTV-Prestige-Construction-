// CTV Prestige Construction - Database Integration with Neon
import { neon } from '@netlify/neon';

class CTVDatabase {
    constructor() {
        // Automatically uses NETLIFY_DATABASE_URL environment variable
        this.sql = neon();
        this.initializeDatabase();
    }

    async initializeDatabase() {
        try {
            // Create tables if they don't exist
            await this.createTables();
            console.log('✅ CTV Database initialized successfully');
        } catch (error) {
            console.error('❌ Database initialization failed:', error);
        }
    }

    async createTables() {
        // Create contact requests table
        await this.sql`
            CREATE TABLE IF NOT EXISTS contact_requests (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                service_type VARCHAR(100),
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(50) DEFAULT 'new'
            )
        `;

        // Create project gallery table
        await this.sql`
            CREATE TABLE IF NOT EXISTS project_gallery (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                image_url VARCHAR(500),
                service_category VARCHAR(100),
                location VARCHAR(255),
                completed_date DATE,
                featured BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Create service inquiries table
        await this.sql`
            CREATE TABLE IF NOT EXISTS service_inquiries (
                id SERIAL PRIMARY KEY,
                client_name VARCHAR(255),
                contact_email VARCHAR(255),
                contact_phone VARCHAR(50),
                service_requested VARCHAR(100),
                project_description TEXT,
                preferred_date DATE,
                location_address TEXT,
                budget_range VARCHAR(50),
                urgency_level VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(50) DEFAULT 'pending'
            )
        `;

        console.log('📊 Database tables created successfully');
    }

    // Contact Form Methods
    async submitContactRequest(contactData) {
        try {
            const [newContact] = await this.sql`
                INSERT INTO contact_requests (name, email, phone, service_type, message)
                VALUES (${contactData.name}, ${contactData.email}, ${contactData.phone}, ${contactData.serviceType}, ${contactData.message})
                RETURNING *
            `;

            console.log('✅ Contact request submitted:', newContact.id);
            return newContact;
        } catch (error) {
            console.error('❌ Failed to submit contact request:', error);
            throw error;
        }
    }

    async getContactRequests(status = null) {
        try {
            if (status) {
                return await this.sql`
                    SELECT * FROM contact_requests 
                    WHERE status = ${status}
                    ORDER BY created_at DESC
                `;
            } else {
                return await this.sql`
                    SELECT * FROM contact_requests 
                    ORDER BY created_at DESC
                `;
            }
        } catch (error) {
            console.error('❌ Failed to fetch contact requests:', error);
            throw error;
        }
    }

    // Project Gallery Methods
    async addProjectToGallery(projectData) {
        try {
            const [newProject] = await this.sql`
                INSERT INTO project_gallery (title, description, image_url, service_category, location, completed_date, featured)
                VALUES (${projectData.title}, ${projectData.description}, ${projectData.imageUrl}, ${projectData.category}, ${projectData.location}, ${projectData.completedDate}, ${projectData.featured || false})
                RETURNING *
            `;

            console.log('✅ Project added to gallery:', newProject.id);
            return newProject;
        } catch (error) {
            console.error('❌ Failed to add project to gallery:', error);
            throw error;
        }
    }

    async getFeaturedProjects() {
        try {
            return await this.sql`
                SELECT * FROM project_gallery 
                WHERE featured = true
                ORDER BY completed_date DESC
                LIMIT 6
            `;
        } catch (error) {
            console.error('❌ Failed to fetch featured projects:', error);
            throw error;
        }
    }

    async getProjectsByCategory(category) {
        try {
            return await this.sql`
                SELECT * FROM project_gallery 
                WHERE service_category = ${category}
                ORDER BY completed_date DESC
            `;
        } catch (error) {
            console.error('❌ Failed to fetch projects by category:', error);
            throw error;
        }
    }

    // Service Inquiry Methods
    async submitServiceInquiry(inquiryData) {
        try {
            const [newInquiry] = await this.sql`
                INSERT INTO service_inquiries (
                    client_name, contact_email, contact_phone, service_requested,
                    project_description, preferred_date, location_address, 
                    budget_range, urgency_level
                )
                VALUES (
                    ${inquiryData.clientName}, ${inquiryData.email}, ${inquiryData.phone},
                    ${inquiryData.serviceRequested}, ${inquiryData.description},
                    ${inquiryData.preferredDate}, ${inquiryData.location},
                    ${inquiryData.budgetRange}, ${inquiryData.urgency}
                )
                RETURNING *
            `;

            console.log('✅ Service inquiry submitted:', newInquiry.id);
            return newInquiry;
        } catch (error) {
            console.error('❌ Failed to submit service inquiry:', error);
            throw error;
        }
    }

    async getServiceInquiries(status = 'pending') {
        try {
            return await this.sql`
                SELECT * FROM service_inquiries 
                WHERE status = ${status}
                ORDER BY created_at DESC
            `;
        } catch (error) {
            console.error('❌ Failed to fetch service inquiries:', error);
            throw error;
        }
    }

    async updateInquiryStatus(inquiryId, newStatus) {
        try {
            const [updatedInquiry] = await this.sql`
                UPDATE service_inquiries 
                SET status = ${newStatus}
                WHERE id = ${inquiryId}
                RETURNING *
            `;

            console.log('✅ Inquiry status updated:', inquiryId);
            return updatedInquiry;
        } catch (error) {
            console.error('❌ Failed to update inquiry status:', error);
            throw error;
        }
    }

    // Analytics Methods
    async getContactStats() {
        try {
            const [stats] = await this.sql`
                SELECT 
                    COUNT(*) as total_contacts,
                    COUNT(CASE WHEN status = 'new' THEN 1 END) as new_contacts,
                    COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted,
                    COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as last_30_days
                FROM contact_requests
            `;

            return stats;
        } catch (error) {
            console.error('❌ Failed to fetch contact stats:', error);
            throw error;
        }
    }

    async getPopularServices() {
        try {
            return await this.sql`
                SELECT 
                    service_type,
                    COUNT(*) as request_count
                FROM contact_requests 
                WHERE service_type IS NOT NULL
                GROUP BY service_type
                ORDER BY request_count DESC
                LIMIT 5
            `;
        } catch (error) {
            console.error('❌ Failed to fetch popular services:', error);
            throw error;
        }
    }
}

// Initialize database connection
const ctvDatabase = new CTVDatabase();

// Export for use in other modules
export default ctvDatabase;

// Make available globally for admin panel
window.ctvDatabase = ctvDatabase;
