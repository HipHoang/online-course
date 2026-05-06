from flask import Blueprint, request, jsonify, redirect
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

from app.services.payment_service import PaymentService
from app.models.enrollment import Enrollment, Payment
from app.models.order import Order
from app.configs.db import db

payment_bp = Blueprint('payment_bp', __name__)


# =========================
# CHECKOUT
# =========================
@payment_bp.route('/checkout', methods=['POST', 'OPTIONS'])
def checkout():
    # Thêm headers CORS thủ công để chắc chắn
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response, 200
        
    verify_jwt_in_request()
    user_id = get_jwt_identity()

    data = request.json
    course_id = data.get('course_id')
    amount = data.get('amount')

    payment_url = PaymentService.create_payment_url(
        user_id, course_id, amount, request.remote_addr
    )

    response = jsonify({"payment_url": payment_url})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@payment_bp.route('/vnpay_return', methods=['GET'])
def vnpay_return():
    vnp_params = request.args.to_dict()

    order_id = vnp_params.get('vnp_TxnRef')
    vnp_response_code = vnp_params.get('vnp_ResponseCode')

    order = Order.query.get(order_id)

    if not order:
        return "Order not found", 404

    if vnp_response_code == "00":
        try:
            print("=== VNPAY SUCCESS CALLBACK ===")
            print("Order ID:", order_id)

            # Check đã enroll chưa (tránh duplicate)
            existing_enrollment = Enrollment.query.filter_by(
                user_id=order.user_id,
                course_id=order.course_id
            ).first()

            if existing_enrollment:
                print("User already enrolled, skip creating new enrollment")

                order.status = 'success'
                order.vnp_transaction_no = vnp_params.get('vnp_TransactionNo')
                db.session.commit()

                return redirect(f"http://localhost:3000/payment-success?course_id={order.course_id}")

            # SUCCESS
            order.status = 'success'
            order.vnp_transaction_no = vnp_params.get('vnp_TransactionNo')

            # Tạo enrollment
            new_enrollment = Enrollment(
                user_id=order.user_id,
                course_id=order.course_id,
                status='active'
            )
            db.session.add(new_enrollment)
            db.session.flush()

            # Tạo payment
            new_payment = Payment(
                enrollment_id=new_enrollment.enrollment_id,
                amount=order.amount,
                method='VNPay',
                status='completed'
            )
            db.session.add(new_payment)

            db.session.commit()

            print("Enrollment + Payment created successfully")

            return redirect(f"http://localhost:3000/payment-success?course_id={order.course_id}")

        except Exception as e:
            db.session.rollback()
            print("ERROR VNPAY CALLBACK:", str(e))
            return redirect(f"http://localhost:3000/payment-failed?course_id={order.course_id}")

@payment_bp.route('/vnpay_ipn', methods=['GET'])
def vnpay_ipn():
    vnp_params = request.args.to_dict()
    
    # 1. Kiểm tra chữ ký (Checksum)
    if PaymentService.validate_response(vnp_params):
        order_id = vnp_params.get('vnp_TxnRef')
        vnp_response_code = vnp_params.get('vnp_ResponseCode')
        vnp_amount = int(vnp_params.get('vnp_Amount')) / 100
        
        order = Order.query.get(order_id)

        if order:
            # 2. Kiểm tra số tiền (Số tiền trong DB phải khớp với VNPay gửi về)
            if order.amount == vnp_amount:
                # 3. Kiểm tra trạng thái đơn hàng (Tránh xử lý trùng lặp)
                if order.status == 'pending':
                    if vnp_response_code == "00":
                        # XỬ LÝ THÀNH CÔNG
                        try:
                            order.status = 'success'
                            order.vnp_transaction_no = vnp_params.get('vnp_TransactionNo')
                            
                            # Tạo Enrollment & Payment (Giống logic bên return của bạn)
                            new_enrollment = Enrollment(user_id=order.user_id, course_id=order.course_id, status='active')
                            db.session.add(new_enrollment)
                            db.session.flush()
                            
                            new_payment = Payment(enrollment_id=new_enrollment.enrollment_id, amount=order.amount, method='VNPay', status='completed')
                            db.session.add(new_payment)
                            
                            db.session.commit()
                            return jsonify({"RspCode": "00", "Message": "Confirm Success"})
                        except Exception as e:
                            db.session.rollback()
                            return jsonify({"RspCode": "99", "Message": "Unknown error"})
                    else:
                        # THANH TOÁN THẤT BẠI
                        order.status = 'failed'
                        db.session.commit()
                        return jsonify({"RspCode": "00", "Message": "Confirm Success"})
                else:
                    return jsonify({"RspCode": "02", "Message": "Order already confirmed"})
            else:
                return jsonify({"RspCode": "04", "Message": "Invalid amount"})
        else:
            return jsonify({"RspCode": "01", "Message": "Order not found"})
    else:
        return jsonify({"RspCode": "97", "Message": "Invalid Checksum"})