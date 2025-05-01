import api from "./api";
const AUTH_API_URL = "/auth";

export const AuthService = () => {
  const register = async (data: any): Promise<any> => {
    const response = await api.post(`${AUTH_API_URL}/register`, data);
    return response.data;
  };

  const login = async (username: string, password: string): Promise<any> => {
    const response = await api.post(`${AUTH_API_URL}/login`, { username, password });
    return response.data;
  };

  const fetchCurrentUser = async (): Promise<any> => {
    const response = await api.get(`${AUTH_API_URL}/users/me`);
    return response.data;
  };

  return { register, login, fetchCurrentUser };
};
