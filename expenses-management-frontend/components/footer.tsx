'use client';

import { Wallet, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Send } from 'lucide-react';
import { useAuthUser } from "@/lib/auth/useAuthUser";

export function Footer() {
  const { user, initializing } = useAuthUser();

  const featureLinks = [
    { name: 'Quản lý', href: '/manage' },
    { name: 'Phân tích', href: '/analyze' },
    { name: 'Kế hoạch', href: '/plan' }
  ];

  const supportLinks = [
    { name: 'Trung tâm trợ giúp', href: '/help' },
    { name: 'Câu hỏi thường gặp', href: '/faq' },
    { name: 'Báo cáo lỗi', href: '/report-issue' }
  ];

  const legalLinks = [
    { name: 'Chính sách bảo mật', href: '/privacy-policy' },
    { name: 'Điều khoản sử dụng', href: '/terms-of-service' },
    { name: 'Cookies', href: '/cookies' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:bg-blue-600' },
    { icon: Twitter, href: '#', color: 'hover:bg-sky-500' },
    { icon: Instagram, href: '#', color: 'hover:bg-cyan-600' },
  ];

  return (
    <footer className={`bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 text-white ${user && "rounded-t-[32px] lg:rounded-t-[64px]"}`}>
      {/* Main Footer Content */}
      <div className={`max-w-7xl mx-auto px-4 pb-8 ${user ? "pt-16" : "pt-8"}`}>
        {user && (
          <>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-[100px] justify-between mb-12">
              {/* Brand Section */}
              <div className="lg:w-[400px] flex-none">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-white p-2 rounded-lg shadow-lg">
                    <img src="/logo-qfin.png" alt="QFin Logo" className="h-8 w-8" />
                  </div>
                  <span className="text-3xl font-bold">QFin</span>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mt-6">
                  <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                    <Mail className="h-5 w-5 text-indigo-400" />
                    <span className="text-sm">ngothanhquang.dev@gmail.com</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                    <MapPin className="h-5 w-5 text-indigo-400" />
                    <span className="text-sm">Đà Nẵng, Việt Nam</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Product Links */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Tính năng</h3>
                  <ul className="space-y-3">
                    {featureLinks.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Support Links */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Hỗ trợ</h3>
                  <ul className="space-y-3">
                    {supportLinks.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Newsletter */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Giới thiệu</h3>
                  <p className='mt-3 text-gray-300 leading-relaxed'>Nền tảng quản lý tài chính thông minh giúp bạn kiểm soát chi tiêu và đạt mục tiêu tài chính hiệu quả.</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 my-8"></div>
          </>
        )}

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-gray-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} QFin. All rights reserved.
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-6">
            {legalLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Social Media */}
          <div className="flex items-center space-x-3">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  className={`bg-white/10 p-2 rounded-lg hover:scale-110 transition-all duration-300 ${social.color}`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>

      </div>
    </footer>
  );
}