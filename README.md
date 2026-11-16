# protosol.github.io
Personal site (Jekyll, custom mono theme, deployed by GitHub Actions on push to `main`).

## Writing a post from a .txt file
1. Copy `blog_post_template.txt` to `_posts/YYYY-MM-DD-your-title.txt`.
2. Edit the header (title, date, categories) and write the body in plain text or Markdown.
3. `git add _posts && git commit -m "new post" && git push`.

Add `published: false` to the header to keep a draft off the site. You can also open `/admin/`
(needs a fine-grained GitHub token), use "Import a .txt post", review and Save.

## Local development
```bash
bundle install --path vendor/bundle
bundle exec jekyll serve   # http://localhost:4000
```

## Structure
- `_layouts/`, `_includes/`, `assets/main.scss`, `assets/theme.js`: the theme
- `_data/metrics.yml`: numbers for the home-page ASCII bar chart
- `index.md`, `about.md`, `portfolio.md`, `blog/index.md`, `404.md`: pages
- `_posts/`: posts (`.md` or `.txt`)
- `admin.html`, `assets/admin.js`: browser blog editor
