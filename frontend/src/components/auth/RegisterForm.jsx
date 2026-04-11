import React, { useState } from "react";
import { saveCurrentUser } from "../../data/mockAuth";

const RegisterForm = ({ onSwitchType }) => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Trường này không được để trống";
    }

    if (!form.email.trim()) {
      newErrors.email = "Trường này không được để trống";
    }

    if (!form.password.trim()) {
      newErrors.password = "Trường này không được để trống";
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Trường này không được để trống";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const newUser = {
      id: Date.now(),
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      role: form.role,
      avatar: form.fullName
        .split(" ")
        .slice(-2)
        .map((word) => word[0])
        .join("")
        .toUpperCase(),
    };

    saveCurrentUser(newUser);
    window.location.href = "/";
  };

  return (
    <div>
      <h2 className="mb-2 text-center text-4xl font-extrabold text-blue-900">
        Đăng ký
      </h2>

      <p className="mx-auto mb-10 max-w-130 text-center text-sm leading-6 text-gray-500">
        Tạo tài khoản mới để bắt đầu học tập tại OU Education.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="fullName"
            placeholder="Họ và tên của bạn"
            value={form.fullName}
            onChange={handleChange}
            className={`w-full rounded-full border px-5 py-3 outline-none transition ${
              errors.fullName
                ? "border-red-400 bg-red-50 text-red-500 placeholder:text-red-300"
                : "border-gray-200 bg-white focus:border-[#002B5B]"
            }`}
          />
          {errors.fullName && (
            <p className="mt-2 text-sm font-medium text-red-500">
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Địa chỉ email"
            value={form.email}
            onChange={handleChange}
            className={`w-full rounded-full border px-5 py-3 outline-none transition ${
              errors.email
                ? "border-red-400 bg-red-50 text-red-500 placeholder:text-red-300"
                : "border-gray-200 bg-white focus:border-[#002B5B]"
            }`}
          />
          {errors.email && (
            <p className="mt-2 text-sm font-medium text-red-500">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            className={`w-full rounded-full border px-5 py-3 outline-none transition ${
              errors.password
                ? "border-red-400 bg-red-50 text-red-500 placeholder:text-red-300"
                : "border-gray-200 bg-white focus:border-[#002B5B]"
            }`}
          />
          {errors.password && (
            <p className="mt-2 text-sm font-medium text-red-500">
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            value={form.confirmPassword}
            onChange={handleChange}
            className={`w-full rounded-full border px-5 py-3 outline-none transition ${
              errors.confirmPassword
                ? "border-red-400 bg-red-50 text-red-500 placeholder:text-red-300"
                : "border-gray-200 bg-white focus:border-[#002B5B]"
            }`}
          />
          {errors.confirmPassword && (
            <p className="mt-2 text-sm font-medium text-red-500">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Chọn vai trò
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full rounded-full border border-gray-200 bg-white px-5 py-3 outline-none transition focus:border-[#002B5B]"
          >
            <option value="student">Học viên</option>
            <option value="teacher">Giảng viên</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-full bg-[#002B5B] py-3 text-lg font-semibold text-white shadow-md transition hover:bg-[#003a78] active:scale-[0.98]"
        >
          Đăng ký
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-700">
        Bạn đã có tài khoản?{" "}
        <button
          type="button"
          onClick={() => onSwitchType("login")}
          className="font-semibold text-[#002B5B] hover:underline"
        >
          Đăng nhập
        </button>
      </div>

      <div className="mt-3 text-center">
        <button
          type="button"
          className="text-sm font-medium text-[#002B5B] hover:underline"
        >
          Quên mật khẩu?
        </button>
      </div>

      <p className="mx-auto text-center text-sm text-gray-500 mb-6 max-w-130 mt-6">
        Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với điều khoản sử dụng của chúng tôi.
      </p>
    </div>
  );
};

export default RegisterForm;