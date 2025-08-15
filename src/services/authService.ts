// src/services/authService.ts
import CryptoJS from "crypto-js";
import { api } from "../lib/api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  gender: string;
  dateOfBirth: string;
  profilePhoto?: File;
}

export const authService = {
  login: async (data: LoginData) => {
    const encryptedPassword = CryptoJS.SHA256(data.password.trim()).toString(
      CryptoJS.enc.Hex
    );

    const response = await api.post("/auth/login", {
      email: data.email.trim(),
      password: encryptedPassword,
    });

    return response.data;
  },

  register: async (data: RegisterData) => {
    const encryptedPassword = CryptoJS.SHA256(data.password.trim()).toString(
      CryptoJS.enc.Hex
    );

    // Create form data for multipart/form-data request
    const formData = new FormData();
    formData.append("first_name", data.firstName);
    formData.append("last_name", data.lastName);
    formData.append("email", data.email);
    formData.append("password", encryptedPassword);
    formData.append("phone", data.phoneNumber);
    formData.append("address", data.address);
    formData.append("gender", data.gender);
    formData.append("date_of_birth", data.dateOfBirth);

    if (data.profilePhoto) {
      formData.append("photo", data.profilePhoto);
    }

    const response = await api.post("/auth/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
  },
};
