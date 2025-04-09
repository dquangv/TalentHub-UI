interface EnvironmentConfig {
    API_URL: string;
    WEBSOCKET_URL: string;
    TIMEOUT: number;
    OAUTH_BASE_URL: string;
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
        OAUTH_BASE_URL: 'http://localhost:8080/oauth2/authorization'
    },
    production: {
        API_URL: 'https://not-antarctica-platforms-varying.trycloudflare.com/api',
        WEBSOCKET_URL: 'https://not-antarctica-platforms-varying.trycloudflare.com',
        TIMEOUT: 30000,
        OAUTH_BASE_URL: 'https://not-antarctica-platforms-varying.trycloudflare.com/oauth2/authorization'
    },
    get current() {
        const env = process.env.NODE_ENV || 'development';
        return this[env as keyof Pick<Config, 'development' | 'production'>];
    }
};

export default config;