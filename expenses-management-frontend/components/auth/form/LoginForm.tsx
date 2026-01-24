"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import type { AuthFormData } from "@/lib/types/auth";
import SubmitButton from "../../ui/SubmitButton";

type LoginFormProps = {
  formData: AuthFormData;
  loading: boolean;
  onChange: (field: keyof AuthFormData, value: string) => void;
  onSubmit: () => void;
  onSwitchToRegister: () => void;
};

export default function LoginForm({
  formData,
  loading,
  onChange,
  onSubmit,
  onSwitchToRegister,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();      
    onSubmit();              
  };

  return (
    <div className="bg-white lg:rounded-3xl shadow-2xl pt-16 lg:pt-10 overflow-auto p-8 lg:p-10 h-full w-full lg:w-auto lg:h-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Chào mừng trở lại!
        </h2>
        <p className="text-gray-600">
          Đăng nhập để tiếp tục quản lý tài chính của bạn
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
            required
              type="email"
              value={formData.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="email@example.com"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
            required
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => onChange("password", e.target.value)}
              placeholder="Mật khẩu"
              className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Ghi nhớ + Quên mật khẩu */}
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
          </label>
          <span className="text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer">
            Quên mật khẩu?
          </span>
        </div>

        {/* Submit login */}
        <SubmitButton
          loading={loading}
          onClick={() => {}}
          label="Đăng nhập"
          loadingLabel="Đang đăng nhập..."
        />

        {/* Switch to register */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Chưa có tài khoản?{" "}
            <span
              onClick={onSwitchToRegister}
              className="text-blue-500 hover:text-indigo-700 font-semibold transition cursor-pointer"
            >
              Đăng ký ngay
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
