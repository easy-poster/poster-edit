import { request } from '@umijs/max';

/**
 * @name 获取资源列表
 * @param params
 * @param options
 * @returns
 */
export async function getResourceList(
    params: {
        current: number;
        pageSize: number;
    },
    options?: { [key: string]: any },
) {
    return request('/app/base/resource/list', {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}

/**
 * @name 获取资源详情
 * @param params
 * @param options
 * @returns
 */
export async function getResourceDetail(
    params: {
        id: string;
    },
    options?: { [key: string]: any },
) {
    return request('/app/base/resource/detail', {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}

/**
 * @name 创建资源
 * @param data
 * @param options
 * @returns
 */
export async function saveResource(
    data?: any,
    options?: { [key: string]: any },
) {
    return request(`/app/base/resource/save`, {
        method: 'POST',
        data,
        ...(options || {}),
    });
}

/**
 * @name 更新资源相关信息
 * @param data
 * @param options
 * @returns
 */
export async function updateResource(
    data?: any,
    options?: { [key: string]: any },
) {
    return request(`/app/base/resource/update`, {
        method: 'PUT',
        data,
        ...(options || {}),
    });
}

/**
 * @name 删除一个资源
 * @param data
 * @param options
 * @returns
 */
export async function delResource(
    data?: {
        id: string;
    },
    options?: { [key: string]: any },
) {
    return request(`/app/base/resource/delete`, {
        method: 'DELETE',
        data,
        ...(options || {}),
    });
}
