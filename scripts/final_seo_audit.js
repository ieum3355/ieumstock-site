const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\Users\\sjm12\\연습하기';
const postsDir = path.join(baseDir, 'posts');

const adsenseScript = 'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8647754848563648';
const gaScript = 'googletagmanager.com/gtag/js?id=G-YWG53SSXKW';

function auditFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.relative(baseDir, filePath);
    const errors = [];

    // 1. Check Canonical
    const canonicalMatch = content.match(/<link rel="canonical" href="([^"]+)" \/>/g);
    if (!canonicalMatch) {
        errors.push('Missing canonical tag');
    } else if (canonicalMatch.length > 1) {
        errors.push(`Duplicate canonical tags: ${canonicalMatch.length} found`);
    }

    // 2. Check AdSense
    if (!content.includes(adsenseScript)) {
        errors.push('Missing AdSense script');
    }

    // 3. Check GA4
    if (!content.includes(gaScript)) {
        errors.push('Missing GA4 script');
    }

    // 4. Check Charset (UTF-8)
    if (!content.includes('charset="UTF-8"') && !content.includes("charset='UTF-8'")) {
        errors.push('Missing UTF-8 charset meta tag');
    }

    // 5. Check Viewport
    if (!content.includes('name="viewport"')) {
        errors.push('Missing viewport meta tag');
    }

    // 6. Check Title
    if (!content.includes('<title>')) {
        errors.push('Missing title tag');
    }

    // 7. Check Description
    if (!content.includes('name="description"')) {
        errors.push('Missing description meta tag');
    }

    return { fileName, errors };
}

const staticFiles = [
    'index.html',
    'about.html',
    'blog.html',
    'guide-waterfall.html',
    'guide-dividend.html',
    'privacy.html',
    'terms.html'
];

const results = [];

staticFiles.forEach(file => {
    const filePath = path.join(baseDir, file);
    if (fs.existsSync(filePath)) {
        results.push(auditFile(filePath));
    } else {
        results.push({ fileName: file, errors: ['File does not exist'] });
    }
});

if (fs.existsSync(postsDir)) {
    const posts = fs.readdirSync(postsDir).filter(f => f.endsWith('.html'));
    posts.forEach(post => {
        results.push(auditFile(path.join(postsDir, post)));
    });
}

const failed = results.filter(r => r.errors.length > 0);

if (failed.length === 0) {
    console.log('✅ All checked files passed SEO & Scripts audit!');
} else {
    console.log(`❌ Found issues in ${failed.length} files:`);
    failed.forEach(r => {
        console.log(`\n[${r.fileName}]`);
        r.errors.forEach(e => console.log(`  - ${e}`));
    });
}
