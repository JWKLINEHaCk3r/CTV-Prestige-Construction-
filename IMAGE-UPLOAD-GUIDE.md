# Image Upload Guide for CTV Prestige Construction

## How to Add Pictures to the Website

### Step 1: Access the Admin Panel
1. Go to `https://your-domain.com/admin.html` (or open `admin.html` locally)
2. Login with the password: `ctvadmin2024`

### Step 2: Upload Images
1. Click "Choose File" to select an image from your computer
2. (Optional) Add a description for the image
3. Click "Upload Image" to save it

### Step 3: View Images on Website
- Uploaded images will automatically appear in the gallery section of the main website
- Images are stored in your browser's localStorage

## Important Notes

### Storage Limitations
- Browser localStorage has a limit of ~5-10MB
- Each image is stored as base64 (larger than original file)
- Recommended: Keep images under 1MB each
- For many images, consider using a proper backend

### Browser Compatibility
- Images are stored per browser/device
- If you clear browser data, images will be lost
- For permanent storage, implement a backend solution

### Image Requirements
- Supported formats: JPG, PNG, GIF, WebP
- Optimal size: 800x600 pixels or similar
- File size: Under 1MB recommended

## Troubleshooting

### Images Not Showing
- Check if browser allows localStorage
- Clear browser cache and reload
- Try a different browser

### Upload Fails
- Check file size (keep under 5MB)
- Ensure you have storage space available
- Check browser console for errors

## Future Improvements
For production use with many images, consider:
1. Cloud storage (AWS S3, Google Cloud Storage)
2. Database for image metadata
3. CDN for faster delivery
4. Image compression before upload

## Support
For technical issues with image uploads, check the browser console for error messages.
