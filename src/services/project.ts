import db from '@/utils/db';

export function getProject({ uuid }: { uuid: string }) {
    return db.epProject.get({ uuid });
}
