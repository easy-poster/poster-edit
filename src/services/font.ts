import { request } from '@umijs/max';

interface listType<T> {
    list: T[];
    total: number;
}

export interface FontItem {
    id: string;
    uuid: string;
    fontName: string;
    fontNormalUrl: string;
    fontCover: string;
    isVip: boolean;
    createTime: Date;
    updateTime: Date;
}

/**
 * @name 获取文字列表
 * @param params
 * @param options
 * @returns
 */
export async function getFontList(
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
