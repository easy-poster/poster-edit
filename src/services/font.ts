import { request } from '@umijs/max';

interface listType<T> {
    list: T[];
    total: number;
}

export interface FontItem {
    id: string;
    uuid: string;
    name: string;
    cover: string;
    size: number;
    type: number;
    url: string;
    createTime: Date;
    updateTime: Date;
}

/**
 * @name 获取文字列表
 * @param params
 * @param options
 * @returns
 */
export async function getTextList(
    params: {
        current: number;
        pageSize: number;
    },
    options?: { [key: string]: any },
) {
    return request<listType<FontItem>>('/app/base/font/list', {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}

/**
 * @name 获取下拉字体列表
 * @param params
 * @param options
 * @returns
 */
export async function getFontGroupList(
    params: {
        current: number;
        pageSize: number;
    },
    options?: { [key: string]: any },
) {
    return request<listType<FontItem>>('/app/base/fontGroup/list', {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}
