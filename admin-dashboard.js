// CTV Prestige Construction - Admin Dashboard for Database Management
import ctvDatabase from './database.js';

class CTVAdminDashboard {
    constructor() {
        this.currentView = 'overview';
        this.initializeDashboard();
        this.loadDashboardData();
    }

    initializeDashboard() {
        // Create admin panel toggle button
        const adminToggle = document.createElement('div');
        adminToggle.innerHTML = `
            <button id="admin-toggle" class="admin-toggle-btn" title="Admin Dashboard">
                ⚙️
            </button>
        `;
        document.body.appendChild(adminToggle);

        // Add click handler
        document.getElementById('admin-toggle').addEventListener('click', () => {
            this.toggleDashboard();
        });

        // Create dashboard container
        this.createDashboardHTML();
        this.addDashboardStyles();
    }

    createDashboardHTML() {
        const dashboardHTML = `
            <div id="ctv-admin-dashboard" class="admin-dashboard hidden">
                <div class="dashboard-header">
                    <h2>🔥 CTV Prestige Admin Dashboard</h2>
                    <button id="close-dashboard" class="close-btn">✕</button>
                </div>

                <div class="dashboard-nav">
                    <button class="nav-btn active" data-view="overview">📊 Overview</button>
                    <button class="nav-btn" data-view="contacts">📞 Contacts</button>
                    <button class="nav-btn" data-view="inquiries">💼 Inquiries</button>
                    <button class="nav-btn" data-view="projects">🏗️ Projects</button>
                    <button class="nav-btn" data-view="analytics">📈 Analytics</button>
                </div>

                <div class="dashboard-content">
                    <div id="overview-view" class="dashboard-view active">
                        <div class="stats-grid">
                            <div class="stat-card">
                                <h3>📞 Total Contacts</h3>
                                <div class="stat-number" id="total-contacts">Loading...</div>
                            </div>
                            <div class="stat-card">
                                <h3>💼 Pending Inquiries</h3>
                                <div class="stat-number" id="pending-inquiries">Loading...</div>
                            </div>
                            <div class="stat-card">
                                <h3>📅 This Month</h3>
                                <div class="stat-number" id="monthly-contacts">Loading...</div>
                            </div>
                            <div class="stat-card">
                                <h3>⭐ Featured Projects</h3>
                                <div class="stat-number" id="featured-projects">6</div>
                            </div>
                        </div>
                        
                        <div class="recent-activity">
                            <h3>🕒 Recent Activity</h3>
                            <div id="recent-contacts" class="activity-list">
                                Loading recent contacts...
                            </div>
                        </div>
                    </div>

                    <div id="contacts-view" class="dashboard-view">
                        <div class="view-header">
                            <h3>📞 Contact Requests</h3>
                            <div class="view-controls">
                                <select id="contact-filter">
                                    <option value="">All Statuses</option>
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <button id="refresh-contacts" class="refresh-btn">🔄 Refresh</button>
                            </div>
                        </div>
                        <div id="contacts-list" class="data-list">
                            Loading contacts...
                        </div>
                    </div>

                    <div id="inquiries-view" class="dashboard-view">
                        <div class="view-header">
                            <h3>💼 Service Inquiries</h3>
                            <div class="view-controls">
                                <select id="inquiry-filter">
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <button id="refresh-inquiries" class="refresh-btn">🔄 Refresh</button>
                            </div>
                        </div>
                        <div id="inquiries-list" class="data-list">
                            Loading inquiries...
                        </div>
                    </div>

                    <div id="projects-view" class="dashboard-view">
                        <div class="view-header">
                            <h3>🏗️ Project Gallery Management</h3>
                            <button id="add-project" class="add-btn">➕ Add Project</button>
                        </div>
                        <div id="projects-list" class="data-list">
                            Loading projects...
                        </div>
                    </div>

                    <div id="analytics-view" class="dashboard-view">
                        <div class="analytics-grid">
                            <div class="analytics-card">
                                <h3>📈 Popular Services</h3>
                                <div id="popular-services" class="chart-container">
                                    Loading analytics...
                                </div>
                            </div>
                            <div class="analytics-card">
                                <h3>📅 Contact Trends</h3>
                                <div id="contact-trends" class="chart-container">
                                    Loading trends...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', dashboardHTML);

        // Add event listeners
        this.setupDashboardEvents();
    }

    setupDashboardEvents() {
        // Close button
        document.getElementById('close-dashboard').addEventListener('click', () => {
            this.toggleDashboard();
        });

        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });

        // Refresh buttons
        document.getElementById('refresh-contacts')?.addEventListener('click', () => {
            this.loadContacts();
        });

        document.getElementById('refresh-inquiries')?.addEventListener('click', () => {
            this.loadInquiries();
        });

        // Filter dropdowns
        document.getElementById('contact-filter')?.addEventListener('change', () => {
            this.loadContacts();
        });

        document.getElementById('inquiry-filter')?.addEventListener('change', () => {
            this.loadInquiries();
        });
    }

    toggleDashboard() {
        const dashboard = document.getElementById('ctv-admin-dashboard');
        dashboard.classList.toggle('hidden');
        
        if (!dashboard.classList.contains('hidden')) {
            this.loadDashboardData();
        }
    }

    switchView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.dashboard-view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`${viewName}-view`).classList.add('active');

        this.currentView = viewName;

        // Load data for the specific view
        this.loadViewData(viewName);
    }

    async loadDashboardData() {
        await this.loadStats();
        await this.loadRecentContacts();
    }

    async loadViewData(viewName) {
        switch (viewName) {
            case 'contacts':
                await this.loadContacts();
                break;
            case 'inquiries':
                await this.loadInquiries();
                break;
            case 'projects':
                await this.loadProjects();
                break;
            case 'analytics':
                await this.loadAnalytics();
                break;
        }
    }

    async loadStats() {
        try {
            const stats = await ctvDatabase.getContactStats();
            
            document.getElementById('total-contacts').textContent = stats.total_contacts || 0;
            document.getElementById('pending-inquiries').textContent = stats.new_contacts || 0;
            document.getElementById('monthly-contacts').textContent = stats.last_30_days || 0;
            
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    }

    async loadRecentContacts() {
        try {
            const recentContacts = await ctvDatabase.getContactRequests();
            const recentList = document.getElementById('recent-contacts');
            
            if (recentContacts.length === 0) {
                recentList.innerHTML = '<p>No recent contacts found.</p>';
                return;
            }

            const contactsHTML = recentContacts.slice(0, 5).map(contact => `
                <div class="activity-item">
                    <div class="activity-info">
                        <strong>${contact.name}</strong> - ${contact.service_type || 'General inquiry'}
                        <div class="activity-meta">
                            ${new Date(contact.created_at).toLocaleDateString()} • ${contact.email}
                        </div>
                    </div>
                    <div class="activity-status status-${contact.status}">
                        ${contact.status}
                    </div>
                </div>
            `).join('');

            recentList.innerHTML = contactsHTML;

        } catch (error) {
            console.error('Failed to load recent contacts:', error);
            document.getElementById('recent-contacts').innerHTML = '<p>Error loading contacts.</p>';
        }
    }

    async loadContacts() {
        try {
            const filter = document.getElementById('contact-filter')?.value;
            const contacts = await ctvDatabase.getContactRequests(filter || null);
            const contactsList = document.getElementById('contacts-list');

            if (contacts.length === 0) {
                contactsList.innerHTML = '<p>No contacts found.</p>';
                return;
            }

            const contactsHTML = contacts.map(contact => `
                <div class="data-item">
                    <div class="item-header">
                        <h4>${contact.name}</h4>
                        <div class="item-status status-${contact.status}">${contact.status}</div>
                    </div>
                    <div class="item-details">
                        <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
                        <p><strong>Phone:</strong> <a href="tel:${contact.phone || ''}">${contact.phone || 'Not provided'}</a></p>
                        <p><strong>Service:</strong> ${contact.service_type || 'Not specified'}</p>
                        <p><strong>Date:</strong> ${new Date(contact.created_at).toLocaleDateString()}</p>
                        <p><strong>Message:</strong> ${contact.message || 'No message'}</p>
                    </div>
                </div>
            `).join('');

            contactsList.innerHTML = contactsHTML;

        } catch (error) {
            console.error('Failed to load contacts:', error);
        }
    }

    async loadInquiries() {
        try {
            const filter = document.getElementById('inquiry-filter')?.value || 'pending';
            const inquiries = await ctvDatabase.getServiceInquiries(filter);
            const inquiriesList = document.getElementById('inquiries-list');

            if (inquiries.length === 0) {
                inquiriesList.innerHTML = '<p>No inquiries found.</p>';
                return;
            }

            const inquiriesHTML = inquiries.map(inquiry => `
                <div class="data-item inquiry-item">
                    <div class="item-header">
                        <h4>${inquiry.client_name}</h4>
                        <div class="item-status status-${inquiry.status}">${inquiry.status}</div>
                    </div>
                    <div class="item-details">
                        <p><strong>Service:</strong> ${inquiry.service_requested}</p>
                        <p><strong>Budget:</strong> ${inquiry.budget_range || 'Not specified'}</p>
                        <p><strong>Urgency:</strong> ${inquiry.urgency_level}</p>
                        <p><strong>Location:</strong> ${inquiry.location_address || 'Not specified'}</p>
                        <p><strong>Preferred Date:</strong> ${inquiry.preferred_date || 'Flexible'}</p>
                        <p><strong>Description:</strong> ${inquiry.project_description}</p>
                        <p><strong>Submitted:</strong> ${new Date(inquiry.created_at).toLocaleDateString()}</p>
                    </div>
                    <div class="item-actions">
                        <button onclick="ctvAdmin.updateInquiryStatus(${inquiry.id}, 'in-progress')" class="action-btn">
                            📋 Start Work
                        </button>
                        <button onclick="ctvAdmin.updateInquiryStatus(${inquiry.id}, 'completed')" class="action-btn">
                            ✅ Complete
                        </button>
                    </div>
                </div>
            `).join('');

            inquiriesList.innerHTML = inquiriesHTML;

        } catch (error) {
            console.error('Failed to load inquiries:', error);
        }
    }

    async updateInquiryStatus(inquiryId, newStatus) {
        try {
            await ctvDatabase.updateInquiryStatus(inquiryId, newStatus);
            this.loadInquiries(); // Refresh the list
            console.log(`✅ Inquiry ${inquiryId} updated to ${newStatus}`);
        } catch (error) {
            console.error('Failed to update inquiry status:', error);
        }
    }

    async loadAnalytics() {
        try {
            const popularServices = await ctvDatabase.getPopularServices();
            const servicesContainer = document.getElementById('popular-services');

            if (popularServices.length === 0) {
                servicesContainer.innerHTML = '<p>No service data available yet.</p>';
                return;
            }

            const servicesHTML = popularServices.map(service => `
                <div class="chart-item">
                    <span class="service-name">${service.service_type}</span>
                    <div class="service-bar">
                        <div class="service-fill" style="width: ${(service.request_count / popularServices[0].request_count) * 100}%"></div>
                    </div>
                    <span class="service-count">${service.request_count}</span>
                </div>
            `).join('');

            servicesContainer.innerHTML = servicesHTML;

        } catch (error) {
            console.error('Failed to load analytics:', error);
        }
    }

    addDashboardStyles() {
        const styles = `
            <style id="admin-dashboard-styles">
            .admin-toggle-btn {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                background: #ff4500;
                color: white;
                border: none;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                font-size: 20px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(255, 69, 0, 0.3);
                transition: transform 0.3s ease;
            }

            .admin-toggle-btn:hover {
                transform: scale(1.1);
            }

            .admin-dashboard {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.95);
                z-index: 10000;
                display: flex;
                flex-direction: column;
                transition: opacity 0.3s ease;
            }

