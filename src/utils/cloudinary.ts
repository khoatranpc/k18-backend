import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: 'dxo374ch8',
    api_key: '399236672491454',
    api_secret: 'qYDv0H5pDyR81eueVbGgSsKGOHQ'
});
const uploadToCloud = async (file: Express.Multer.File) => {
    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    const fileName = file.originalname.split('.')[0];
    const uploaded = await cloudinary.uploader.upload(dataUrl, {
        public_id: fileName,
        resource_type: 'auto',
    })
    return uploaded;
}
export default uploadToCloud;