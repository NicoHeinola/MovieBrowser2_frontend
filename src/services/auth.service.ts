import api, { basicAPI } from "./api";
const AUTH_API_URL = "/auth";

export const AuthService = () => {
  const register = async (data: any): Promise<any> => {
    const response = await api.post(`${AUTH_API_URL}/register`, data);
    return response.data;
  };

  const login = async (username: string, password: string): Promise<any> => {
    const response = await api.post(`${AUTH_API_URL}/token`, { username, password });
    return response.data;
  };

  const refreshToken = async (): Promise<any> => {
    const response = await basicAPI.post(`${AUTH_API_URL}/refresh-token`, { refresh_token: refreshToken });
    return response.data;
  };

  const fetchCurrentUser = async (): Promise<any> => {
    const response = await api.get(`${AUTH_API_URL}/me`);
    return response.data;
  };

  return { register, login, fetchCurrentUser, refreshToken };
};
