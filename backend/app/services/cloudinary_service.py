import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from dotenv import load_dotenv
import os
load_dotenv()

cloudinary.config( 
  cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME') ,
  api_key =  os.getenv('CLOUDINARY_API_KEY') , 
  api_secret = os.getenv('CLOUDINARY_API_SECRET') ,
  secure = True
)

class CloudinaryService:
    
    @staticmethod
    def upload_image(file_to_upload, folder="online-course"):
        """
        Hàm thêm hình ảnh
        :param file_to_upload: Có thể là đường dẫn file, file object từ request, hoặc URL
        :param folder: Thư mục lưu trữ trên Cloudinary
        :return: (url, public_id) nếu thành công, None nếu thất bại
        """
        try:
            upload_result = cloudinary.uploader.upload(
                file_to_upload,
                folder=folder
            )
            # Trả về URL và public_id để lưu vào Database
            return upload_result['secure_url'], upload_result['public_id']
        except Exception as e:
            print(f"Lỗi Upload Cloudinary: {str(e)}")
            return None, None

    @staticmethod
    def delete_image(public_id):
        """
        Hàm xóa hình ảnh
        :param public_id: ID định danh của hình ảnh trên Cloudinary
        :return: True nếu xóa thành công, False nếu thất bại
        """
        try:
            result = cloudinary.uploader.destroy(public_id)
            if result.get('result') == 'ok':
                return True
            return False
        except Exception as e:
            print(f"Lỗi Xóa Cloudinary: {str(e)}")
            return False