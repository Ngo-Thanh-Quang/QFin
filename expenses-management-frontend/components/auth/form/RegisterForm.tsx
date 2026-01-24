"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react";
import type { AuthFormData } from "@/lib/types/auth";
import SubmitButton from "../../ui/SubmitButton";

type RegisterFormProps = {
    formData: AuthFormData;
    agreed: boolean;
    loading: boolean;
    onChange: (field: keyof AuthFormData, value: string) => void;
    onAgreeChange: (value: boolean) => void;
    onSubmit: () => void;
    onSwitchToLogin: () => void;
};

export default function RegisterForm({
    formData,
    agreed,
    loading,
    onChange,
    onAgreeChange,
    onSubmit,
    onSwitchToLogin,
}: RegisterFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className="bg-white lg:rounded-3xl lg:shadow-2xl pt-16 lg:pt-10 p-8 lg:p-10 h-full w-full lg:w-auto lg:h-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Tạo tài khoản mới
                </h2>
                <p className="text-gray-600">
                    Bắt đầu quản lý tài chính thông minh ngay hôm nay
                </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Họ và tên */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                required
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => onChange("lastName", e.target.value)}
                                placeholder="Họ và tên đệm"
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                            />
                        </div>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                required
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => onChange("firstName", e.target.value)}
                                placeholder="Tên"
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

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

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            required
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => onChange("phone", e.target.value)}
                            placeholder="0912345678"
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Pass + Confirm */}
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
                            placeholder="Tối thiểu 6 ký tự"
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

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            required
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) => onChange("confirmPassword", e.target.value)}
                            placeholder="Nhập lại mật khẩu"
                            className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Terms */}
                <div className="flex items-start lg:items-center space-x-3">
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => onAgreeChange(e.target.checked)}
                        className="w-6 h-6 mt-0.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label className="text-sm text-gray-600">
                        Tôi đồng ý với{" "}
                        <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                            Điều khoản sử dụng
                        </button>{" "}
                        và{" "}
                        <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                            Chính sách bảo mật
                        </button>
                    </label>
                </div>

                {/* Submit register */}
                <SubmitButton
                    loading={loading}
                    onClick={() => {}}
                    label="Tạo tài khoản"
                    loadingLabel="Đang tạo tài khoản..."
                />

                {/* Switch to login */}
                <div className="mt-4 text-center">
                    <p className="text-gray-600">
                        Đã có tài khoản?{" "}
                        <span
                            onClick={onSwitchToLogin}
                            className="text-blue-500 hover:text-indigo-700 font-semibold transition cursor-pointer"
                        >
                            Đăng nhập ngay
                        </span>
                    </p>
                </div>
            </form>
        </div>
    );
}
