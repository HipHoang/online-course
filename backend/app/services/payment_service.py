import hashlib
import hmac
import urllib.parse
from datetime import datetime

from app.models.order import Order
from app.models.course import Course
from app.models.enrollment import Enrollment, Payment
from app.configs.db import db
from app.services.course_service import enroll_course_service


class PaymentService:
    VNP_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
    VNP_TMN_CODE = "CPY00001"
    VNP_HASH_SECRET = "9756708451313410"
    VNP_RETURN_URL = "http://127.0.0.1:5000/api/payment/vnpay_return"

    @staticmethod
    def create_pending_order(user_id, course_id):
        course = Course.query.get(course_id)
        if not course:
            return None, "Không tìm thấy khóa học"

        amount = float(course.price or 0)

        if amount <= 0:
            return None, "Khóa học miễn phí — hãy đăng ký trực tiếp"

        # kiểm tra đã mua chưa
        existing = Enrollment.query.filter_by(
            user_id=user_id,
            course_id=course_id
        ).first()

        if existing:
            return None, "Bạn đã sở hữu khóa học này"

        order = Order(
            user_id=user_id,
            course_id=course_id,
            amount=amount,
            status="PENDING",
            order_desc=f"Thanh toán khóa học: {course.title}"
        )

        db.session.add(order)
        db.session.commit()

        return order, None

    @staticmethod
    def fulfill_order(order, payment_method, vnp_transaction_no=None):
        if order.status == "COMPLETED":
            return True, None

        enrollment = Enrollment.query.filter_by(
            user_id=order.user_id,
            course_id=order.course_id
        ).first()

        if not enrollment:
            result, code = enroll_course_service(
                int(order.user_id),
                int(order.course_id)
            )

            if code != 200:
                return False, "Không thể ghi danh"

            enrollment = Enrollment.query.filter_by(
                user_id=order.user_id,
                course_id=order.course_id
            ).first()

        if not enrollment:
            return False, "Lỗi tạo enrollment"

        # tạo payment nếu chưa có
        existing_payment = Payment.query.filter_by(
            enrollment_id=enrollment.enrollment_id
        ).first()

        if not existing_payment:
            payment = Payment(
                enrollment_id=enrollment.enrollment_id,
                amount=order.amount,
                method=payment_method,
                status="completed"
            )
            db.session.add(payment)

        order.status = "COMPLETED"

        if vnp_transaction_no:
            order.vnp_transaction_no = vnp_transaction_no

        db.session.commit()

        return True, None

    @staticmethod
    def create_payment_url(user_id, course_id, amount, ip_addr):
        order = Order(
            user_id=user_id,
            course_id=course_id,
            amount=amount,
            status="PENDING",
            order_desc=f"Thanh toán khóa học {course_id}"
        )

        db.session.add(order)
        db.session.commit()

        vnp_params = {
            "vnp_Version": "2.1.0",
            "vnp_Command": "pay",
            "vnp_TmnCode": PaymentService.VNP_TMN_CODE,
            "vnp_Amount": int(float(amount) * 100),
            "vnp_CurrCode": "VND",
            "vnp_TxnRef": str(order.id),
            "vnp_OrderInfo": order.order_desc,
            "vnp_OrderType": "billpayment",
            "vnp_Locale": "vn",
            "vnp_ReturnUrl": PaymentService.VNP_RETURN_URL,
            "vnp_IpAddr": ip_addr,
            "vnp_CreateDate": datetime.now().strftime("%Y%m%d%H%M%S"),
        }

        sorted_params = sorted(vnp_params.items())
        query_string = urllib.parse.urlencode(sorted_params)

        secure_hash = hmac.new(
            PaymentService.VNP_HASH_SECRET.encode(),
            query_string.encode(),
            hashlib.sha512
        ).hexdigest()

        return f"{PaymentService.VNP_URL}?{query_string}&vnp_SecureHash={secure_hash}"
