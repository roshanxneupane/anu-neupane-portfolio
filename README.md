# Anu Neupane — Personal Portfolio (Updated)

Static, responsive portfolio for GitHub Pages. Built with HTML, Tailwind CSS CDN, custom CSS, JavaScript and Three.js. No backend or build step is required.

## Run locally
```bash
cd anu-neupane-portfolio
python3 -m http.server 8000
```
Open http://localhost:8000.

## Add photographs
Place images in `assets/images/`:
- `anu-profile.jpg` — hero portrait
- `gallery-01.jpg` through `gallery-06.jpg` — slideshow photos

Update captions, descriptions and categories in the `photos` array near the top of the slideshow section in `script.js`. The slideshow supports category filters, next/previous controls, autoplay, thumbnails, full-screen lightbox, keyboard arrows and touch swipe.

## Add documents
Place public PDF files in `assets/documents/` using these names or change the links in `index.html`:
- `anu-neupane-cv.pdf`
- `certificate-01.pdf`
- `academic-record.pdf`
- `publication.pdf`

To add a document, copy one `<article class="document-card"...>` block in the document grid, change its `data-category`, `data-search`, title, description, and both file links. Supported categories: `cv`, `certificate`, `academic`, `other`. Search and category filters are built in.

**Privacy:** Do not upload citizenship/passport scans, private transcripts, home address, signatures, full birth date, or any document that should not be public. GitHub Pages and public repository files are publicly accessible.

## Personalize
- Edit biography, timeline, skills, project cards and social links in `index.html`.
- Change skill percentages using `data-level` attributes.
- Replace `your-email@example.com` in `index.html` and `script.js`.
- Change project `href="#"` and social profile `href="#"` to real URLs.
- Replace placeholder content with accurate details before publishing.

## Publish with GitHub Pages
1. Create a public GitHub repository, e.g. `anu-neupane-portfolio`.
2. Upload the contents of this folder to the repository root (`index.html` must be at root).
3. Repository **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Choose branch `main`, folder `/ (root)`, then Save.
6. Wait for the Pages deployment workflow to finish. The site URL will be `https://YOUR-USERNAME.github.io/anu-neupane-portfolio/`.

## Update after publishing
```bash
git add .
git commit -m "Update portfolio"
git push
```

Tailwind CDN, Google Fonts and Three.js use external CDNs and need internet access. The contact email button uses `mailto:`; a real message form needs a separate form service.
