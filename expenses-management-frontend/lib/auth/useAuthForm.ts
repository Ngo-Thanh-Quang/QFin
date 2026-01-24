"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, } from "firebase/auth";
import { auth } from "@/lib/firebase";
import type { AuthFormData } from "@/lib/types/auth";

function validateForm(
    formData: AuthFormData,
    login: boolean,
    agreed: boolean
): string | null {
    if (login) {
        if (!formData.email || !formData.password) {
            return "Vui lòng nhập email và mật khẩu";
        }
        return null;
    }

    if (!agreed) {
        return "Vui lòng đồng ý với Điều khoản sử dụng và Chính sách bảo mật";
    }

    const invalidNameRegex = /[^A-Za-zÀ-ỹà-ỹĂăÂâÊêÔôƠơƯưĐđ\s]/;

    if (
        invalidNameRegex.test(formData.lastName.trim()) ||
        invalidNameRegex.test(formData.firstName.trim())
    ) {
        return "Tên không được chứa số hoặc ký tự đặc biệt";
    }

    const simplePhoneRegex = /^0\d{9}$/;

    if (!simplePhoneRegex.test(formData.phone.trim())) {
        return "Số điện thoại không hợp lệ (phải gồm 10 chữ số, bắt đầu bằng 0)";
    }

    if (formData.password !== formData.confirmPassword) {
        return "Mật khẩu xác nhận không khớp!";
    }

    return null;
}

export function useAuthForm() {
    const router = useRouter();

    const [login, setLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<AuthFormData>({
        lastName: "",
        firstName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [agreed, setAgreed] = useState(false);

    const handleChange = useCallback(
        (field: keyof AuthFormData, value: string) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
        },
        []
    );

    const handleSubmit = useCallback(async () => {
        setError(null);

        const validationError = validateForm(formData, login, agreed);
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            if (login) {
                const userCred = await signInWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                );
                console.log("Login success:", userCred.user);

                router.push("/");
            } else {
                const userCred = await createUserWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                );

                const user = userCred.user;

                const idToken = await user.getIdToken();

                await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/register`, {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                    idToken,
                    lastName: formData.lastName,
                    firstName: formData.firstName,
                    email: formData.email,
                    phone: formData.phone,
                    }),
                });

                router.push("/");
            }
        } catch (err: any) {
            console.error(err);
            let msg = "Đã xảy ra lỗi, vui lòng thử lại";

            switch (err.code) {
                case "auth/invalid-credential":
                    msg = "Sai tài khoản hoặc mật khẩu, vui lòng thử lại!";
                    break;
                case "auth/email-already-in-use":
                    msg = "Email này đã được sử dụng";
                    break;
                case "auth/invalid-email":
                    msg = "Địa chỉ email không hợp lệ";
                    break;
                case "auth/weak-password":
                    msg = "Mật khẩu quá yếu (ít nhất 6 ký tự)";
                    break;
                case "auth/user-not-found":
                case "auth/wrong-password":
                    msg = "Email hoặc mật khẩu không đúng";
                    break;
            }

            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [formData, login, agreed, router]);

    return {
        // state
        login,
        loading,
        error,
        formData,
        agreed,
        // setters
        setLogin,
        setError,
        setAgreed,
        setFormData,
        // handlers
        handleChange,
        handleSubmit,
    };
}
