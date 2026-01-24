// components/auth/AuthScreen.tsx
"use client";

import React from "react";
import { useAuthForm } from "@/lib/auth/useAuthForm";
import LoginForm from "../form/LoginForm";
import RegisterForm from "../form/RegisterForm";
import { AuthBrandingLogin, AuthBrandingRegister } from "../brand/AuthBranding";

export default function AuthScreen() {
    const {
        login,
        loading,
        error,
        formData,
        agreed,
        setLogin,
        setError,
        setAgreed,
        handleChange,
        handleSubmit,
    } = useAuthForm();

    return (
        <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex lg:items-center justify-center relative overflow-hidden"
            onClick={() => { if (error) setError(null) }}>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
                <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            <div className="w-full max-w-6xl relative z-10">
                <div className="block relative overflow-hidden">
                    {error && (
                        <div className="error-box absolute top-8 left-8 lg:w-[calc(100%-64px)] rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 hidden lg:block">
                            {error}
                        </div>
                    )}

                    <div className="relative min-h-[900px] lg:min-h-screen bg-transparent">
                        {error && (
                            <div className="error-box relative z-10 rounded-b-xl bg-red-50 border-b border-red-200 px-4 py-3 text-xs text-center text-red-700 lg:hidden">
                                {error}
                            </div>
                        )}
                        {/* Login */}
                        <div
                            className={`
                                absolute inset-0 flex gap-8 justify-between items-center lg:px-8 lg:py-10
                                transition-all duration-500 ease-in-out
                                ${login
                                                    ? "opacity-100 translate-y-0 pointer-events-auto"
                                                    : "opacity-0 -translate-y-2 pointer-events-none"
                                                }
                            `}
                        >
                            <AuthBrandingLogin />

                            <LoginForm
                                formData={formData}
                                loading={loading}
                                onChange={handleChange}
                                onSubmit={handleSubmit}
                                onSwitchToRegister={() => {
                                    setLogin(false);
                                    setError(null);
                                }}
                            />
                        </div>

                        {/* Register */}
                        <div
                            className={`
                            absolute inset-0 flex gap-8 justify-between items-center lg:px-8 lg:pb-10 lg:pt-16 lg:top-[72px]
                            transition-all duration-500 ease-in-out
                            ${!login
                                ? "opacity-100 translate-y-0 pointer-events-auto"
                                : "opacity-0 -translate-y-2 pointer-events-none"
                            }
                            `}
                        >
                            <RegisterForm
                                formData={formData}
                                agreed={agreed}
                                loading={loading}
                                onChange={handleChange}
                                onAgreeChange={(checked) => setAgreed(checked)}
                                onSubmit={handleSubmit}
                                onSwitchToLogin={() => {
                                    setLogin(true);
                                    setError(null);
                                }}
                            />

                            <AuthBrandingRegister />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
