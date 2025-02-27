const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');


async function getAuthClient() {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            "type": "service_account",
            "project_id": "talent-hubs-fqhx",
            "private_key_id": "e3f6c1b6f3bd46dbb580c20c226c00104b400992",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC1xJtB+GQYE676\nsE5rYlIIexuZPdZXdP329pAnQaeMJ8lxQ5IR2DoZP5bHjT+NUB1Sr14tsKQ6kOFN\n0+ae68UDGsrlj5ARrXseVQr3twvAmmcFeO5jUgEbqwN0iKBv6NdDpubWJfnovam8\nxjRcIMAuWaiNvrEKblFxlf0Qmr9/MVvK0b1a/laOblxhAK/3i2E1Zm6BZecxgIl3\nWmhIo6V5B7QS9sl80jcp9KBjqwhMWlqnTaIqPB6z/ZHsUdOYHU8Xr7Ro2UNSCWBQ\ntVtmHqmqMdBDzh1Zzf+J0kfgT8TfQe1dzrNsa2iHX1yGa/YUiURYtZaEb5Irm9Bc\nnhDFzJWdAgMBAAECggEADBs9MAaoPAZLmDzX7EUPK6tvaiR5Ozf6llFTxpmT3Dzm\nKNoUR4X8UKQwmbfprLLSUSiHAEoMli4CI5nieWFArPVC4ElQkizYz2tgoKEbckeW\nZwHn9suGcV5Ri5hx/yIl/EaIh2jeHUdMn9sfr6cqxauJE2/JAOXaHNOdmFaGPKVi\n6QHs39awQhOj5pd78eWmCgqVgmj8qad1K9A1N0FYYKvGApqCmfdWA+8XOiAmY7Ud\nbuE2uYCxbOLHmgEoyKxEGmSTqUzh+cAMflfWKTCGU59pRGxXi8bknilOO/yFWp0W\nKyT1D0DAx+33rTEIY+PuIH8PYxcDEX5CCtvtvzNooQKBgQD52v880RG6Dp3OPUT/\n3UuA+xQp38r2Db+yhS0El3o9aZ5o3HebcirjYaC9kPVrWs+cCBzpbro8HYwyZlZN\nAdP37c2wr6wfqG4N+jXuRsIcnYwc0JHaHsFEgA7mUOE7vBax/eWtr2aIEk+JSTS7\nYYQJGxUdLi5TZabRgQzyXgK91QKBgQC6PPRZYCI10d6h1PIkBydsW1zK4K6GtscR\nDPUV1qntMOQBPDa8tIC83VFLynn/AwxZZSYwKDeF8q9G9l3kMxv1tccmgk7nkctI\nHC6UTE351Vt1aO+rcRkGC9IFHQXyHCn0VoTl0kK/sQPiTWtzarAwt7jC34b4A4TF\nFQs/arY0qQKBgDoWE6iL4lci9sTvsY7aX6dIt9NUV9cEM0DJfUHIBX8pgs5WEuhs\njlP2amwnuyaOIh3gNPh/6YP4SpOc/wtAFYtaGaut65IgkhVlygvvH0mPxvcb9gyD\ngeLu8ofQ3cwJWi1fHXpXgLq5pwv/nObDMPL8/Nef2N1CkJm8Kspd2L1RAoGAKCdQ\nP5zcg2IWcCnrcx0fwNsJ7Kv4tQ7faKu0g9relEdAQYvr+U+pmg7VolOrbfIITZXj\nX+qr3fNvGwuvPq5OTvG8WG8r9/2VKJz65fp1rXH04CGZ2wrtbEJMK9IQIB02Znno\n+WwV/CJ8ReSPUDkmd7qE2W88OGj5zUw2OpwVYNECgYBt14VBRhkM4Qk0I2Ye4Hgl\nfdKqZhCq8Num9yanZFih1qCD/sNmY8K9PTBmnG17hN3ovk4+B/0gRpm/0qgVuPjV\noHewihtJpeLdFNslcRUB4AT+SeUyIDdQXuAg3CVyQRL96RCoo63S48FNHIgwJe3r\n9ULIODxiXEvO9dgPoGYwJQ==\n-----END PRIVATE KEY-----\n",
            "client_email": "talenthubs@talent-hubs-fqhx.iam.gserviceaccount.com",
            "client_id": "107898817534560678759",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/talenthubs%40talent-hubs-fqhx.iam.gserviceaccount.com",
            "universe_domain": "googleapis.com"
        }
        ,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });
    return auth.getClient();
}

async function validateRow(row, rowIndex) {
    const [key, vi, en] = row;
    if (!key || !vi || !en) {
        console.warn('\n🚨 CẢNH BÁO 🚨');
        console.warn('┌─────────────────────────────────────────┐');
        console.warn(`│ Dòng ${rowIndex + 1} thiếu dữ liệu! Bỏ qua...      │`);
        console.warn('└─────────────────────────────────────────┘');
        return false;
    }
    return true;
}


