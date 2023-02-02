import db from '@/utils/db';
import { request } from '@umijs/max';

export function getProject({ uuid }: { uuid: string }) {
    return db.epProject.get({ uuid });
}

/**
 * @name 获取项目列表
 * @param params
 * @param options
 * @returns
 */
export async function getProjectList(
    params: {
        current: number;
        pageSize: number;
    },
    options?: { [key: string]: any },
) {
    return request('/app/base/project/list', {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}

/**
 * @name 获取项目详情
 * @param params
 * @param options
 * @returns
 */
export async function getProjectDetail(
    params: {
        id: string;
    },
    options?: { [key: string]: any },
) {
    return request('/app/base/project/detail', {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}

/**
 * @name 创建项目
 * @param data
 * @param options
 * @returns
 */
export async function saveProject(
    data?: any,
    options?: { [key: string]: any },
) {
    return request(`/app/base/project/save`, {
        method: 'POST',
        data,
        ...(options || {}),
    });
}

/**
 * @name 更新项目相关信息
 * @param data
 * @param options
 * @returns
 */
export async function updateProject(
    data?: any,
    options?: { [key: string]: any },
) {
    return request(`/app/base/project/update`, {
        method: 'PUT',
        data,
        ...(options || {}),
    });
}

/**
 * @name 删除一个项目
 * @param data
 * @param options
 * @returns
 */
export async function delProject(
    data?: {
        id: string;
    },
    options?: { [key: string]: any },
) {
    return request(`/app/base/project/delete`, {
        method: 'DELETE',
        data,
        ...(options || {}),
    });
}
