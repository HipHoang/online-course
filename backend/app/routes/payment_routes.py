from flask import Blueprint, request, jsonify, redirect

from app.services.payment_service import PaymentService
from app.models.enrollment import Enrollment, Payment
from app.models.order import Order
from app.configs.db import db

payment_bp = Blueprint('payment_bp', __name__)


# =========================
# CHECKOUT
# =========================
@payment_bp.route('/checkout', methods=['POST'])
def checkout():
    data = request.json

    user_id = data.get('user_id')
    course_id = data.get('course_id')
    amount = data.get('amount')

    payment_url = PaymentService.create_payment_url(
        user_id, course_id, amount, request.remote_addr
    )

    return jsonify({"payment_url": payment_url})

@payment_bp.route('/vnpay_return', methods=['GET'])
def vnpay_return():
    vnp_params = request.args.to_dict()

    order_id = vnp_params.get('vnp_TxnRef')
    vnp_response_code = vnp_params.get('vnp_ResponseCode')

    order = Order.query.get(order_id)

    if not order:
        return "Order not found", 404

    if vnp_response_code == "00":
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

        # Lưu payment
        new_payment = Payment(
            enrollment_id=new_enrollment.enrollment_id,
            amount=order.amount,
            method='VNPay',
            status='completed'
        )

        db.session.add(new_payment)
        db.session.commit()

        return redirect(f"http://localhost:3000/payment-success?course_id={order.course_id}")

    else:
        order.status = 'failed'
        db.session.commit()

        return redirect(f"http://localhost:3000/payment-failed?course_id={order.course_id}")