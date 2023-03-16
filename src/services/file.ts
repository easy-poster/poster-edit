import { request } from '@umijs/max';

/**
 * @name 上传oss获取签名
 * @param params
 * @param options
 * @returns
 */
export async function getUploadSTS(
    params?: null,
    options?: { [key: string]: any },
) {
    return request('/app/base/comm/uploadSTS', {
        method: 'POST',
        params: null,
        ...(options || {}),
    });
}
