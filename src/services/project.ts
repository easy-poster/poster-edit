import db from '@/utils/db';
import { request } from '@umijs/max';

export function getProject({ uuid }: { uuid: string }) {
    return db.epProject.get({ uuid });
}

export enum OrderTypes {
    TIME = 'time',
    NAME = 'name',
    SIZE = 'size',
}

export interface ProjectInfo {
    id: string;
    uuid: string;
    createTime: Date;
    updateTime: Date;
    title: string;
    description: string;
    content: string;
    cover?: string;
    width: number;
    height: number;
    background?: string;
    userId: string;
}

interface listType<T> {
    list: T[];
    total: number;
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
        search?: string;
        orderType?: OrderTypes;
    },
    options?: { [key: string]: any },
) {
    return request<listType<ProjectInfo>>('/app/base/project/list', {
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
    data?: Partial<ProjectInfo>,
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
    data?: Partial<ProjectInfo>,
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
