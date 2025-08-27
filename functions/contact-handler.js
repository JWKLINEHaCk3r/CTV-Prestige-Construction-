/**
 * Netlify Function: Contact Form Handler
 * Handles contact form submissions and integrates with Neon database
 */

const { neon } = require('@netlify/neon');

exports.handler = async (event, context) => {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        console.log('📋 CORS preflight request handled');
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: JSON.stringify({ message: 'CORS preflight handled' })
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        console.warn('⚠️ Method not allowed:', event.httpMethod);
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Initialize Neon connection
        const sql = neon();
        
        // Parse request body
        const contactData = JSON.parse(event.body);
        
        // Log incoming request for debugging
        console.log('📥 Contact form submission received:', {
            name: contactData.name,
            email: contactData.email,
            serviceType: contactData.serviceType,
            timestamp: new Date().toISOString()
        });

        // Validate required fields
        const { name, email, serviceType, message } = contactData;
        
        if (!name || !email || !serviceType || !message) {
            console.warn('❌ Missing required fields:', {
                name: !!name,
                email: !!email,
                serviceType: !!serviceType,
                message: !!message
            });
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    error: 'Missing required fields',
                    required: ['name', 'email', 'serviceType', 'message']
                })
            };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.warn('❌ Invalid email format:', email);
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: 'Invalid email format' })
            };
        }

        // Create tables if they don't exist
        await sql`
            CREATE TABLE IF NOT EXISTS contact_requests (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                service_type VARCHAR(100),
                message TEXT,
                location VARCHAR(255),
                timeline VARCHAR(50),
                referrer VARCHAR(255),
                user_agent TEXT,
                ip_address VARCHAR(45),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(50) DEFAULT 'new'
            )
        `;

        // Extract client information
        const clientIp = event.headers['x-forwarded-for'] || 
                        event.headers['x-real-ip'] || 
                        context.clientContext?.ip || 
                        'unknown';
        
        const userAgent = event.headers['user-agent'] || 'unknown';

        // Insert contact request
        const [newContact] = await sql`
            INSERT INTO contact_requests (
                name, email, phone, service_type, message, 
                location, timeline, referrer, user_agent, ip_address
            )
            VALUES (
                ${name}, 
                ${email}, 
                ${contactData.phone || null}, 
                ${serviceType}, 
                ${message},
                ${contactData.location || null},
                ${contactData.timeline || null},
                ${contactData.referrer || null},
                ${userAgent},
                ${clientIp}
            )
            RETURNING id, created_at
        `;

        console.log('✅ Contact request saved to database:', {
            id: newContact.id,
            name: name,
            email: email,
            serviceType: serviceType,
            timestamp: newContact.created_at,
            ipAddress: clientIp
        });

        // Return success response
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                message: `Thank you ${name}! Your quote request has been received.`,
                data: {
                    id: newContact.id,
                    submittedAt: newContact.created_at,
                    estimatedResponse: '24 hours'
                }
            })
        };

    } catch (error) {
        console.error('❌ Contact form handler error:', {
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            timestamp: new Date().toISOString()
        });

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: false,
                error: 'Internal server error',
                message: 'Sorry, there was an issue processing your request. Please try again or contact us directly.',
                debug: process.env.NODE_ENV === 'development' ? error.message : undefined
            })
        };
    }
};
