// src/types/index.ts
export interface AdminUser {
  _id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  date_of_birth: string;
  photo?: string;
}

export interface ApiResponse<T = any> {
  data: T;
  iserror: boolean;
  err_code?: string;
  err_message?: string;
  err_message_en?: string;
  message?: string;
}
