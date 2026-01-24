"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  Home,
  LayoutDashboard,
  BarChart3,
  LogIn,
  Wallet,
  ChevronDown,
} from "lucide-react";
import { useAuthUser } from "@/lib/auth/useAuthUser";
import { useUserProfile } from "@/lib/auth/useUserProfile";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false);
  const { user, initializing } = useAuthUser();
  const { profile } = useUserProfile();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const userName =
    profile?.firstName || user?.displayName || user?.email?.split("@")[0] || "người dùng";
  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  const avatarUrl = profile?.avatar?.trim();

  const navItems = [
    { name: "Trang chủ", icon: Home, href: "/" },
    { name: "Quản lý", icon: LayoutDashboard, href: "/manage" },
    { name: "Phân tích", icon: BarChart3, href: "/analyze" },
    { name: "Kế hoạch", icon: Wallet, href: "/plan" },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!userMenuRef.current) {
        return;
      }

      if (!userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      setIsMobileUserMenuOpen(false);
    }
  }, [isMenuOpen]);

  return (
    <nav className="bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 shadow-lg sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16 lg:h-24">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2 group cursor-pointer">
            <div className="bg-white p-2 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
              <img
                src="/logo-qfin.png"
                alt="QFin Logo"
                className="h-6 lg:h-8 w-6 lg:w-8"
              />
            </div>
            <span className="text-xl lg:text-2xl font-bold text-white tracking-tight">
              QFin
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex flex-1 items-center justify-center space-x-1">
            {user &&
              navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300 group"
                  >
                    <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-lg">
                      {item.name}
                    </span>
                  </a>
                );
              })}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            {!user && !initializing && (
              <a
                href="/login"
                className="flex items-center space-x-2 px-5 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <LogIn className="h-5 w-5" />
                <span className="text-lg">Đăng nhập</span>
              </a>
            )}

            {user && (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center space-x-3 text-white min-w-0 px-2 py-1 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={userName}
                      className="h-9 w-9 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-white/20 text-sm font-semibold flex items-center justify-center border border-white/20">
                      {userInitials || "?"}
                    </div>
                  )}
                  <span className="font-semibold text-base max-w-[200px] truncate">
                    Xin chào, {userName}
                  </span>
                </button>

                <div
                  className={`absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 z-50 origin-top-right transform transition-all duration-200 ease-out ${
                    isUserMenuOpen
                      ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                      : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                  }`}
                >
                  <a
                    href="/profile"
                    className="block px-4 py-3 text-sm font-semibold hover:bg-gray-100 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Hồ sơ của tôi
                  </a>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-gray-100 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden ml-auto p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          lg:hidden absolute left-0 right-0 bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900
          transition-all duration-300 ease-out overflow-hidden rounded-b-lg
          ${
            isMenuOpen
              ? "max-h-fit opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-3 pointer-events-none"
          }
        `}
      >
        <div className="flex flex-col space-y-2 bg-white/10 backdrop-blur-md rounded-lg p-4">
          {user && (
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => setIsMobileUserMenuOpen((prev) => !prev)}
                className="flex items-center space-x-3 px-2 py-2 text-white min-w-0 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={userName}
                    className="h-9 w-9 rounded-full object-cover border border-white/20"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-white/20 text-sm font-semibold flex items-center justify-center border border-white/20">
                    {userInitials || "?"}
                  </div>
                )}
                <span className="font-semibold truncate flex-1 text-left">
                  Xin chào, {userName}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isMobileUserMenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <div
                className={`ml-12 mt-1 overflow-hidden transition-all duration-200 ease-out ${
                  isMobileUserMenuOpen
                    ? "max-h-20 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <a
                  href="/profile"
                  className="block px-3 py-2 text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hồ sơ của tôi
                </a>
              </div>
            </div>
          )}
          {user &&
            navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-semibold">{item.name}</span>
              </a>
            ))}

          {user && (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center justify-center space-x-2 px-4 py-3 mt-2 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all duration-300"
            >
              Đăng xuất
            </button>
          )}

          {!user && !initializing && (
            <a
              href="/login"
              className="flex items-center justify-center space-x-2 px-4 py-3 mt-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <LogIn className="h-5 w-5" />
              <span>Đăng nhập</span>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
