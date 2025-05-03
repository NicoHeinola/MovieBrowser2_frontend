import type TorrentWebsite from "@/models/torrentWebsite";
import api from "./api";

export const TorrentWebsiteService = () => {
  const getTorrentWebsites = async (params?: any) => {
    const response = await api.get<TorrentWebsite[]>("/torrent-websites", { params });
    return response.data;
  };

  const createTorrentWebsite = async (data: TorrentWebsite) => {
    const response = await api.post<TorrentWebsite>("/torrent-websites", data);
    return response.data;
  };

  const updateTorrentWebsite = async (id: number, data: TorrentWebsite) => {
    const response = await api.put<TorrentWebsite>(`/torrent-websites/${id}`, data);
    return response.data;
  };

  const deleteTorrentWebsite = async (id: number) => {
    const response = await api.delete(`/torrent-websites/${id}`);
    return response.data;
  };

  return { getTorrentWebsites, createTorrentWebsite, updateTorrentWebsite, deleteTorrentWebsite };
};
