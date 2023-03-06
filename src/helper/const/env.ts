const envMap = {
    DEV: {
        base_url: 'http://192.168.1.10:9001',
        cdn_url: '',
    },
    PROD: {
        base_url: 'http://api.eposter.com',
        cdn_url: '',
    },
};

const env = envMap[ENV];

export default env;
