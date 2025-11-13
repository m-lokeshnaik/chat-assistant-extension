# GitHub Deployment Guide

## Steps to Deploy to GitHub

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., `chat-assistant-extension`)
5. Choose visibility (Public or Private)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

### 2. Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these commands in your terminal:

```bash
# Add the remote repository (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### 3. Alternative: Using SSH

If you prefer SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

### 4. Verify Deployment

After pushing, refresh your GitHub repository page. You should see all your files there.

## Future Updates

To push future changes:

```bash
git add .
git commit -m "Your commit message"
git push
```

## Important Notes

- **Icons**: The `src/icons/` folder contains a README. You'll need to add actual icon PNG files before building the extension.
- **node_modules**: Already excluded via `.gitignore`
- **dist/**: Build output is excluded - users should build locally

## GitHub Actions (Optional)

You can set up CI/CD to automatically build the extension on push. Create `.github/workflows/build.yml`:

```yaml
name: Build Extension

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: extension-build
          path: dist/
```

