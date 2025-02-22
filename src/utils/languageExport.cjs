const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');


async function getAuthClient() {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            "type": "service_account",
            "project_id": "talent-hubs-fqhx",
            "private_key_id": "9275b8589c83b0238b18b6334e308eb59a8c1b1a",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCHUyZyl0EjP3oj\nrc7EIrYFE8dbOCFwWf+fz9aGPXwhHsmKEaplCw0OS6K0Vgi9zmca199c1768mpmh\nJwRfxixEHIEFEsNG/6OWMsMSdd+KykdpfeCc+3pIRcYTvTOZ1bj5mxiSKrvRDWMJ\nyWHXJq57wemISMLyzlEJ67ze7OWMUwvQbgBLjHx7D+spllDtMGUSpcuqXtx5c/Ts\nR6NBMICJhCA8rodJC02b/gzeFChmGlgXN2H77epweZsYuQN5gR/XnMXDVlUvG7em\nlcyMPd187ux52ovMV2rAv8DAo5kx3H3iyjsUpBiodX1NmwW40vw+XN7vqQzh4dC0\nA1KLHKSlAgMBAAECggEAGyGZJkVcCmiaINgiieFZtAfkos3Mqn1oyk49uPlPz0Yg\nax2il5KRIgoZC2XqZ7+fnVqljjQ1KhQm9A/iCR+u1VMPrQg3fZ8YWa9AvA1E7csj\naSuTInYq7J2Mmn2HAHNAnE6zrO6DbGTuM9Kb2qqHNgnJPAk2iL7DsaUBX4KIfUsI\ng2PuHH7Mau8xLLf9ObeCKkQbPhYU7MME7JzKLhcUiipAOk1+IEgv/12kTJH43TqK\nNL5gGF+eWhDwMllO1zbCFSGnebCBfibAt/HTtcXvc/CXHFpmPIcauETgDVXGzOmK\nvcommsB9jAvHDgQEtViUlklihe0ryNI70sXcVbu84QKBgQC6wsA+J0AbZjtjB3HE\nlUIu66PfSKdsjk34041w5SpI/oAGHC0jMJlQz1yRGpppJ+n0WJ9BLbuZTXHDlZ/Y\nCj2lRfiXK9lVdk8bzYb3FZfn1x8eI0KWYjU6YMfFx1uxVMU6Z99t8Ku020tXf2wd\nfUuYZ77iuG6sRq8yxdFVW+YS0QKBgQC5fqxCFHXSXzIRlGEpYlR7OY9cnHPDDnt5\nPB/LzVLwfhzKFrr0ouMVDhACNpjEAK6r56dRhzcHCdpGca4igsirj8krOWTz+uuq\n55JzKKnuA0CkZtUp2upV33IV1khXaUadVxH0eCVP937R4qif02KlWnN0/vnku2I4\nrQosQ4rhlQKBgEhDPrtN2KJBZk0k/kJANoGNL7UfmZiJX2YeBSZfpYLk5oh2sohh\nL5FzCrAiiQiTJxUijUxc86+XpaM168ld/QhMEKn9j3Rf+LAbUFOeiU5tkF7K6eLi\nURIrjGDciIAO+tlkg7E4ZFfwWjCa3yxx5KQt0FBNaJVELFoK7LqIendhAoGBAKcd\nQ03JJxjfYLlLx3lEOD5H7iuOXBCYJI9lpnOyyI0X4RIEBmzNru3SHIQR8fFrd/Ix\noqElw2KY8shSNIKs9uLxiFhjvdq87cKsHFmZgfaHgZ5bcqHhswqoYxzfT49IrjCk\nN+3arCruG5g1rptHEvFLmwcFi9cRJn1PEAIu25k9AoGACCe2QljdDSBApPBntUyV\nEHYswoX93FHrkqvaEB9i98NTGcViaoiUStLalRN3t11ZnZF3AVo5nrfLtIQdzRT6\nCMdiM4BhPfg9vatffbewNO/oDyGSI1lzrl4cSEmf9JlZr2UhrVI272EupPBJTXIa\nC1nVIxnxZo19LLVu224lsWM=\n-----END PRIVATE KEY-----\n",
            "client_email": "talenthubs@talent-hubs-fqhx.iam.gserviceaccount.com",
            "client_id": "107898817534560678759",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/talenthubs%40talent-hubs-fqhx.iam.gserviceaccount.com",
            "universe_domain": "googleapis.com"
        },
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