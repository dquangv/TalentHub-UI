interface EnvironmentConfig {
    API_URL: string;
    WEBSOCKET_URL: string;
    TIMEOUT: number;
    OAUTH_BASE_URL: string;
    PY_URL: string;
}

interface Config {
    development: EnvironmentConfig;
    production: EnvironmentConfig;
    current: EnvironmentConfig;
}

const config: Config = {
    development: {
        API_URL: 'http://localhost:8080/api',
        WEBSOCKET_URL: 'http://localhost:8080',
        TIMEOUT: 30000,
        OAUTH_BASE_URL: 'http://localhost:8080/oauth2/authorization',
        PY_URL: 'http://localhost:5000'
    },
    production: {
        API_URL: 'https://api.talenthub.io.vn/api',
        WEBSOCKET_URL: 'https://api.talenthub.io.vn',
        TIMEOUT: 30000,
        OAUTH_BASE_URL: 'https://api.talenthub.io.vn/oauth2/authorization',
        PY_URL: 'https://c919-113-161-50-174.ngrok-free.app'
    },
    get current() {
        const env = process.env.NODE_ENV || 'development';
        return this[env as keyof Pick<Config, 'development' | 'production'>];
    }
};

export default config;