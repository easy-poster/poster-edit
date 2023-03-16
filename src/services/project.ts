import db, { epProject } from '@/utils/db';

export enum OrderTypes {
    TIME = 'time',
    NAME = 'name',
    SIZE = 'size',
}

/**
 * @name 获取项目列表
 * @param params
 * @param options
 * @returns
 */
export async function getProjectList() {
    return db.epProject.reverse().sortBy('updateTime');
}

/**
 * @name 获取项目详情
 * @param params
 * @param options
 * @returns
 */
export async function getProjectDetail(params: { uuid: string }) {
    return db.epProject.get(params);
}

/**
 * @name 创建项目
 * @param data
 * @param options
 * @returns
 */
export async function saveProject(data: Omit<epProject, 'id'>) {
    return db.epProject.add(data);
}

/**
 * @name 更新项目相关信息
 * @param data
 * @param options
 * @returns
 */
export async function updateProject(data: Partial<epProject>) {
    const { id, ...other } = data;
    if (id) {
        return db.epProject.update(id, {
            ...other,
        });
    }
}

/**
 * @name 删除一个项目
 * @param data
 * @param options
 * @returns
 */
export async function delProject(data: { id: number }) {
    return db.epProject.delete(data.id);
}

/**
 * @name 复制一个项目
 * @param data
 * @param options
 * @returns
 */
export async function copyProject(data: epProject) {
    const { id, ...other } = data;
    return db.epProject.add(other);
}
