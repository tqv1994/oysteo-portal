import type { UploadFile } from "$lib/store/upload-file";
import { cmsUrlPrefix } from "$lib/utils/_env";

export const uploadFileService = async (file: File, ref: string, refId: string, field: string, source: string = ""): Promise<UploadFile> => {
    return new Promise(async (resolve, reject) => {
        const dataArray = new FormData();
        dataArray.append('files', file);
        dataArray.append('ref', ref);
        dataArray.append('source', source);
        dataArray.append('refId', refId);
        dataArray.append('field', field);
        const res = await fetch(`${cmsUrlPrefix}/upload`, {
            method: 'POST',
            body: dataArray,
        });
        if (res.ok) {
            const data: UploadFile[] = await res.json();
            resolve(data[0]);
        } else {
            const error = await res.json();
            reject(error);
        }
    });
}