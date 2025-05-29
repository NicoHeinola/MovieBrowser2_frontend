import { defineStore } from "pinia";
import type User from "@/models/user";
import { useStorage } from "@vueuse/core";
import { UserWatchSeasonService } from "@/services/userWatchSeason.service";
import type UserWatchSeason from "@/models/userWatchSeason";
import { useAuthStore } from "./auth.store";

export const useUserWatchSeasonStore = defineStore("userwatchseason", () => {
  const userWatchSeasons = useStorage<User[]>("userWatchSeasons", []);

  const loadUserWatchSeasons = async () => {
    const auth = useAuthStore();
    if (!auth.isAuthenticated) {
      userWatchSeasons.value = [];
      return;
    }

    userWatchSeasons.value = await UserWatchSeasonService().getUserWatchSeasons();
  };

  const findUserWatchSeasonByShowId = (showId: number) => {
    return userWatchSeasons.value.find((userWatchSeason: UserWatchSeason) => userWatchSeason.show_id === showId);
  };

  return {
    userWatchSeasons,
    loadUserWatchSeasons,
    findUserWatchSeasonByShowId,
  };
});
