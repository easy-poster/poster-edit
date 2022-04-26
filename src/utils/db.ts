import Dexie, { Table } from 'dexie';

interface commonProps {
  id?: number;
  userId?: number;
  createTime?: Date;
  updateTime?: Date;
}

export interface epProject extends commonProps {
  id?: number;
  title: string;
  blob: Blob;
}

export interface epImage extends commonProps {
  userId: number;
  title: string;
  blob: Blob;
}

export class EposterDexie extends Dexie {
  epProject!: Table<epProject>;

  constructor(name: string) {
    super(name);
    this.version(1).stores({
      epProject: '++id, title, blob',
    });
  }
}

export const db = new EposterDexie('eposterDatabase');
