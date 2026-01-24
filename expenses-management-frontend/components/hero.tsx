'use client';

import React from 'react';
import { TrendingUp, Shield, BarChart3, ArrowRight, Sparkles, Wallet, PieChart, Target } from 'lucide-react';

export function Hero() {
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
    <div>
      abc
    </div>
  );
}