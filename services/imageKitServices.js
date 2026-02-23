import ImageKit from "imagekit";
import dotenv from 'dotenv';
dotenv.config(); 
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});
export const getTokenImageKit=(req,res)=>{
    console.log('1',imagekit.getAuthenticationParameters())
    return res.json(imagekit.getAuthenticationParameters());
}
//id ảnh không phải url
export const deleteImageKit=async(imgId)=>{
try {
    const res=await imagekit.deleteFile(imgId);
    console.log("xóa ảnh",res)
  } catch (err) {
    console.error(err);
  }
};