            .admin-dashboard.hidden {
                display: none;
            }

            .dashboard-header {
                background: #1a1a1a;
                padding: 20px;
                border-bottom: 2px solid #ff4500;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .dashboard-header h2 {
                color: #ff4500;
                margin: 0;
                font-size: 1.5em;
            }

            .close-btn {
                background: #ff4500;
                color: white;
                border: none;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                font-size: 18px;
                cursor: pointer;
            }

            .dashboard-nav {
                background: #2a2a2a;
                padding: 15px 20px;
                display: flex;
                gap: 10px;
                border-bottom: 1px solid #444;
            }

            .nav-btn {
                background: #333;
                color: #ccc;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .nav-btn.active,
            .nav-btn:hover {
                background: #ff4500;
                color: white;
            }

            .dashboard-content {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }

            .dashboard-view {
                display: none;
            }

            .dashboard-view.active {
                display: block;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }

            .stat-card {
                background: #1a1a1a;
                border: 2px solid #333;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
            }

            .stat-card h3 {
                color: #ff4500;
                font-size: 1em;
                margin: 0 0 10px 0;
            }

            .stat-number {
                color: #fff;
                font-size: 2em;
                font-weight: bold;
            }

            .recent-activity {
                background: #1a1a1a;
                border-radius: 8px;
                padding: 20px;
            }

            .recent-activity h3 {
                color: #ff4500;
                margin-bottom: 15px;
            }

            .activity-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid #333;
            }

