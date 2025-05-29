import api from "./api";
import type UserWatchSeason from "@/models/userWatchSeason";

export const UserWatchSeasonService = () => {
  const getUserWatchSeasons = async (params?: any) => {
    const response = await api.get<UserWatchSeason[]>("/user-watch-seasons", { params });
    return response.data;
  };

  return { getUserWatchSeasons };
};
