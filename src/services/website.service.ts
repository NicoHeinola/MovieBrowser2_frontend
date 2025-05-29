import type Website from "@/models/website";
import api from "./api";

export const WebsiteService = () => {
  const getWebsites = async (params?: any) => {
    const response = await api.get<Website[]>("/websites", { params });
    return response.data;
  };

  const createWebsite = async (data: Website) => {
    const response = await api.post<Website>("/websites", data);
    return response.data;
  };

  const updateWebsite = async (id: number, data: Website) => {
    const response = await api.put<Website>(`/websites/${id}`, data);
    return response.data;
  };

  const deleteWebsite = async (id: number) => {
    const response = await api.delete(`/websites/${id}`);
    return response.data;
  };

  const seedWebsites = async () => {
    const response = await api.post("/websites/seed");
    return response.data;
  };

  return { getWebsites, createWebsite, updateWebsite, deleteWebsite, seedWebsites };
};