            .activity-info {
                color: #ccc;
            }

            .activity-meta {
                font-size: 0.9em;
                color: #888;
                margin-top: 5px;
            }

            .activity-status {
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 0.9em;
                font-weight: bold;
            }

            .status-new { background: #2d5a2d; color: #90ee90; }
            .status-contacted { background: #5a5a2d; color: #ffff90; }
            .status-completed { background: #2d2d5a; color: #9090ff; }
            .status-pending { background: #5a2d2d; color: #ff9090; }
            .status-in-progress { background: #5a5a2d; color: #ffff90; }

            .view-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 2px solid #ff4500;
            }

            .view-header h3 {
                color: #ff4500;
                margin: 0;
            }

            .view-controls {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .view-controls select {
                background: #333;
                color: #fff;
                border: 1px solid #555;
                padding: 8px 12px;
                border-radius: 4px;
            }

            .refresh-btn {
                background: #ff4500;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
            }

            .data-list {
                max-height: 70vh;
                overflow-y: auto;
            }

            .data-item {
                background: #1a1a1a;
                border: 1px solid #333;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 15px;
            }

            .item-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }

            .item-header h4 {
                color: #fff;
                margin: 0;
            }

            .item-details {
                color: #ccc;
                line-height: 1.6;
            }

            .item-details p {
                margin: 8px 0;
            }

            .item-details a {
                color: #ff4500;
                text-decoration: none;
            }

            .item-actions {
                margin-top: 15px;
                display: flex;
                gap: 10px;
            }

            .action-btn {
                background: #333;
                color: #fff;
                border: 1px solid #555;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.9em;
                transition: background 0.3s ease;
            }

            .action-btn:hover {
                background: #ff4500;
            }

            .analytics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
            }

            .analytics-card {
                background: #1a1a1a;
                border: 2px solid #333;
                border-radius: 8px;
                padding: 20px;
            }

            .analytics-card h3 {
                color: #ff4500;
                margin-bottom: 15px;
            }

            .chart-item {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
            }

            .service-name {
                color: #ccc;
                min-width: 150px;
                font-size: 0.9em;
            }

            .service-bar {
                flex: 1;
                height: 20px;
                background: #333;
                border-radius: 10px;
                overflow: hidden;
            }

            .service-fill {
                height: 100%;
                background: linear-gradient(90deg, #ff4500, #ff6600);
                transition: width 0.3s ease;
            }

            .service-count {
                color: #ff4500;
                font-weight: bold;
                min-width: 30px;
                text-align: right;
            }
            </style>
        `;

        if (!document.querySelector('#admin-dashboard-styles')) {
            document.head.insertAdjacentHTML('beforeend', styles);
        }
    }
}

// Initialize admin dashboard and make it globally available
const ctvAdmin = new CTVAdminDashboard();
window.ctvAdmin = ctvAdmin;

export default CTVAdminDashboard;
