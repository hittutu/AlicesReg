const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- 神秘学配置 ---
// 真正的秘密只存在于服务器内存中
const RAW_SECRETS = {
    'input-top': 'AClergies',
    'input-left': 'Sacrilege',
    'input-right': 'GraceLies'
};

// 终局跳转地址 (后端独有)
const ASCENSION_URL = 'Wh3nTh3B08ndD31tyF1rstC4lls08tTh31rN4m3.html';

// 启动时计算 Hash，销毁明文
const SECRET_HASHES = {};
Object.keys(RAW_SECRETS).forEach(key => {
    // 使用 SHA-256 签名
    const hash = crypto.createHash('sha256').update(RAW_SECRETS[key].toLowerCase()).digest('hex');
    SECRET_HASHES[key] = hash;
    console.log(`[System] Seal loaded for ${key}: ${hash.substring(0, 8)}...`);
});

// --- API 接口 ---

// 1. 真名校验接口
app.post('/api/verify', (req, res) => {
    const { positionId, text } = req.body;

    if (!positionId || !text) return res.status(400).json({ success: false });

    const targetHash = SECRET_HASHES[positionId];
    if (!targetHash) return res.json({ success: false });

    // 计算用户输入的指纹
    const inputHash = crypto.createHash('sha256').update(text.trim().toLowerCase()).digest('hex');

    if (inputHash === targetHash) {
        console.log(`[Verify] Unlocked: ${positionId}`);
        return res.json({ success: true });
    } else {
        return res.json({ success: false });
    }
});

// 2. 飞升接口 (获取跳转地址)
app.post('/api/ascension', (req, res) => {
    // 在更严格的系统中，这里应该校验 Session 或 Token 证明用户真的解开了3个谜题
    // 但为了保持无状态的灵活性，我们在这里简单响应
    console.log(`[Ascension] Gate Opened.`);
    res.json({ 
        granted: true, 
        url: ASCENSION_URL 
    });
});

app.listen(PORT, () => {
    console.log(`\n>>> Tea Party Protocol Server running on http://localhost:${PORT}`);
    console.log(`>>> Waiting for the chosen one...\n`);
});
