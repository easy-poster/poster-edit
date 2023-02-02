import { request } from '@umijs/max';

export enum brandType {
    LOGO = 'logo',
    COLOR = 'color',
    FONT = 'font',
}

/**
 * @name 获取品牌箱列表
 * @returns
 */
export async function getBrandList(
    params: {
        current: number;
        pageSize: number;
    },
    options?: { [key: string]: any },
) {
    return request('/app/base/brand/list', {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}

/**
 * @name 获取工具箱基本信息
 * @param params
 * @param options
 * @returns
 */
export async function getBrandItemDetail(
    params: {
        id: string;
    },
    options?: { [key: string]: any },
) {
    return request('/app/base/brand/detail', {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}

/**
 * @name 创建品牌工具箱
 * @param data
 * @param options
 * @returns
 */
export async function saveBrandItem(
    data?: any,
    options?: { [key: string]: any },
) {
    return request(`/app/base/brand/save`, {
        method: 'POST',
        data,
        ...(options || {}),
    });
}

/**
 * @name 更新工具箱相关信息
 * @param data
 * @param options
 * @returns
 */
export async function updateBrandItem(
    data?: any,
    options?: { [key: string]: any },
) {
    return request(`/app/base/brand/update`, {
        method: 'PUT',
        data,
        ...(options || {}),
    });
}

/**
 * @name 删除一个品牌箱
 * @param data
 * @param options
 * @returns
 */
export async function delBrandItem(
    data?: {
        id: string;
    },
    options?: { [key: string]: any },
) {
    return request(`/app/base/brand/delete`, {
        method: 'DELETE',
        data,
        ...(options || {}),
    });
}

/**
 * @name 获取品牌详情
 * @param path type logo, color, font
 * @param params
 * @param options
 * @returns
 */
export async function getBrandDetail(
    path: {
        type: brandType;
        id: string;
    },
    options?: { [key: string]: any },
) {
    return request(`/app/base/brand/detail/${path.type}/${path.id}`, {
        method: 'GET',
        ...(options || {}),
    });
}

/**
 * @name 获取当前工具箱的字体
 * @param params
 * @param options
 * @returns
 */
export async function getBrandActFonts(
    params: {
        brandId: string;
    },
    options?: { [key: string]: any },
) {
    return request(`/app/base/brand/fonts/active`, {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}

/**
 * @name 保存品牌类别信息
 * @param path
 * @param data
 * @param options
 * @returns
 */
export async function saveBrand(
    path: {
        type: brandType;
        brandId: string;
    },
    data?: any,
    options?: { [key: string]: any },
) {
    return request(`/app/base/brand/save/${path.type}/${path.brandId}`, {
        method: 'POST',
        data,
        ...(options || {}),
    });
}

/**
 * @name 更新品牌类别信息
 * @param path
 * @param data
 * @param options
 * @returns
 */
export async function updateBrand(
    path: {
        type: brandType;
        id: string;
    },
    data?: any,
    options?: { [key: string]: any },
) {
    return request(`/app/base/brand/update/${path.type}/${path.id}`, {
        method: 'PUT',
        data,
        ...(options || {}),
    });
}

/**
 * @name 删除品牌类别信息
 * @param path
 * @param data
 * @param options
 * @returns
 */
export async function delBrand(
    path: {
        type: brandType;
        id: string;
    },
    data?: {
        id: number;
    },
    options?: { [key: string]: any },
) {
    return request(`/app/base/brand/delete/${path.type}/${path.id}`, {
        method: 'DELETE',
        data,
        ...(options || {}),
    });
}
