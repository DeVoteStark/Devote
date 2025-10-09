import {put, del} from '@vercel/blob';

const token= process.env.VERCEL_BLOB_READ_WRITE_TOKEN!;

export async function uploadToBlob(file: File){
    const blob= await put(file.name, file, {access: 'public', token});
    return blob.url;
}
export async function deleteFromBlob(blobUrl: string){
    await del(blobUrl, {token});
}