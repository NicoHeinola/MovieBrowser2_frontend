import api from "./api";

export const SettingService = () => {
  const getSettings = async (params?: any) => {
    const response = await api.get("/settings", { params });
    return response.data;
  };

  const createSetting = async (data: any) => {
    const response = await api.post("/settings", data);
    return response.data;
  };

  const updateSetting = async (id: number, data: any) => {
    const response = await api.put(`/settings/${id}`, data);
    return response.data;
  };

  const deleteSetting = async (id: number) => {
    const response = await api.delete(`/settings/${id}`);
    return response.data;
  };

  return { getSettings, createSetting, updateSetting, deleteSetting };
};
