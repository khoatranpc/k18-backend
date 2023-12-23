import { v2 as cloudinary } from 'cloudinary';
import { Express } from 'express';
import crypto from 'crypto';
cloudinary.config({
    cloud_name: 'dxo374ch8',
    api_key: '399236672491454',
    api_secret: 'qYDv0H5pDyR81eueVbGgSsKGOHQ'
});
const uploadToCloud = (file: Express.Multer.File) => {
    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    const fileName = file.originalname.split('.')[0];
    const uploaded = cloudinary.uploader.upload(dataUrl, {
        public_id: fileName + crypto.randomUUID(),
        resource_type: 'auto',
    }, (err, result) => {
        if (result) {
            return result;
        }
    }).then((rs) => {
        return rs
    });
    return uploaded;
}
export default uploadToCloud;