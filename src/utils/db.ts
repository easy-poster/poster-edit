import Dexie, { Table } from 'dexie';

interface commonProps {
  /** @name 自定义唯一id */
  uuid: string;
  /** @name 用户id */
  userId: number;
  /** @name 创建时间 */
  createTime?: Date;
  /** @name 更新时间 */
  updateTime?: Date;
}

export type fromType = 'url' | 'resource';

export interface epProject extends commonProps {
  /** @name 项目名称*/
  title: string;
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
  /** @name 本地图片blob */
  src: Blob;
  /** @name 图片封面blob */
  cover?: Blob;
  /** @name 远程图片资源地址 */
  url?: string;
}

export class EposterDexie extends Dexie {
  epProject!: Table<epProject>;
  epImage!: Table<epImage>;

  constructor(name: string) {
    super(name);
    this.version(1).stores({
      epImage:
        '++id, &uuid, userId, createTime, updateTime, name, size, type, blob, cover, url',
      epProject:
        '++id, &uuid, userId, createTime, updateTime, title, cover, size, width, height, background, content',
    });
  }
}

export const db = new EposterDexie('eposterDatabase');
