# GitHub Setup Instructions for CTV Project

## Step 1: Create Repository on GitHub

1. Go to <https://github.com/new>
2. Repository name: `CTV` (or your preferred name)
3. Description: Optional description
4. **IMPORTANT**: Do NOT initialize with README
5. Click "Create repository"

## Step 2: Add Remote and Push

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/CTV.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Authentication

You may be prompted for your GitHub username and password. Use:

- Username: Your GitHub username
- Password: Your GitHub personal access token (recommended) or password

## Alternative: Using SSH (Recommended for future)

If you prefer SSH, generate SSH keys first:

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Then add the public key to GitHub and use SSH URL:

```bash
git remote set-url origin git@github.com:YOUR_USERNAME/CTV.git
git push -u origin main
```

## Current Project Status

- ✅ Git repository initialized
- ✅ All files staged and committed
- ✅ Git configuration updated
- ⏳ Ready to connect to GitHub
