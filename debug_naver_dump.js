const https = require('https');
const fs = require('fs');

const options = {
    hostname: 'finance.naver.com',
    path: '/sise/sise_index.naver?code=KOSPI',
    method: 'GET',
    headers: { 'User-Agent': 'Mozilla/5.0' }
};

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        fs.writeFileSync('naver_dump_kospi.html', body);
        console.log('Dumped to naver_dump_kospi.html');
    });
});

req.end();
