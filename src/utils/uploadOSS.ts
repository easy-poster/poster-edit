import { getUploadSTS } from '@/services';
import OSS from 'ali-oss';

let client;

const getClientOss = async () => {
    try {
        const res = await getUploadSTS();
    } catch (error) {
        // console.error(error);
    }
};

export const putFile = async (file: any) => {
    await getClientOss();
};
