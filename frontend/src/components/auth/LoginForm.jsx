import React, { useState } from "react";
import { mockUsers, saveCurrentUser } from "../../data/mockAuth";

const LoginForm = ({ onSwitchType }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Trường này không được để trống";
    }

    if (!form.password.trim()) {
      newErrors.password = "Trường này không được để trống";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);
    setSubmitError("");

    if (Object.keys(newErrors).length > 0) return;

    const foundUser = mockUsers.find(
      (user) =>
        user.email === form.email.trim() &&
        user.password === form.password.trim()
    );

    if (!foundUser) {
      setSubmitError("Email hoặc mật khẩu không đúng");
      return;
    }

    saveCurrentUser(foundUser);
    window.location.href = "/";
  };

  return (
    <div>
      <h2 className="mb-2 text-center text-4xl font-extrabold text-primary">
        Đăng nhập
      </h2>

      <p className="mx-auto text-center text-sm text-gray-500 mb-6 max-w-130">
        Chào mừng bạn quay lại OU Education. Đăng nhập để tiếp tục học tập và theo dõi tiến độ của bạn.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">
              Tên đăng nhập
            </label>
          </div>

          <input
            type="text"
            name="email"
            placeholder="Email hoặc Username"
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

        {submitError && (
          <p className="text-sm font-medium text-red-500">{submitError}</p>
        )}

        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            name="remember"
            checked={form.remember}
            onChange={handleChange}
            className="h-4 w-4 accent-[#002B5B]"
          />
          Ghi nhớ đăng nhập
        </label>

        <button
          type="submit"
          className="w-full rounded-full bg-[#002B5B] py-3 text-lg font-semibold text-white shadow-md transition hover:bg-[#003a78] active:scale-[0.98]"
        >
          Đăng nhập
        </button>
      </form>

      <div className="mt-5 rounded-2xl bg-blue-50 border border-blue-100 p-4 text-sm text-slate-700">
        <p className="font-semibold mb-1">Tài khoản test:</p>
        <p>Email: student@ou.edu.vn</p>
        <p>Password: 123456</p>
      </div>

      <div className="mt-8 text-center text-sm text-gray-700">
        Bạn chưa có tài khoản?{" "}
        <button
          type="button"
          onClick={() => onSwitchType("register")}
          className="font-semibold text-[#002B5B] hover:underline"
        >
          Đăng ký
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

      <p className="mx-auto mt-8 max-w-130 text-center text-xs leading-5 text-gray-400">
        Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với điều khoản sử dụng của chúng tôi.
      </p>
    </div>
  );
};

export default LoginForm;