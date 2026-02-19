const https = require('https');

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
        // Log the part around Change Value
        const match = body.match(/id="change_value_and_rate"[^>]*>([\s\S]*?)<\/em>/);
        if (match) {
            console.log("--- FOUND BLOCK ---");
            console.log(match[1]);
            console.log("--- END BLOCK ---");

            const isFall = match[1].includes('하락') || match[1].includes('dn');
            console.log("Is Fall Detected?", isFall);

            const numbers = match[1].match(/[0-9,\.]+/g);
            console.log("Numbers found:", numbers);
        } else {
            console.log("Could not find #change_value_and_rate block.");
            console.log("Body excerpt:", body.substring(0, 2000)); // Print first 2k chars to check
        }
    });
});

req.end();
