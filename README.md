# Business Analyst Portfolio (static)

Plain HTML, CSS and JavaScript. No npm, Node, React or build step.

## Upload to GitHub
1. Create a new repository on github.com.
2. Click **Add file > Upload files** and drag in everything inside this folder (index.html must sit in the repository root).
3. Click **Commit changes**.

## Turn on GitHub Pages
**Settings > Pages > Deploy from a branch > main > / (root) > Save.** GitHub serves `index.html` at `https://YOUR-USERNAME.github.io/REPO-NAME/`.

## Edit your content
Almost everything lives in `assets/js/data.js`: name, title, bio, About text, skills, experience, education, projects (including case-study text), CV path, contact details, LinkedIn, GitHub and the Formspree endpoint. Edit only the text between quotes.

- **Images:** put files in `assets/images/` and set the project's `image` path in data.js. Redwood Insurance has no image yet: add `project-03.jpg` and set `image: "assets/images/project-03.jpg"`.
- **CV:** replace `assets/documents/Ewaen_Erhahon_BA_CV.pdf` (or change the `resume` path).
- **Add a project:** copy one project block in data.js and change the text.
- **Colours:** variables at the top of `assets/css/style.css`.
- **Fonts:** `--serif` and `--sans` in the same place.
- **Page title and social metadata:** the `<head>` of index.html.
- **Favicon:** replace `favicon.ico` in the root.
