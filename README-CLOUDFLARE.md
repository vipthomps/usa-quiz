# GitHub + Cloudflare Pages Deployment Guide

This project is ready to deploy to **GitHub** and **Cloudflare Pages**.

## 1) Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

## 2) Create the Cloudflare Pages project

In Cloudflare Dashboard:

1. Go to **Workers & Pages**
2. Click **Create application**
3. Choose **Pages**
4. Choose **Import an existing Git repository**
5. Select your GitHub repository

## 3) Use these build settings

- Framework preset: None
- Production branch: `main`
- Build command: `exit 0`
- Build output directory: `.`

## Notes

- The site is a plain static HTML/CSS/JS app.
- It loads D3, TopoJSON, and U.S. map data from public CDNs.
- Cloudflare Pages is a good fit for this project.
