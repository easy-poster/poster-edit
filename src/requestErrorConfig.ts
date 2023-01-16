import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message } from 'antd';
import env from './helper/const/env';
import { storage } from './utils';

interface ResponseStructure {
    data: any;
}

const HttpBaseUrl = env.base_url;

const TIMEOUT = 1000 * 20;

// 是否刷新中
let isRefreshing = false;

// 请求队列
let queue: Array<(token: string) => void> = [];

export const errorConfig: RequestConfig = {
    timeout: TIMEOUT,
    withCredentials: false,
    baseURL: HttpBaseUrl,

    // 错误处理
    errorConfig: {
        errorThrower: (res) => {
            console.log('res', res);
        },

        errorHandler: (error: any, opts: any) => {
            if (opts?.skipErrorHandler) throw error;

            if (error.code === 'ERR_NETWORK') {
                message.error('网络错误, 请稍后再试');
            }

            if (error.response) {
                // Axios 的错误
                // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
                const { status } = error.response;

                if (status === 401) {
                    storage.logout();
                } else {
                    switch (status) {
                        case 403:
                            break;
                        case 500:
                            break;
                        case 502:
                            break;
                        default:
                            break;
                    }
                }
            } else if (error.request) {
                // 请求已经成功发起，但没有收到响应
                // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
                // 而在node.js中是 http.ClientRequest 的实例
                message.error('服务器未响应, 请稍后再试');
            }
        },
    },

    // 请求拦截
    requestInterceptors: [
        (config: RequestOptions) => {
            if (ENV === 'DEV') {
                console.group(config.url);
                console.log('method:', config.method);
                console.table(
                    'data:',
                    config.method === 'get' ? config.params : config.data,
                );
                console.groupEnd();
            }
            const data = storage.getAll();

            if (data?.token) {
                // 请求标识
                if (config.headers) {
                    config.headers['Authorization'] = data.token;
                }

                // 刷新token接口放行
                if (config.url?.includes('refreshToken')) {
                    return config;
                }

                // 判断token是否过期
                if (storage.isExpired('token')) {
                    // 判断refreshToken是否过期
                    if (storage.isExpired('refreshToken')) {
                        return storage.logout();
                    }

                    // 是否在刷新中
                    if (!isRefreshing) {
                        isRefreshing = true;

                        storage
                            .refreshTokenStore()
                            .then((token) => {
                                queue.forEach((cb) => cb(token));
                                queue = [];
                                isRefreshing = false;
                            })
                            .catch(() => {
                                // storage.clear();
                            });
                    }

                    return new Promise((resolve) => {
                        // 继续请求
                        queue.push((token) => {
                            if (config.headers) {
                                config.headers['Authorization'] = token;
                            }
                            resolve(config);
                        });
                    });
                }
            }

            return config;
        },
    ],

    // 响应拦截
    responseInterceptors: [
        (response) => {
            const res = response as unknown as ResponseStructure;

            if (!res?.data) {
                return res;
            }

            const { code, message } = res.data;

            if (!code) {
                return res.data;
            }

            switch (code) {
                case 1000:
                    return res.data;
                default:
                    return Promise.reject({ code, message });
            }
        },
    ],
};
