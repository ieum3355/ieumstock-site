const fs = require('fs');
const path = require('path');

// 1. Load content_db.js
const dbPath = path.join(__dirname, '../data/content_db.js');
let dbContent = fs.readFileSync(dbPath, 'utf8');

// Use generic parsing to get the CONTENT_DB object
let CONTENT_DB = {};
const vm = require('vm');
try {
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(dbContent, sandbox);
    CONTENT_DB = sandbox.CONTENT_DB;
} catch (e) {
    console.error("Failed to parse content_db.js");
    process.exit(1);
}

if (!CONTENT_DB.blog_posts) {
    console.error("No blog posts found in CONTENT_DB");
    process.exit(1);
}

// 2. Load the template (blog.html)
const templatePath = path.join(__dirname, '../blog.html');
let templateContent = fs.readFileSync(templatePath, 'utf8');

// Ensure the target directory exists
const postsDir = path.join(__dirname, '../posts');
if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir);
}

// 3. Generate static pages
CONTENT_DB.blog_posts.forEach(post => {
    let postHtml = templateContent;

    // Update Meta Tags and Title
    postHtml = postHtml.replace(
        /<title>([^<]*)<\/title>/,
        `<title>${post.title} | 이음스탁 인사이트</title>`
    );

    // Create a plain text summary for meta description
    const plainTextContent = post.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...';
    postHtml = postHtml.replace(
        /<meta name="description" content="([^"]*)">/,
        `<meta name="description" content="${plainTextContent}">`
    );

    // Adjust paths for CSS, JS, etc. since we are now in /posts/
    postHtml = postHtml.replace(/href="style\.css"/g, 'href="../style.css"');
    postHtml = postHtml.replace(/src="data\/content_db\.js/g, 'src="../data/content_db.js');
    postHtml = postHtml.replace(/src="app\.js/g, 'src="../app.js');
    postHtml = postHtml.replace(/href="index\.html"/g, 'href="../index.html"');
    postHtml = postHtml.replace(/href="blog\.html"/g, 'href="../blog.html"');
    postHtml = postHtml.replace(/href="\/about\.html"/g, 'href="../about.html"');
    postHtml = postHtml.replace(/href="\/privacy\.html"/g, 'href="../privacy.html"');
    postHtml = postHtml.replace(/href="\/terms\.html"/g, 'href="../terms.html"');

    // Internal links within the content might point to blog.html?id=XXX
    // Convert them to post-XXX.html
    let contentStr = post.content.replace(/blog\.html\?id=(\d+)/g, 'post-$1.html');

    // The post HTML structure to inject
    const postContainerHtml = `
        <article class="post-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <div>
                    <span class="tag">Insight #${post.id}</span>
                </div>
                <span class="blog-meta">${post.date}</span>
            </div>
            <h2 class="post-title">${post.title}</h2>
            <div class="post-content">
                ${contentStr}
            </div>
            <div style="margin-top: 3rem; text-align: center; border-top: 1px solid var(--border-color); padding-top: 2rem;">
                <a href="../blog.html" class="calc-btn" style="display: inline-block; width: auto; padding: 0.8rem 2rem;">다른 글 더 읽어보기</a>
            </div>
        </article>
    `;

    // Replace the container placeholder with actual static content
    // We replace the entire '<div id="blog-posts-container">...</div>' div
    postHtml = postHtml.replace(
        /<div id="blog-posts-container">[\s\S]*?<\/div>\s*<div style="text-align: center; margin-top: 50px;"/m,
        `<div id="blog-posts-container">\n${postContainerHtml}\n</div>\n<div style="text-align: center; margin-top: 50px;"`
    );

    // Add a script that tells app.js NOT to re-render the blog dynamically
    postHtml = postHtml.replace(
        /<\/body>/,
        `\n<script>window.IS_STATIC_POST = true;</script>\n</body>`
    );

    const outPath = path.join(postsDir, `post-${post.id}.html`);
    fs.writeFileSync(outPath, postHtml, 'utf8');
    console.log(`Generated: posts/post-${post.id}.html`);
});

console.log(`Successfully generated ${CONTENT_DB.blog_posts.length} static blog pages in /posts/`);
