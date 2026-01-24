"use client";

import React from "react";
import { Wallet, CheckCircle } from "lucide-react";

const benefits = [
  "Miễn phí, tiện dụng",
  "Sử dụng bất cứ lúc nào",
  "Hỗ trợ 24/7",
];

export function AuthBrandingLogin() {
  return (
    <div className="space-y-6 lg:w-[400px] xl:w-[550px] hidden lg:block">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-600 p-4 rounded-2xl shadow-xl">
          <Wallet className="h-12 w-12 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">QFin</h1>
          <p className="text-gray-600">Quản lý tài chính thông minh</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="bg-indigo-100 p-3 rounded-xl">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Theo dõi chi tiêu
              </h3>
              <p className="text-gray-600 text-sm">
                Quản lý mọi khoản thu chi một cách dễ dàng và trực quan
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Phân tích thông minh
              </h3>
              <p className="text-gray-600 text-sm">
                Báo cáo chi tiết giúp bạn hiểu rõ tình hình tài chính
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="bg-pink-100 p-3 rounded-xl">
              <svg
                className="w-6 h-6 text-pink-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Bảo mật tuyệt đối
              </h3>
              <p className="text-gray-600 text-sm">
                Dữ liệu được mã hóa và bảo vệ ở mức cao nhất
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white">
        <p className="text-sm opacity-90 mb-2">Được tin tưởng bởi</p>
        <p className="text-3xl font-bold">10,000+</p>
        <p className="text-sm opacity-90">người dùng tại Việt Nam</p>
      </div>
    </div>
  );
}

export function AuthBrandingRegister() {
  return (
    <div className="space-y-6 lg:w-[400px] xl:w-[550px] hidden lg:block">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-600 p-4 rounded-2xl shadow-xl">
          <Wallet className="h-12 w-12 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">QFin</h1>
          <p className="text-gray-600">Quản lý tài chính thông minh</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl p-8 text-white shadow-2xl">
        <h3 className="text-2xl font-bold mb-4">Tại sao chọn QFin?</h3>
        <div className="space-y-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 flex-shrink-0" />
              <span className="text-lg">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="bg-indigo-100 p-3 rounded-xl">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Hoàn toàn miễn phí
              </h3>
              <p className="text-gray-600 text-sm">
                Trải nghiệm đầy đủ tính năng trong 30 ngày đầu tiên
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                An toàn & Bảo mật
              </h3>
              <p className="text-gray-600 text-sm">
                Dữ liệu được mã hóa và bảo vệ theo tiêu chuẩn quốc tế
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
