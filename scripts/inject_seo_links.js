const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/content_db.js');
let dbContent = fs.readFileSync(dbPath, 'utf8');

const vm = require('vm');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(dbContent, sandbox);
const CONTENT_DB = sandbox.CONTENT_DB;

const todayStr = new Date().toISOString().split('T')[0];

let seoLinksHtml = `\\n    <!-- SEO Static Links for Googlebot -->\\n    <div id="seo-static-links" style="display:none;">\\n        <ul>\\n`;

if (CONTENT_DB.blog_posts) {
    CONTENT_DB.blog_posts.forEach(post => {
        if (!post.publishDate || post.publishDate <= todayStr) {
            seoLinksHtml += `            <li><a href="/posts/post-${post.id}.html">${post.title}</a></li>\\n`;
        }
    });
}
seoLinksHtml += `        </ul>\\n    </div>\\n`;

const indexPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Remove existing seo-static-links if present
indexHtml = indexHtml.replace(/<!-- SEO Static Links for Googlebot -->[\s\S]*?<\/div>\s*/g, '');

// Inject before </body>
indexHtml = indexHtml.replace('</body>', `${seoLinksHtml}</body>`);

fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log('Successfully injected SEO static links into index.html');
