// CTV Prestige Construction - Netlify Function for Contact Submissions
import { neon } from '@netlify/neon';

const sql = neon();

export default async function handler(event, context) {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        console.log('📋 CORS preflight request handled');
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        console.warn('⚠️ Method not allowed:', event.httpMethod);
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const data = JSON.parse(event.body);
        
        // Log incoming request for debugging
        console.log('📥 Contact form submission received:', {
            clientName: data.clientName,
            email: data.email,
            serviceType: data.serviceType,
            timestamp: new Date().toISOString()
        });

        // Validate required fields
        if (!data.clientName || !data.email || !data.description) {
            console.warn('❌ Missing required fields:', {
                clientName: !!data.clientName,
                email: !!data.email,
                description: !!data.description
            });
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields: clientName, email, description' })
            };
        }

        // Insert contact request into database
        const [newContact] = await sql`
            INSERT INTO service_inquiries (
                client_name, contact_email, contact_phone, service_requested,
                project_description, preferred_date, location_address, 
                budget_range, urgency_level
            )
            VALUES (
                ${data.clientName}, ${data.email}, ${data.phone || null},
                ${data.serviceType || 'General Inquiry'}, ${data.description},
                ${data.preferredDate || null}, ${data.location || null},
                ${data.budgetRange || null}, ${data.urgency || 'normal'}
            )
            RETURNING id, created_at
        `;

        console.log('✅ Contact request saved to database:', {
            id: newContact.id,
            clientName: data.clientName,
            email: data.email,
            serviceType: data.serviceType,
            timestamp: newContact.created_at
        });

        // Send notification email (optional - integrate with your preferred service)
        try {
            await sendNotificationEmail(data);
            console.log('📧 Email notification sent successfully');
        } catch (emailError) {
            console.error('❌ Email notification failed:', emailError.message);
            // Don't fail the request if email fails
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                id: newContact.id,
                message: 'Contact request submitted successfully',
                timestamp: newContact.created_at
            })
        };

    } catch (error) {
        console.error('❌ Database error:', {
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            timestamp: new Date().toISOString()
        });
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to submit contact request',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            })
        };
    }
}

async function sendNotificationEmail(contactData) {
    // This is a placeholder for email integration
    // You can integrate with services like:
    // - Netlify Forms
    // - SendGrid
    // - Mailgun
    // - Resend
    // - EmailJS
    
    const emailContent = {
        to: process.env.NOTIFICATION_EMAIL || 'ctvprestigeconstruction@gmail.com',
        subject: `New Quote Request - ${contactData.serviceType || 'General Inquiry'}`,
        body: `
            New quote request received from CTV website:
            
            Name: ${contactData.clientName}
            Email: ${contactData.email}
            Phone: ${contactData.phone || 'Not provided'}
            Service: ${contactData.serviceType || 'General Inquiry'}
            Budget: ${contactData.budgetRange || 'Not specified'}
            Urgency: ${contactData.urgency || 'Normal'}
            Location: ${contactData.location || 'Not specified'}
            Preferred Date: ${contactData.preferredDate || 'Flexible'}
            
            Project Description:
            ${contactData.description}
            
            Submitted: ${new Date().toLocaleString()}
        `
    };
    
    console.log('📧 Email notification prepared:', emailContent.subject);
    // Implement your preferred email service here
}

// Initialize database tables on first run
async function initializeDatabase() {
    try {
        await sql`
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
        console.log('✅ Database tables initialized');
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
    }
}