async function exportLanguageFiles() {
    // Dynamic imports for ESM modules
    const [chalk, gradient] = await Promise.all([
        import('chalk').then(m => m.default),
        import('gradient-string').then(m => m.default)
    ]);

    try {
        // Tạo signature với gradient màu
        const signature = gradient(['#FF512F', '#DD2476', '#FF512F']).multiline([
            '  ╔═══════════════════════════════════════╗',
            '  ║           Language Exporter           ║',
            '  ║          © 2025 Quang Bùi             ║',
            '  ╚═══════════════════════════════════════╝'
        ].join('\n'));

        console.log('\n' + signature + '\n');

        console.log(chalk.bgCyan.white.bold(' KHỞI ĐỘNG ') + chalk.cyan(' 🚀 Bắt đầu xuất file ngôn ngữ...\n'));

        const authClient = await getAuthClient();
        const sheets = google.sheets({ version: 'v4', auth: authClient });

        console.log(chalk.blue('📊 ') + chalk.blue.bold('Đang kết nối với Google Sheets...'));
        const spreadsheetId = '1N674_gWnhRI1qXfgDooNaO-d2omMfGP6DS8lJmRhNCc';
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sheet1',
        });

        const rows = response.data.values;
        if (!rows?.length) {
            throw new Error('❌ Không tìm thấy dữ liệu trong bảng tính!');
        }

        console.log(chalk.magenta('📝 ') + chalk.magenta.bold('Đang xử lý dữ liệu...'));
        const data = rows.slice(1);
        const languages = {
            vi: {},
            en: {},
            ko: {},
            ja: {},
            zhcn: {},
        };

        // Generate type interface based on keys
        const keys = data.map(row => row[0]).filter(Boolean);
        const typeInterface = `export interface TranslationType {
${keys.map(key => `  "${key}": string;`).join('\n')}
}\n\n`;

        // Process each row
        data.forEach((row, index) => {
            if (validateRow(row, index)) {
                const [key, vi, en, ko, ja, zhcn] = row;
                languages.vi[key] = vi.trim();
                languages.en[key] = en.trim();
                languages.ko[key] = ko.trim();
                languages.ja[key] = ja.trim();
                languages.zhcn[key] = zhcn.trim();
            }
        });

        console.log('\n' + chalk.yellow('📂 ') + chalk.yellow.bold('Đang tạo thư mục locales...'));
        const localesDir = path.resolve(process.cwd(), 'src/locales');
        if (!fs.existsSync(localesDir)) {
            fs.mkdirSync(localesDir, { recursive: true });
        }

        const typesPath = path.join(localesDir, 'types.ts');
        fs.writeFileSync(typesPath, typeInterface);
        console.log('\n' + chalk.green('✨ ') + chalk.green.bold('Thành công: ') + chalk.green('Đã tạo file types.ts'));
        console.log(chalk.green('├─ 📝 Chứa các định nghĩa kiểu dữ liệu'));
        console.log(chalk.green('└─ 🔍 Hỗ trợ TypeScript type checking\n'));

        console.log(chalk.cyan('🌍 ') + chalk.cyan.bold('Đang xuất các file ngôn ngữ:'));
        for (const lang of Object.keys(languages)) {
            const content = `import { TranslationType } from './types';\n\nexport const ${lang}: TranslationType = ${JSON.stringify(languages[lang], null, 2)};\n`;
            const filePath = path.join(localesDir, `${lang}.ts`);
            fs.writeFileSync(filePath, content);
            console.log(chalk.cyan(`├─ 🎯 ${lang.toUpperCase()}: `) + chalk.greenBright.bold('Xuất thành công!'));
        }

        const rainbow = gradient(['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8F00FF']);
        console.log('\n' + rainbow('🎉 HOÀN THÀNH 🎉'));
        console.log(chalk.greenBright('┌────────────────────────────────────────┐'));
        console.log(chalk.greenBright('│  ✅ ') + chalk.white.bold('Đã xuất toàn bộ file ngôn ngữ  ') + chalk.greenBright('│'));
        console.log(chalk.greenBright('│  ✅ ') + chalk.white.bold('Kiểm tra thư mục src/locales    ') + chalk.greenBright('│'));
        console.log(chalk.greenBright('└────────────────────────────────────────┘\n'));

        console.log(gradient(['#00FF00', '#00FFFF']).multiline([
            '  =*==*==*==⭐️ Powered by Quang Bùi ⭐️==*==*==*=',
        ].join('\n')) + '\n');

    } catch (error) {
        console.error('\n' + chalk.red.bold('❌ LỖI ❌'));
        console.error(chalk.red('┌─────────────────────────────────────┐'));
        console.error(chalk.red(`│ ${error.message.padEnd(35)} │`));
        console.error(chalk.red('└─────────────────────────────────────┘\n'));
        throw error;
    }
}

module.exports = {
    exportLanguageFiles
};