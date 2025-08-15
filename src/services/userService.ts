// src/services/userService.ts
import { api } from "../lib/api";

export interface UpdateUserData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  date_of_birth: string;
}

export const userService = {
  getUsers: async (offset = 0, limit = 10) => {
    const response = await api.get(`/admin?offset=${offset}&limit=${limit}`);
    return response.data;
  },

  updateUser: async (userId: string, userData: UpdateUserData) => {
    const response = await api.put(`/admin/${userId}/update`, userData);
    return response.data;
  },
};
