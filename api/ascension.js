export default function handler(req, res) {
    // 设置 CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 返回次级页面地址
    res.status(200).json({ 
        granted: true, 
        url: 'Wh3nTh3B08ndD31tyF1rstC4lls08tTh31rN4m3.html' 
    });
}
