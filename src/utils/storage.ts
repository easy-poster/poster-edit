import store from 'store2';
import { history } from '@umijs/max';

interface TokenStoreProp {
    token: string;
    expire: number;
    refreshToken: string;
    refreshExpire: number;
}

class EStorage {
    // 失效后缀
    readonly suffix = '_deadtime';

    constructor() {
        this.suffix = '_deadtime';
    }

    /**
     * @name 获取
     * @param key
     * @returns
     */
    get(key: string) {
        return store.get(key);
    }

    /**
     * @name 获取全部
     * @returns
     */
    getAll() {
        return store.getAll();
    }

    /**
     * @name 设置
     * @param key
     * @param value
     * @param expires
     */
    set(key: string, value: any, expires?: any) {
        store.set(key, value);

        if (expires) {
            store.set(
                `${key}${this.suffix}`,
                Date.parse(String(new Date())) + expires * 1000,
            );
        }
    }

    /**
     * @name 获取到期时间
     * @param key
     * @returns
     */
    getExpiration(key: string) {
        return this.get(key + this.suffix);
    }

    /**
     * @name 是否过期
     * @param key
     * @returns
     */
    isExpired(key: string) {
        return (
            (this.getExpiration(key) || 0) - Date.parse(String(new Date())) <=
            2000
        );
    }

    /**
     * @name 移除过期时间
     * @param key
     */
    removeExpiration(key: string) {
        store.remove(key + this.suffix);
    }

    /**
     * @name 移除
     * @param key
     */
    remove(key: string) {
        store.remove(key);
        this.removeExpiration(key);
    }

    /**
     * @name 清除全部
     */
    clearAll() {
        store.clearAll();
    }

    /**
     * @name 设置token
     * @param data
     */
    setTokenStore(data: TokenStoreProp) {
        // 请求token
        this.set('token', data.token, data.expire);

        // 刷新token
        this.set('refreshToken', data.refreshToken, data.refreshExpire);
    }

    /**
     * @name 清除用户信息
     */
    clear() {
        this.remove('vcImgId');
        this.remove('token');
        this.remove('refreshToken');
    }

    /**
     * @name 退出
     */
    logout() {
        this.clear();
        history.push('/login');
    }
}

const storage = new EStorage();

export default storage;
