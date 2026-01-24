'use client';

import React from 'react';
import { Home, Search, ArrowLeft, Wallet, TrendingDown, AlertTriangle } from 'lucide-react';

export default function QFin404() {
  const quickLinks = [
    { name: 'Trang chủ', icon: Home, href: '/', color: 'from-indigo-500 to-blue-500' },
    { name: 'Quản lý', icon: Wallet, href: '/quan-ly', color: 'from-blue-500 to-cyan-500' },
    { name: 'Phân tích', icon: TrendingDown, href: '/phan-tich', color: 'from-green-500 to-teal-500' }
  ];

  return (
    <div className="min-h-[calc(100vh-441px)] bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4 pt-12 lg:pt-16 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center">
          {/* 404 Animation */}
          <div className="mb-8 relative">
            <div className="inline-block relative">
              {/* Main 404 Text */}
              <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent leading-none animate-pulse-slow">
                404
              </h1>

              {/* Floating Icons */}
              <AlertTriangle className="absolute -top-4 -left-4 w-12 h-12 text-yellow-500 animate-bounce" />
              <Search className="absolute -top-2 -right-4 w-10 h-10 text-indigo-500 animate-float" />
              <Wallet className="absolute -bottom-2 left-1/4 w-8 h-8 text-blue-500 animate-float animation-delay-2000" />
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Oops! Trang không tồn tại
            </h2>
          </div>

          {/* Message Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 max-w-2xl mx-auto border-2 border-indigo-100">
            <div className="flex flex-col items-center justify-center space-x-3 mb-4">
              <p className="text-lg md:text-xl text-gray-700 font-bold mb-2">
                Có vẻ như bạn đã đi lạc đường rồi
              </p>
              <p className="text-lg text-gray-500 font-medium">
                Trang này admin lười nên chưa tạo, vui lòng quay lại sau.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() => window.history.back()}
              className="group w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Quay lại</span>
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-indigo-100"
            >
              <Home className="w-5 h-5" />
              <span>Về trang chủ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}