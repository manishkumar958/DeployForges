# DeployForge — Online Compiler & DevOps Learning Website

DeployForge is an original starter website for a learning-focused code playground with DevOps learning cards.

## Files
- `index.html` — page structure and content
- `style.css` — responsive visual design
- `script.js` — sample loading, browser demo execution, and HTML preview

## Run locally
Open `index.html` in a modern browser. No build step is required.

## Publish with GitHub and Netlify
1. Create an empty GitHub repository.
2. From this folder, run:
   ```bash
   git init
   git add index.html style.css script.js README.md
   git commit -m "Add DeployForge learning website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
   git push -u origin main
   ```
3. In Netlify, import the GitHub repository.
4. Leave the build command blank and set the publish directory to `.` (repository root).

## Important limitations and safety
- This is a frontend learning demo. It does not execute C, C++, Python, or Java.
- Do not treat browser-based code execution as a secure production compiler. Before allowing public users to run arbitrary code, integrate a reputable execution service or isolated sandbox with strict time, memory, network, and filesystem limits.
- The page links to official documentation for Git, Docker, Jenkins, Kubernetes, and a DevOps roadmap. Those external names belong to their respective owners; this project is not affiliated with them.
- Fonts are loaded from Google Fonts. For a fully offline deployment, remove the `@import` line in `style.css` and use system fonts.

## Copyright / branding note
This starter uses newly authored layout, CSS, copy, and simple CSS/text illustrations; it does not intentionally reuse another compiler site's branding or logo. This is not legal clearance or a guarantee against all copyright, trademark, or other claims. Check the chosen site name and any third-party assets before commercial launch.
