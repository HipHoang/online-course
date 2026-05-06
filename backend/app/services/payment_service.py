import hashlib
import hmac
import urllib.parse
import os
from datetime import datetime
from app.models.order import Order
from app.configs.db import db

class PaymentService:
    @staticmethod
    def get_conf(key, default=None):
        return os.getenv(key, default)

    @staticmethod
    def create_payment_url(user_id, course_id, amount, remote_addr):
        txn_ref = f"{course_id}_{datetime.now().strftime('%H%M%S')}"
        
        # 1. Khởi tạo Params
        vnp_params = {
            'vnp_Version': '2.1.0',
            'vnp_Command': 'pay',
            'vnp_TmnCode': str(PaymentService.get_conf("VNP_TMN_CODE")),
            'vnp_Amount': str(int(float(amount) * 100)),
            'vnp_CurrCode': 'VND',
            'vnp_TxnRef': str(txn_ref),
            'vnp_OrderInfo': f"Thanh toan khoa hoc {course_id}",
            'vnp_OrderType': 'other',
            'vnp_Locale': 'vn',
            'vnp_ReturnUrl': str(PaymentService.get_conf("VNP_RETURN_URL")),
            'vnp_IpAddr': '14.226.2.183' if remote_addr in ['127.0.0.1', '::1'] else str(remote_addr),
            'vnp_CreateDate': datetime.now().strftime('%Y%m%d%H%M%S'),
        }

        # 2. Sắp xếp alphabet theo Key (Bắt buộc)
        input_data = sorted(vnp_params.items())

        # 3. Tạo chuỗi Hash & Query bằng urlencode (Dùng '+' cho khoảng trắng giống Java)
        # Cách này sẽ biến "Thanh toan" -> "Thanh+toan" thay vì "%20"
        query_string = urllib.parse.urlencode(input_data)

        # --- DEBUG ĐỐI CHIẾU ---
        print("\n" + "="*50)
        print(f"DEBUG - CHUỖI GỬI ĐI & BĂM: \n{query_string}")
        
        # 4. Tính toán SecureHash từ chuỗi đã encode
        secret_key = PaymentService.get_conf("VNP_HASH_SECRET")
        hash_value = hmac.new(
            secret_key.encode('utf-8'),
            query_string.encode('utf-8'), # Băm trực tiếp chuỗi query_string
            hashlib.sha512
        ).hexdigest()

        print(f"DEBUG - SECURE HASH: {hash_value}")
        print("="*50 + "\n")

        vnp_url = PaymentService.get_conf("VNP_URL")
        return f"{vnp_url}?{query_string}&vnp_SecureHash={hash_value}"
    
    @staticmethod
    def validate_response(vnp_params):
        vnp_secure_hash = vnp_params.get('vnp_SecureHash')
        # Loại bỏ các tham số hash để tính toán lại
        if 'vnp_SecureHash' in vnp_params:
            vnp_params.pop('vnp_SecureHash')
        if 'vnp_SecureHashType' in vnp_params:
            vnp_params.pop('vnp_SecureHashType')

        # 1. Sắp xếp params
        input_data = sorted(vnp_params.items())
        
        # 2. Tạo chuỗi hash (Dùng urlencode để khớp với logic lúc tạo URL)
        # Lưu ý: VNPay yêu cầu chuỗi này phải giống hệt cách bạn băm lúc gửi đi
        hash_data = urllib.parse.urlencode(input_data)

        # 3. Tính toán hash
        secret_key = os.getenv("VNP_HASH_SECRET")
        check_hash = hmac.new(
            secret_key.encode('utf-8'),
            hash_data.encode('utf-8'),
            hashlib.sha512
        ).hexdigest()

        return check_hash.lower() == vnp_secure_hash.lower()