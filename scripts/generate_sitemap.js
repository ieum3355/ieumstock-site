const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://ieumstock.site';
const dbPath = path.join(__dirname, '../data/content_db.js');
let dbContent = fs.readFileSync(dbPath, 'utf8');

const vm = require('vm');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(dbContent, sandbox);
const CONTENT_DB = sandbox.CONTENT_DB;

const todayStr = new Date().toISOString().split('T')[0];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${DOMAIN}/</loc>
        <lastmod>${todayStr}</lastmod>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${DOMAIN}/index.html</loc>
        <lastmod>${todayStr}</lastmod>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${DOMAIN}/blog.html</loc>
        <lastmod>${todayStr}</lastmod>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${DOMAIN}/about.html</loc>
        <lastmod>${todayStr}</lastmod>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${DOMAIN}/privacy.html</loc>
        <lastmod>${todayStr}</lastmod>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${DOMAIN}/terms.html</loc>
        <lastmod>${todayStr}</lastmod>
        <priority>0.5</priority>
    </url>
`;

// Add blog posts
if (CONTENT_DB.blog_posts) {
    CONTENT_DB.blog_posts.forEach(post => {
        // Only include published posts
        if (!post.publishDate || post.publishDate <= todayStr) {
            sitemap += `    <url>
        <loc>${DOMAIN}/posts/post-${post.id}.html</loc>
        <lastmod>${post.publishDate || todayStr}</lastmod>
        <priority>0.8</priority>
    </url>\n`;
        }
    });
}

sitemap += `</urlset>`;

const sitemapPath = path.join(__dirname, '../sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap, 'utf8');

console.log('Successfully generated sitemap.xml');
