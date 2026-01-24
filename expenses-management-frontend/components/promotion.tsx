'use client';

import React from 'react';
import { TrendingUp, Shield, BarChart3, ArrowRight, Sparkles, Wallet, PieChart, Target } from 'lucide-react';

export function Promotion() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Tăng trưởng',
      description: 'Theo dõi tài sản tăng trưởng'
    },
    {
      icon: Shield,
      title: 'Bảo mật',
      description: 'An toàn tuyệt đối'
    },
    {
      icon: BarChart3,
      title: 'Phân tích',
      description: 'Báo cáo chi tiết'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Người dùng' },
    { number: '₫500M+', label: 'Được quản lý' },
    { number: '99.9%', label: 'Độ chính xác' },
    { number: '24/7', label: 'Hỗ trợ' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Wallet className="absolute top-1/4 left-1/4 w-8 h-8 text-indigo-400 opacity-20 animate-float" />
        <PieChart className="absolute top-1/3 right-1/4 w-10 h-10 text-blue-400 opacity-20 animate-float animation-delay-2000" />
        <Target className="absolute bottom-1/3 left-1/3 w-6 h-6 text-cyan-400 opacity-20 animate-float animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Main Hero Content */}
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-8 shadow-lg hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-4 h-4" />
            <span>Nền tảng quản lý tài chính thông minh #1</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Quản lý tài chính
            <span className="block bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mt-2">
              Thông minh & Hiệu quả
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto px-4">
            QFin giúp bạn kiểm soát chi tiêu, theo dõi đầu tư và đạt được mục tiêu tài chính một cách dễ dàng
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a href='/login' className="text-lg group w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <span>Bắt đầu miễn phí</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto mb-16">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}