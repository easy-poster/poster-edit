import Dexie, { Table } from 'dexie';

interface commonProps {
    /** @name 自增id */
    id?: number;
    /** @name 自定义唯一id */
    uuid: string;
    /** @name 创建时间 */
    createTime?: Date;
    /** @name 更新时间 */
    updateTime?: Date;
}

export type fromType = 'url' | 'resource';

export interface epProject extends commonProps {
    /** @name 项目名称*/
    title: string;
    /** @name 描述 */
    description?: string;
    /** @name 封面 */
    cover?: string;
    /** @name 项目资源大小 */
    size?: number;
    /** @name 画布宽*/
    width: number;
    /** @name 画布高*/
    height: number;
    /** @name 背景 */
    background: string;
    /** @name 背景图片 */
    backgroundImage?: string;
    /** @name 画布内容 */
    content?: string;
}

export interface epImage extends commonProps {
    /** @name 图片名字*/
    name: string;
    /** @name 图片大小 */
    size: number;
    /** @name 图片类型 */
    type: string;
    /** @name 图片封面blob */
    cover?: Blob;
    /** @name 图片地址 */
    url: Blob;
}

export class EposterDexie extends Dexie {
    epProject!: Table<epProject>;
    epImage!: Table<epImage>;

    constructor(name: string) {
        super(name);
        console.log('init indexDB');
        this.version(1).stores({
            epImage:
                '++id, &uuid, createTime, updateTime, title, size, type, cover, url',
            epProject:
                '++id, &uuid, createTime, updateTime, title, description, content, cover, width, height, background, backgroundImage',
        });
    }
}

const db = new EposterDexie('eposterDatabase');

export default db;
