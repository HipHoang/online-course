from flask import Blueprint, request, redirect
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.payment_service import PaymentService
from app.models.order import Order
from app.models.course import Course
from app.configs.db import db
from app.utils.response import success_response, error_response

payment_bp = Blueprint("payment_bp", __name__)


@payment_bp.route("/orders", methods=["POST"])
@jwt_required()
def create_order():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    course_id = data.get("course_id")

    if not course_id:
        return error_response("Thiếu course_id", 400)

    try:
        course_id = int(course_id)
    except:
        return error_response("course_id không hợp lệ", 400)

    order, err = PaymentService.create_pending_order(user_id, course_id)

    if err:
        return error_response(err, 400)

    course = Course.query.get(course_id)

    return success_response({
        "order_id": order.id,
        "course_id": order.course_id,
        "amount": order.amount,
        "status": order.status,
        "course_title": course.title if course else ""
    }, "Tạo đơn thành công", 201)


@payment_bp.route("/orders/<int:order_id>/complete", methods=["POST"])
@jwt_required()
def complete_order(order_id):
    user_id = int(get_jwt_identity())

    order = Order.query.get(order_id)

    if not order or int(order.user_id) != user_id:
        return error_response("Không tìm thấy đơn hàng", 404)

    data = request.get_json() or {}

    payment_method = (data.get("payment_method") or "bank_transfer").lower()

    ok, err = PaymentService.fulfill_order(order, payment_method)

    if not ok:
        return error_response(err or "Thanh toán thất bại", 400)

    return success_response({
        "order_id": order.id,
        "status": order.status
    }, "Thanh toán thành công")


@payment_bp.route("/checkout", methods=["POST"])
def checkout():
    data = request.json or {}

    user_id = data.get("user_id")
    course_id = data.get("course_id")
    amount = data.get("amount")

    if not user_id or not course_id or amount is None:
        return error_response("Thiếu dữ liệu", 400)

    url = PaymentService.create_payment_url(
        int(user_id),
        int(course_id),
        amount,
        request.remote_addr or "127.0.0.1"
    )

    return success_response({
        "payment_url": url
    })


@payment_bp.route("/vnpay_return", methods=["GET"])
def vnpay_return():
    vnp_params = request.args.to_dict()

    order_id = vnp_params.get("vnp_TxnRef")
    code = vnp_params.get("vnp_ResponseCode")

    order = Order.query.get(order_id)

    if not order:
        return "Order not found", 404

    if code == "00":
        ok, err = PaymentService.fulfill_order(
            order,
            "vnpay",
            vnp_params.get("vnp_TransactionNo")
        )

        if not ok:
            order.status = "FAILED"
            db.session.commit()
            return redirect(f"http://localhost:3000/payment-failed")

        return redirect(f"http://localhost:3000/payment-success")

    order.status = "FAILED"
    db.session.commit()

    return redirect(f"http://localhost:3000/payment-failed")
