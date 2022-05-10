import { db } from '@/utils/db';

export function getProject({ id }) {
  return db.epProject.get({ uuid: id });
}

export function updateLayeres({ id }) {
  return new Promise<void>((resovle, reject) => {
    setTimeout(() => {
      resovle();
    }, 2000);
  });
}
