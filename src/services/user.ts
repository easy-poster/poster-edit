import { UserModelState } from '@/app';
import { storage } from '@/utils';
import { request } from '@umijs/max';

interface loginFormInfo {
    email: string;
    password: string;
    captchaId: string;
    verifyCode: string;
}

/**
 * @name 获取图形验证码
 * @returns
 */
export async function getImgCaptcha(
    params: {
        type?: 'base64';
        width: number;
        height: number;
    },
    options?: { [key: string]: any },
) {
    return request('/app/base/open/captcha', {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}

/**
 * @name 刷新token
 * @returns
 */
export async function refreshToken() {
    return request('/app/base/open/refreshToken', {
        method: 'POST',
        data: {
            refreshToken: storage.get('refreshToken'),
        },
    });
}

/**
 * @name 发送邮箱验证码
 * @param data
 * @param options
 * @returns
 */
export async function sendEmailVerifyCode(
    data: { email: string; type: 'reset' | 'register' },
    options?: { [key: string]: any },
) {
    return request('/app/base/open/sendEmailVerifyCode', {
        method: 'POST',
        data,
        ...(options || {}),
    });
}

/**
 * @name 注册
 * @param data
 * @param options
 * @returns
 */
export async function register(
    data: loginFormInfo,
    options?: { [key: string]: any },
) {
    return request('/app/base/open/register', {
        method: 'POST',
        data,
        ...(options || {}),
    });
}

/**
 * @name 登录
 * @param data
 * @param options
 * @returns
 */
export async function login(
    data: loginFormInfo,
    options?: { [key: string]: any },
) {
    return request('/app/base/open/login', {
        method: 'POST',
        data,
        ...(options || {}),
    });
}

/**
 * @name 重置密码
 * @param data
 * @param options
 * @returns
 */
export async function resetPs(
    data: loginFormInfo,
    options?: { [key: string]: any },
) {
    return request('/app/base/open/forgetPass', {
        method: 'POST',
        data,
        ...(options || {}),
    });
}

/**
 * @name 获取用户信息
 * @param options
 * @returns
 */
export async function getUserInfo(
    params?: {
        userId: string;
    },
    options?: { [key: string]: any },
) {
    return request('/app/base/comm/userInfo', {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}

/**
 * @name 更新用户信息
 * @param data
 * @returns
 */
export async function updateUserInfo(
    data: Partial<UserModelState>,
    options?: { [key: string]: any },
) {
    return request('/app/base/comm/updateUserInfo', {
        method: 'PUT',
        data,
        ...(options || {}),
    });
}

/**
 * @name 更新密码
 * @param data
 * @param options
 * @returns
 */
export async function updatePass(
    data: {
        oldPassword: string;
        newPassword: string;
    },
    options?: { [key: string]: any },
) {
    return request('/app/base/comm/updatePassword', {
        method: 'PUT',
        data,
        ...(options || {}),
    });
}

/**
 * @name 退出登录
 * @param params
 * @param options
 * @returns
 */
export async function logout(options?: { [key: string]: any }) {
    return request('/app/base/comm/logout', {
        method: 'POST',
        ...(options || {}),
    });
}
