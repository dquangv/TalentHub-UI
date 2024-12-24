const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function getAuthClient() {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            "type": "service_account",
            "project_id": "talent-hubs-fqhx",
            "private_key_id": "cbf4c3c438e521a4798f05322c9b3ae8b493a88a",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDRmb7ZDF2CCTfH\nxZM6HmeD+H3WMYmHMc0wEPFFl58DAB7BB4VX3OsispMGyeODPRbpBTsgE93iGVN6\nfYPafjIm5f4SH8DecsNkTj5rWk/zJl3/y9ccnRKxs30wqVjWinfTLs6sMuX3rjlJ\nf+rYLyilhLio6kAy4q4ZoscwbD5Ua9QDrWhg9mtwf0o9wDFupltCOyveIN5uw5UZ\nKD9696yJbsb4L87J72q0hS7lCqObQ1aizY3/NeGXDDwGvDHtn3NY0IeHswVCaUAV\nNhM5COVbEZgE5UxrOnPaL2jgsLcxaYM29zfXLpIytEfWtuC0fPnVQELER27194mh\nl1vucLDDAgMBAAECggEASrXCkRsXOYKPn2WNVOoBe8jXEcIWg1n9CWUAmw2wYCFq\n1OMZZHgaWAPO5FyR+/WKdQSoTobGUBE28DJNDVRuC+9u4Ibw+FlvzBEXrqxCUykZ\n2FOQGWLjhvOza+TxBYfVrjDA+iAqWF6BjPFLhENK+bSVHaBhwcGKzRh4Z4otrWkc\nwA/RRmueRlcLilmEzn5WeZhzwHEl9zbyJ7+5aptqtLCt9+0I+lQ/Zs+u5ykicFyp\n1F7CJR355Sx+fk6ni1xo4KTb/t7MHHEQ8h91idOclM+1fulKPKpsBjHN/UdrWZhm\nFxBxJ1WuSq/ZjBRW3Qf6qgAzuhJSwB8bt5WyxyLCAQKBgQDrw5vJss4SD/nOqenv\nIv8LZGTArdWQg+f0W/aEMhRtbqf891lS9+CyR6oWVV93fZd6WSupByTwOsfdueLy\n7/vi6eK26lD/cAt5Knxg9FBC6t3CA66Y/KdGwbyGLQiAjOugbVA3R1r70dsKe9u1\nJ1UK96RNybmCXx//ZhhPxpK/zQKBgQDjl0Br8B7URUj4Diuo9VnBk63xlC+HsFPP\nZPn1vGKpiUr32UPjMR+fOuStWhniMVHMUfRoyLjuhToohusRHdvNfBq9SUaMiXRs\nwYP1JcK78iwCB+PWyS0IF2umkcG4CL8d4k3WkdsQw2lTJFkIpKog0QpyljEz7UPy\nfOItgWgCzwKBgQCyg8c3Hvtns88Ly55FIvOI1bhwKG/X3/jHDscG68CJ58qtAUES\nUHxDoX3JMVV67Y6/5jrn3m/6shdZ7QFJv6qy8zNmGt+/ukAFu8S3yOXo9Vt6Jz2R\nu2SRb+pmkjyo0YssSvj9EjtzB0BanNQMQ77h8gbnm4GqlIpu4Qgxh4LgVQKBgFWc\n1woDeMVnDszpH7leGhZ8hCllEgAb71sL5A9xfzfBQqc7XpM/LmMKl20ygJwa62dN\nyQAFybNIAJmwLwrwTXfd4H0l7Fj/eAFVRltYigmDTtSwvR9V7A+oJ8GwAMxG1gXa\n1GcL1PlYWO2Ctc9PigPwPtrd7sJW1YGJQtfVXxf3AoGAEpNwZzR1ic5ZAiE/AAvr\nREDpKEkDhQT0GzeLb3rZVBKmTSUx4B+8uSOpyTO3vjAoidun1ddQPDxd6NBA2RPy\nf/vsAHtr6Spqr3sFlOXB5F+0LNevDs9cML+Q4ikHrXPHdIBGtR/WMKsgShaVDhvj\nPEgImojh1R0cSSI7SKuIIQk=\n-----END PRIVATE KEY-----\n",
            "client_email": "language@talent-hubs-fqhx.iam.gserviceaccount.com",
            "client_id": "104701492287379168680",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/language%40talent-hubs-fqhx.iam.gserviceaccount.com",
            "universe_domain": "googleapis.com"
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });
    return auth.getClient();
}

async function validateRow(row, rowIndex) {
    const [key, vi, en] = row;
    if (!key || !vi || !en) {
        console.warn(`⚠️ Warning: Incomplete row at index ${rowIndex + 1}. Skipping...`);
        return false;
    }
    return true;
}

async function exportLanguageFiles() {
    try {
        const authClient = await getAuthClient();
        const sheets = google.sheets({ version: 'v4', auth: authClient });

        const spreadsheetId = '1N674_gWnhRI1qXfgDooNaO-d2omMfGP6DS8lJmRhNCc';
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sheet1',
        });

        const rows = response.data.values;
        if (!rows?.length) {
            throw new Error('No data found in spreadsheet.');
        }

        const data = rows.slice(1);
        const languages = {
            vi: {},
            en: {},
            ko: {},
            ja: {},
            zhcn: {},
        };

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

        const localesDir = path.resolve(process.cwd(), 'src/locales');
        if (!fs.existsSync(localesDir)) {
            fs.mkdirSync(localesDir, { recursive: true });
        }
        for (const lang of Object.keys(languages)) {
            const content = `export const ${lang} = ${JSON.stringify(languages[lang], null, 2)};`;
            const filePath = path.join(localesDir, `${lang}.js`);
            fs.writeFileSync(filePath, content);
            console.log(`✅ ${lang.toUpperCase()} language file exported successfully!`);
        }

        console.log('✅ All language files exported successfully!');
    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    }
}

module.exports = {
    exportLanguageFiles
};