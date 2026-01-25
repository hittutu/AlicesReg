import crypto from 'crypto';

// --- 真名配置 ---
const RAW_SECRETS = {
    'input-top': 'AClergies',
    'input-left': 'Sacrilege',
    'input-right': 'GraceLies'
};

// 计算 Hash 的辅助函数
const getHash = (text) => crypto.createHash('sha256').update(text.toLowerCase()).digest('hex');

// 预计算正确答案的 Hash
const SECRET_HASHES = {};
Object.keys(RAW_SECRETS).forEach(key => {
    SECRET_HASHES[key] = getHash(RAW_SECRETS[key]);
});

// Vercel Serverless Function 处理函数
export default function handler(req, res) {
    // 设置 CORS 头，允许你的网页跨域访问（虽然在同域名下通常不需要，但以防万一）
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // 处理预检请求 (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { positionId, text } = req.body;

    if (!positionId || !text) {
        return res.status(400).json({ success: false });
    }

    const targetHash = SECRET_HASHES[positionId];
    if (!targetHash) {
        return res.json({ success: false });
    }

    // 校验
    const inputHash = getHash(text.trim());

    if (inputHash === targetHash) {
        return res.json({ success: true });
    } else {
        return res.json({ success: false });
    }
}
