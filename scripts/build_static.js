const fs = require('fs');
const path = require('path');

// Configuration
const CONTENT_DB_PATH = path.join(__dirname, '../data/content_db.js');
const TEMPLATE_PATH = path.join(__dirname, '../blog.html');
const OUTPUT_DIR = path.join(__dirname, '../posts');
const SITEMAP_PATH = path.join(__dirname, '../sitemap.xml');
const DOMAIN = 'https://ieumstock.site';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 1. Load Content DB
console.log('📖 Loading Content DB...');
const dbContent = fs.readFileSync(CONTENT_DB_PATH, 'utf8');

// Parse blog_posts from the JS file content
// We used a regex to safely extract the array, similar to the generation script
let blogPosts = [];
try {
    const match = dbContent.match(/"blog_posts":\s*(\[\s*\{[\s\S]*\}\s*\])/);
    if (match) {
        blogPosts = JSON.parse(match[1]);
    } else {
        throw new Error("Could not find blog_posts array in content_db.js");
    }
} catch (e) {
    console.error("❌ Error parsing content_db.js:", e.message);
    process.exit(1);
}

console.log(`✅ Found ${blogPosts.length} posts.`);

// 2. Load Template
const templateHtml = fs.readFileSync(TEMPLATE_PATH, 'utf8');

// 3. Generate Static Files
console.log('🔨 Generating static HTML files...');

blogPosts.forEach(post => {
    let html = templateHtml;

    // A. Update Meta Tags (SEO)
    // Replace Title
    html = html.replace(
        /<title>.*?<\/title>/,
        `<title>${post.title} - 이음스탁 인사이트</title>`
    );
    // Replace Description
    const plainTextSummary = post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';
    html = html.replace(
        /<meta name="description" content=".*?">/,
        `<meta name="description" content="${plainTextSummary}">`
    );
    // Add Canonical Link
    const postUrl = `${DOMAIN}/posts/post-${post.id}.html`;
    html = html.replace(
        /<\/head>/,
        `<link rel="canonical" href="${postUrl}">\n</head>`
    );

    // B. Inject Content
    // Update internal links to point to static files
    // From: blog.html?id=39  ->  post-39.html
    const contentWithStaticLinks = post.content.replace(/blog\.html\?id=(\d+)/g, 'post-$1.html');

    const postContentHtml = `
        <article class="post-card">
            <div class="tag">투자 인사이트</div>
            <h1 class="post-title">${post.title}</h1>
            <div class="blog-meta" style="margin-bottom:20px;">
                <span>📅 ${post.date}</span> | <span>✍️ 이음스탁 AI 리서치팀</span>
            </div>
            <hr style="border:0; border-top:1px solid var(--border-color); margin-bottom:30px;">
            <div class="post-content">
                ${contentWithStaticLinks}
            </div>
            <div style="margin-top:50px; text-align:center;">
                <a href="../blog.html" class="calc-btn" style="text-decoration:none;">목록으로 돌아가기</a>
            </div>
        </article>
    `;

    // Replace the container innerHTML safely
    // use a more specific replacement for the known template structure
    // The issue was non-greedy matching stopping at the inner div's closing tag.
    // We need to match the entire block including the outer div and its inner placeholder.
    html = html.replace(
        /<div id="blog-posts-container">[\s\S]*?<\/div>\s*<\/div>/,
        `<div id="blog-posts-container">\n${postContentHtml}\n</div>`
    );

    // C. Fix Relative Paths
    // Since we are moving from root to /posts/, we need to update src/href links like "style.css", "app.js", "index.html"
    // Simple fix: prepend "../" to known relative assets
    html = html.replace(/href="style.css"/g, 'href="../style.css"');
    html = html.replace(/src="data\/content_db.js"/g, 'src="../data/content_db.js"');
    html = html.replace(/src="app.js"/g, 'src="../app.js"');
    html = html.replace(/href="index.html"/g, 'href="../index.html"');
    html = html.replace(/href="blog.html"/g, 'href="../blog.html"');
    html = html.replace(/href="about.html"/g, 'href="../about.html"');
    html = html.replace(/href="privacy.html"/g, 'href="../privacy.html"');
    html = html.replace(/href="terms.html"/g, 'href="../terms.html"');
    html = html.replace(/href="guide-waterfall.html"/g, 'href="../guide-waterfall.html"');
    html = html.replace(/href="guide-dividend.html"/g, 'href="../guide-dividend.html"');

    // Write file
    const filename = `post-${post.id}.html`;
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), html, 'utf8');
    // console.log(`   Generated: ${filename}`);
});

console.log('✨ All blog posts generated.');

// 4. Update Sitemap
console.log('🗺️ Updating Sitemap...');
const today = new Date().toISOString().split('T')[0];

let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${DOMAIN}/blog.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${DOMAIN}/about.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${DOMAIN}/guide-waterfall.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${DOMAIN}/guide-dividend.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;

// Add posts to sitemap
blogPosts.forEach(post => {
    sitemapContent += `  <url>
    <loc>${DOMAIN}/posts/post-${post.id}.html</loc>
    <lastmod>${post.publishDate || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
});

sitemapContent += `</urlset>`;

fs.writeFileSync(SITEMAP_PATH, sitemapContent, 'utf8');
console.log('✅ Sitemap updated.');
