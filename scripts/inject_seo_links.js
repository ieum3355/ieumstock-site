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

let seoLinksHtml = `<ul>\n`;

if (CONTENT_DB.blog_posts) {
    CONTENT_DB.blog_posts.forEach(post => {
        if (!post.publishDate || post.publishDate <= todayStr) {
            seoLinksHtml += `            <li><a href="/posts/post-${post.id}.html">${post.title}</a></li>\n`;
        }
    });
}
seoLinksHtml += `        </ul>`;

const indexPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Target the visible container in the footer
const startMarker = '<div id="seo-static-links">';
const endMarker = '</div>';
const startIndex = indexHtml.indexOf(startMarker);

if (startIndex !== -1) {
    const contentStartIndex = startIndex + startMarker.length;
    const endIndex = indexHtml.indexOf(endMarker, contentStartIndex);
    
    if (endIndex !== -1) {
        // Replace content inside the marker
        indexHtml = indexHtml.substring(0, contentStartIndex) + 
                    `\n                ${seoLinksHtml}\n            ` + 
                    indexHtml.substring(endIndex);
    }
}

// Clean up any old hidden blocks if they somehow remain
indexHtml = indexHtml.replace(/<!-- SEO Static Links for Googlebot -->[\s\S]*?<\/div>\s*/g, '');

fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log('Successfully injected SEO static links into index.html');
