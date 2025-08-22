# Image Management Guide for CTV Prestige Construction

## How to Add Photos to the Website

### Option 1: Direct File Upload (Recommended)

1. **Navigate to the sample photos folder**: 
   - Go to `assets/sample-photos/` directory
   - Choose the appropriate category folder:
     - `welding/` - For welding project photos
     - `container-repair/` - For container repair photos
     - `pressure-washing/` - For pressure washing photos

2. **Add your photos**:
   - Copy your image files directly into the appropriate folder
   - Supported formats: JPG, PNG, WebP
   - Recommended size: 800x600 pixels
   - File size: Under 1MB each

3. **Update the gallery**:
   - Edit `index.html` and update the image `src` attributes to point to your new photos
   - Example: `assets/sample-photos/welding/your-photo-name.jpg`

### Option 2: Admin Panel (LocalStorage - Limited Use)

For quick testing or temporary images:

1. Go to `admin.html` (or your domain URL with `/admin.html`)
2. Login with password: `ctvadmin2024`
3. Upload images (stored in browser localStorage)

⚠️ **Note**: Admin panel images are temporary and only visible in the current browser.

## Image Requirements

- **Formats**: JPG, PNG, WebP
- **Size**: 800x600 pixels recommended
- **File Size**: Under 1MB per image
- **Naming**: Use descriptive names (e.g., `welding-project-1.jpg`)

## Folder Structure

```
assets/
├── sample-photos/
│   ├── welding/           # Welding project photos
│   ├── container-repair/  # Container repair photos
│   └── pressure-washing/  # Pressure washing photos
│   └── README.md         # This guide
```

## Best Practices

1. **Organize by category**: Keep photos in their respective folders
2. **Use descriptive filenames**: Helps with SEO and organization
3. **Optimize images**: Compress images before uploading
4. **Maintain consistency**: Similar sizes and aspect ratios work best

## Troubleshooting

### Images Not Showing
- Check file paths in HTML
- Ensure images are in correct folders
- Verify file permissions

### Quality Issues
- Use image editing software to resize and compress
- Maintain aspect ratio when resizing

## Production Recommendations

For a production website with many images, consider:
1. Cloud storage (AWS S3, Google Cloud Storage)
2. CDN for faster delivery
3. Automated image optimization
4. Database for image management

## Support

For technical assistance:
1. Check browser console for errors
2. Verify file paths and names
3. Ensure images are in correct format and size
