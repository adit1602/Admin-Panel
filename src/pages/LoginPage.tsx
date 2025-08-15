import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import logo from "../assets/logo2.png";
import logo1 from "../assets/logo.png"; // Assuming you have a logo1.png in the assets folder

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fungsi untuk encrypt password dengan SHA-256
  const encryptPassword = (password: string): string => {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Encrypt password dengan SHA-256
      const encryptedPassword = encryptPassword(password.trim());

      const loginData = {
        email: email.trim(),
        password: encryptedPassword,
      };

      console.log("Sending login data:", loginData);
      console.log(
        "Login URL:",
        "https://api-test.bullionecosystem.com/api/v1/auth/login"
      );

      const response = await fetch(
        "https://api-test.bullionecosystem.com/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);
      console.log("Response status:", response.status);
      console.log("Response OK:", response.ok);
      console.log("Data structure:", Object.keys(data));
      console.log(
        "Data.data structure:",
        data.data ? Object.keys(data.data) : "No data object"
      );

      // Cek jika login berhasil (tidak ada iserror atau err_code)
      if (response.ok && !data.iserror && !data.err_code) {
        // Store the authentication token from data.data.token
        localStorage.setItem("token", data.data.token); // Gunakan "token" sebagai key
        localStorage.setItem("authToken", data.data.token); // Simpan juga dengan key "authToken" untuk kompatibilitas

        // Simpan informasi user jika ada
        if (data.data.user) {
          localStorage.setItem(
            "userName",
            data.data.user.name || data.data.name || ""
          );
          localStorage.setItem(
            "userEmail",
            data.data.user.email || data.data.email || ""
          );
        } else if (data.data.name) {
          localStorage.setItem("userName", data.data.name);
          localStorage.setItem("userEmail", data.data.email || "");
        }

        console.log("Login berhasil, navigasi ke dashboard");
        // Redirect to dashboard after successful login
        navigate("/dashboard");
      } else {
        // Handle login errors - tampilkan pesan error dari API
        const errorMessage =
          data.err_message ||
          data.err_message_en ||
          data.message ||
          "Login failed. Please check your credentials.";
        setApiError(errorMessage);
        console.error("Login failed:", data);
      }
    } catch (error) {
      console.error("Login error:", error);
      setApiError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Bagian Kiri - Gambar/Background */}
      <div className="lg:flex-1 bg-orange-600 relative order-2 lg:order-1">
        <div className="absolute inset-0"></div>

        {/* Konten Branding - ditampilkan di mobile juga */}
        <div className="relative z-10 p-6 sm:p-12 flex flex-col justify-center items-center lg:items-start lg:justify-start h-full">
          <div className="text-white text-center lg:text-left">
            <div className="mb-4">
              <img
                src={logo}
                alt="Logo"
                className="h-12 w-auto mx-auto lg:mx-0"
              />
              <img
                src={logo1}
                alt="Logo 1"
                className="absolute bottom-56 right-56 opacity-20 "
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Kanan - Form Login */}
      <div className="flex-auto bg-white flex items-start justify-center p-6 sm:p-8 order-1 lg:order-2">
        <div className="w-full max-w-md mx-auto py-7">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-2">
              Login Admin
            </h2>
            <p className="text-sm text-gray-600 sm:hidden">
              Silakan masuk untuk melanjutkan
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            {/* [Form fields tetap sama, hanya menyesuaikan spacing untuk mobile] */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {apiError}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full h-10 sm:h-12 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-xs sm:text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full h-10 sm:h-12 px-3 pr-10 sm:pr-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs sm:text-sm text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-10 sm:h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Masuk"}
            </button>
          </form>

          <div className="text-center mt-4 sm:mt-6">
            <p className="text-xs sm:text-sm text-gray-600">
              Belum punya akun?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Daftar di sini
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
