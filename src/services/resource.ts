import { db } from '@/utils';
import { epImage } from '@/utils/db';

/**
 * @name 获取资源列表
 * @param params
 * @param options
 * @returns
 */
export async function getResourceList() {
    return db.epImage.reverse().sortBy('updateTime');
}

/**
 * @name 获取资源详情byId
 * @param params
 * @param options
 * @returns
 */
export async function getResourceDetailById(params: { id: number }) {
    return db.epImage.get(params);
}

/**
 * @name 获取资源详情
 * @param params
 * @param options
 * @returns
 */
export async function getResourceDetail(params: { uuid: string }) {
    return db.epImage.get(params);
}

/**
 * @name 创建资源
 * @param data
 * @param options
 * @returns
 */
export async function saveResource(data: Omit<epImage, 'id'>) {
    return db.epImage.add(data);
}

/**
 * @name 更新资源相关信息
 * @param data
 * @param options
 * @returns
 */
export async function updateResource(data: Partial<epImage>) {
    const { id, ...other } = data;
    if (id) {
        return db.epImage.update(id, {
            ...other,
        });
    }
}

/**
 * @name 删除一个资源
 * @param data
 * @param options
 * @returns
 */
export async function delResource(data: { id: number }) {
    return db.epImage.delete(data.id);
}
