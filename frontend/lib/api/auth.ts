import apiClient from "./client";

export type SignupRequest = {
  email: string;
  password: string;
  name: string; // Changed from fullname to name to match backend schema
};

export type SigninRequest = {
  email: string;
  password: string;
};

export type SigninResponse = {
  access_token: string;
  token_type: string;
};

export type UpdatePasswordRequest = {
  password: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  msg: string;
};



export type User = {
  id: number;
  email: string;
  name: string; // Changed from fullname to name to match backend schema
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function signup(data: SignupRequest): Promise<User> {
  const res = await apiClient.post<User>("/auth/signup", data);
  return res.data;
}

export async function signin(data: SigninRequest): Promise<SigninResponse> {
  const res = await apiClient.post<SigninResponse>("/auth/signin", data);
  return res.data;
}

export type UpdateProfileRequest = {
  name?: string; // Changed from fullname to name to match backend schema
  email?: string;
};

export type Profile = {
  id: number;
  email: string;
  name: string; // Changed from fullname to name to match backend schema
  image_url: string | null;
};

export async function getProfile(): Promise<Profile> {
  const res = await apiClient.get<any>("/auth/profile");
  const d = res.data || {};
  return {
    id: d.id,
    email: d.email,
    name: d.name ?? d.fullname ?? d.full_name ?? "", // Support multiple field names for backward compatibility
    image_url: d.image_url ?? d.photo ?? null,
  } as Profile;
}

export async function updateProfile(data: UpdateProfileRequest): Promise<Profile> {
  const payload: any = {};
  if (data.name !== undefined) {
    payload.name = data.name; // Use 'name' field to match backend schema
  }
  if (data.email !== undefined) payload.email = data.email;

  const res = await apiClient.put<any>("/auth/profile", payload);
  const d = res.data || {};
  return {
    id: d.id,
    email: d.email,
    name: d.name ?? d.fullname ?? d.full_name ?? payload.name ?? "", // Support multiple field names
    image_url: d.image_url ?? d.photo ?? null,
  } as Profile;
}

export async function updatePassword(data: UpdatePasswordRequest): Promise<void> {
  const response = await apiClient.put("/auth/profile", data);
  
  // If we reach here, the request was successful
  if (response.status >= 200 && response.status < 300) {
    return;
  } else {
    throw new Error(`Password update failed with status: ${response.status}`);
  }
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  const res = await apiClient.post<ForgotPasswordResponse>("/auth/forgot-password", data);
  return res.data;
}



export type ValidateResetTokenRequest = {
  token: string;
};

export type ValidateResetTokenResponse = {
  valid: boolean;
  message: string;
  user: {
    email: string;
    name: string;
  };
};

export type ResetPasswordRequest = {
  token: string;
  new_password: string;
};

export type ResetPasswordResponse = {
  message: string;
  user: {
    email: string;
    name: string;
  };
};

export async function validateResetToken(data: ValidateResetTokenRequest): Promise<ValidateResetTokenResponse> {
  const res = await apiClient.post<ValidateResetTokenResponse>("/auth/validate-reset-token", data);
  return res.data;
}

export async function resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  const res = await apiClient.post<ResetPasswordResponse>("/auth/reset-password", data);
  return res.data;
}

export async function uploadProfileImage(file: File): Promise<Profile> {
  const form = new FormData();
  form.append("file", file);
  const res = await apiClient.post("/auth/upload-image", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  // After upload, fetch the updated profile to avoid relying on response shape
  return await getProfile();
}
