'use client';

import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft, Wallet, Clock, Sparkles, Mail, Bell, Rocket } from 'lucide-react';

export default function QFinComingSoon() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 8,
    minutes: 42,
    seconds: 30
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
              days--;
              if (days < 0) {
                clearInterval(timer);
                return prev;
              }
            }
          }
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const features = [
    {
      icon: Wallet,
      title: 'Quản lý chi tiêu',
      description: 'Theo dõi mọi khoản chi tiêu một cách dễ dàng'
    },
    {
      icon: Sparkles,
      title: 'Phân tích AI',
      description: 'Gợi ý thông minh dựa trên thói quen của bạn'
    },
    {
      icon: Rocket,
      title: 'Tối ưu hóa',
      description: 'Giúp bạn tiết kiệm và đạt mục tiêu nhanh hơn'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Wallet className="absolute top-1/4 left-1/4 w-8 h-8 text-indigo-400 opacity-20 animate-float" />
        <Sparkles className="absolute top-1/3 right-1/4 w-10 h-10 text-blue-400 opacity-20 animate-float animation-delay-2000" />
        <Rocket className="absolute bottom-1/3 left-1/3 w-6 h-6 text-cyan-400 opacity-20 animate-float animation-delay-4000" />
      </div>

      <div className="max-w-5xl w-full relative z-10 my-9">

        <div className="text-center">
          {/* Main Icon */}
          <div className="inline-flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-indigo-600 to-blue-600 p-8 rounded-3xl shadow-2xl">
                <Clock className="h-20 w-20 text-white animate-bounce-slow" />
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span>Đang phát triển tính năng mới</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Trang này đang được
            <span className="block bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mt-2">
              Xây dựng
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Chúng tôi đang làm việc chăm chỉ để mang đến cho bạn trải nghiệm tuyệt vời nhất. 
            Trang này sẽ sớm ra mắt! 🚀
          </p>

          {/* Countdown Timer */}
          <div className="mb-12">
            <p className="text-sm font-medium text-gray-500 mb-4">Dự kiến ra mắt sau:</p>
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { label: 'Ngày', value: timeLeft.days },
                { label: 'Giờ', value: timeLeft.hours },
                { label: 'Phút', value: timeLeft.minutes },
                { label: 'Giây', value: timeLeft.seconds }
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-2xl shadow-xl p-6 hover:scale-105 transition-transform">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Preview */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Những gì đang chờ bạn</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="bg-gradient-to-br from-indigo-500 to-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Email Subscription */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-indigo-600 mr-2" />
              <h3 className="text-2xl font-bold text-gray-900">Nhận thông báo khi ra mắt</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Để lại email của bạn để được thông báo ngay khi tính năng này sẵn sàng!
            </p>

            {subscribed ? (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 animate-scale-in">
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">Đã đăng ký thành công! 🎉</span>
                </div>
                <p className="text-sm text-green-600 mt-2">Chúng tôi sẽ thông báo cho bạn sớm nhất có thể.</p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                  />
                </div>
                <button
                  onClick={handleSubscribe}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
                >
                  Đăng ký
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Home className="w-5 h-5" />
              <span>Về trang chủ</span>
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-indigo-100"
            >
              <Wallet className="w-5 h-5" />
              <span>Xem Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}