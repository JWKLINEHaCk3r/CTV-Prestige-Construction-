# CTV Prestige Construction Website

A simple, clean landing page for CTV Prestige Construction with admin photo upload capabilities.

## Features

- **Clean Landing Page**: Minimal design focused on contact and services
- **Email Contact**: Direct email links for quick communication
- **Photo Gallery**: Dynamic gallery that displays uploaded work photos
- **Admin System**: Password-protected admin portal for photo management
- **Mobile Responsive**: Works perfectly on all devices

## Admin Features

### Login Credentials
- **Password**: `ctvadmin2024` (Change this in admin.html for security)

### Admin Capabilities
- Upload photos to website gallery
- Add descriptions to photos
- Delete existing photos
- Manage gallery content easily

## How to Use

### For Visitors:
1. Visit the website
2. View services and gallery
3. Click "Email Us Now" to contact via email
4. Browse photo gallery of previous work

### For Admin:
1. Go to `/admin.html` or click "Admin" in navigation
2. Enter password: `ctvadmin2024`
3. Upload new photos with optional descriptions
4. Manage existing photos
5. Logout when done

## File Structure

```
├── index.html          # Main landing page
├── admin.html          # Admin login and photo upload
├── styles.css          # Styling for both pages
├── script.js           # JavaScript functionality
├── netlify.toml        # Netlify configuration
├── assets/
│   └── logo.png        # Company logo
└── README.md           # This file
```

## Photo Storage

Photos are stored in the browser's localStorage. This means:
- ✅ No server required
- ✅ Easy to set up
- ✅ Works offline
- ⚠️ Photos are stored per device/browser
- ⚠️ Limited storage capacity (typically 5-10MB)

**Note**: For production use with many photos, consider upgrading to a proper backend storage solution.

## Customization

### Change Admin Password
Edit the `ADMIN_PASSWORD` variable in `admin.html`:
```javascript
const ADMIN_PASSWORD = 'your-new-password-here';
```

### Update Contact Information
Edit in `index.html`:
- Email: Search for `ctvprestigeconstruction@gmail.com`
- Phone: Search for `3867475994`
- Contact name: Search for `Eric Vazquez`

### Modify Services
Update the services section in `index.html` to reflect your current offerings.

## Deployment on Netlify

### Method 1: Drag and Drop (Easiest)
1. Go to [netlify.com](https://netlify.com)
2. Sign up or log in to your account
3. Drag the entire project folder to the deployment area
4. Netlify will automatically deploy your site

### Method 2: Git Repository
1. Push this project to a GitHub repository
2. Connect your Netlify account to the repository
3. Netlify will automatically deploy on every push

### Method 3: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy the site
netlify deploy --prod --dir=.
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Security Notes

- The admin system uses simple password authentication
- For enhanced security, consider implementing:
  - Netlify Identity
  - More complex authentication
  - Rate limiting
  - HTTPS enforcement

## Troubleshooting

### Photos not showing?
- Check if browser allows localStorage
- Clear browser cache and reload
- Ensure images are under 1MB each

### Admin login not working?
- Verify password in admin.html code
- Check browser console for errors

## Contact

For website support or modifications:
- Email: ctvprestigeconstruction@gmail.com
- Phone: (386) 747-5994
- Contact: Eric Vazquez

---

**Note**: This is a simplified version focused on email contact and photo management. All business inquiries should be directed to the email address above.
