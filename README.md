# protosol.github.io
This is the portfolio website that is being hosted via the github pages.
This is not being updated with the laatest information but I will update this sooner.

## Local Development

1.  **Install Ruby and Bundler**:
    Ensure you have Ruby installed. Then install Bundler:
    ```bash
    gem install bundler
    ```

2.  **Install Dependencies**:
    Run the following command to install the required gems locally:
    ```bash
    bundle install --path vendor/bundle
    ```

3.  **Run the Site**:
    Start the local server:
    ```bash
    bundle exec jekyll serve
    ```

4.  **View the Site**:
    Open your browser and navigate to `http://localhost:4000`.


## Structure

-   `_posts/`: Contains blog posts.
-   `portfolio.md`: The portfolio page.
-   `about.md`: The about page with resume information.
-   `blog.md`: The blog page with pagination.
-   `_config.yml`: Site configuration.
-   `blog_post_template.txt`: Template for creating new blog posts.

## Adding Blog Posts

Use `blog_post_template.txt` as a starting point. Copy its content, rename to `YYYY-MM-DD-title.md`, and place in `_posts/`.
