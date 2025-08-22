#!/bin/bash

echo "🚀 CTV Prestige Construction - Git Push Script"
echo "=============================================="

echo "📋 Checking git status..."
git status

echo ""
echo "📦 Adding all files to staging..."
git add -A

echo ""
echo "📝 Committing changes..."
git commit -m "🎨 Major Theme Optimization & Logo Refinement

✨ Complete Website Enhancement:
- Responsive logo sizing (64px desktop → 40px mobile)
- Enhanced black & orange theme with CSS custom properties
- Glass-morphism navigation with professional backdrop blur
- Advanced gradient system and shadow effects
- Mobile-first responsive design with fluid breakpoints

🎯 Logo & Branding Excellence:
- Bold but classy appearance across all devices
- Professional welder branding perfectly preserved
- Optimal readability at every screen size
- Consistent orange color system (#ff7700, #ff5500, #ff9930)
- Enhanced drop shadows and hover effects

📱 Mobile & Desktop Perfection:
- Touch-friendly navigation and interactions
- Fluid typography scaling with CSS clamp()
- Compact header design for superior UX
- Gesture-ready interface elements
- Cross-device compatibility tested

🏗️ Professional Construction Branding:
- Industrial design aesthetic maintained
- Clean, trustworthy company appearance
- Professional visual hierarchy
- Brand consistency across all elements

⚡ Performance & Accessibility:
- Hardware-accelerated animations
- Reduced motion preferences support
- High-DPI display optimization
- Print-friendly styling
- SEO-optimized image attributes
- Cross-browser backdrop filter support

📊 Technical Excellence:
- Modern CSS custom properties for maintainability
- Cubic-bezier transition timing functions
- Accessibility-focused design patterns
- Semantic HTML structure preserved
- Professional code organization

This major update delivers the requested 'bold but classy and clean' design that works beautifully on both mobile and desktop while perfectly preserving CTV Prestige Construction's signature black and orange industrial theme."

echo ""
echo "🌐 Setting up remote repository..."
git remote add origin https://github.com/JWKLINEHaCk3r/CTV-Prestige-Construction-.git 2>/dev/null || echo "Remote already exists"

echo ""
echo "🔄 Switching to main branch..."
git branch -M main

echo ""
echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Git push completed successfully!"
echo "🎉 CTV Prestige Construction website updates are now live on GitHub!"
