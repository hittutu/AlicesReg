const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const app = express();
const PORT = 3000;

// 允许跨域请求 (方便本地调试)
app.use(cors());
app.use(express.json());

// --- 真名数据库 (加密存储) ---
// 为了安全，生产环境中通常存储 Hash 值，而不是明文。
// 这里我们在服务器启动时自动计算 Hash，模拟数据库中的加密存储。
// 这样即使有人看到了这部分内存变量，看到的也是乱码。

const RAW_SECRETS = {
    'input-top': 'AClergies',
    'input-left': 'Sacrilege',
    'input-right': 'GraceLies'
};

const SECRET_HASHES = {};

// 初始化：将真名转换为 SHA-256 Hash 存入内存
// 统一转换为小写进行 Hash，实现大小写不敏感校验
Object.keys(RAW_SECRETS).forEach(key => {
    const hash = crypto.createHash('sha256').update(RAW_SECRETS[key].toLowerCase()).digest('hex');
    SECRET_HASHES[key] = hash;
    console.log(`[System] Loaded Hash for ${key}: ${hash.substring(0, 10)}...`);
});

// --- API 接口 ---

// 校验接口
// POST /api/verify
// Body: { positionId: "input-top", text: "..." }
app.post('/api/verify', (req, res) => {
    const { positionId, text } = req.body;

    // 1. 基础校验
    if (!positionId || !text) {
        return res.status(400).json({ success: false, message: "Invalid payload" });
    }

    // 2. 获取目标位置的正确 Hash
    const targetHash = SECRET_HASHES[positionId];
    if (!targetHash) {
        return res.status(404).json({ success: false, message: "Unknown position" });
    }

    // 3. 计算用户输入的 Hash (同样转小写)
    const inputHash = crypto.createHash('sha256').update(text.trim().toLowerCase()).digest('hex');

    // 4. 比对 Hash
    if (inputHash === targetHash) {
        console.log(`[Verify] Success: ${positionId}`);
        return res.json({ success: true });
    } else {
        console.log(`[Verify] Failed: ${positionId} (Input: ${text})`);
        return res.json({ success: false });
    }
});

app.listen(PORT, () => {
    console.log(`\n>>> Tea Party Protocol Server running on http://localhost:${PORT}`);
    console.log(`>>> Waiting for verification requests...\n`);
});
