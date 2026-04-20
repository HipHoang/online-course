import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const courseId = params.get("course_id");

  useEffect(() => {
    // sau 2s tự redirect
    const timer = setTimeout(() => {
      navigate(`/learn/${courseId}`);
    }, 2000);

    return () => clearTimeout(timer);
  }, [courseId, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🎉 Thanh toán thành công!</h1>
      <p>Bạn đã đăng ký khóa học thành công.</p>
      <p>Đang chuyển đến trang học...</p>

      <button onClick={() => navigate(`/learn/${courseId}`)}>
        Vào học ngay
      </button>
    </div>
  );
};

export default PaymentSuccess;