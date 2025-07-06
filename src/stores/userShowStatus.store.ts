import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import type userShowStatus from "@/models/userShowStatus";
import { useAuthStore } from "./auth.store";
import { UserShowStatusService } from "@/services/userShowStatus.service";
import type UserShowStatus from "@/models/userShowStatus";

export const useUserShowStatusStore = defineStore("usershowstatus", () => {
  const userShowStatuses = useStorage<UserShowStatus[]>("userShowStatuses", []);

  const loadUserShowStatuses = async () => {
    const auth = useAuthStore();
    if (!auth.isAuthenticated) {
      userShowStatuses.value = [];
      return;
    }

    userShowStatuses.value = await UserShowStatusService().getUserShowStatuses();
  };

  const findUserShowStatusByShowId = (showId?: number) => {
    return userShowStatuses.value.find((userShowStatus: userShowStatus) => userShowStatus.show_id === showId);
  };

  const createOrUpdateUserShowStatus = async (userShowStatus: userShowStatus) => {
    const existingStatus = findUserShowStatusByShowId(userShowStatus.show_id);
    if (existingStatus) {
      existingStatus.status = userShowStatus.status;
      await UserShowStatusService().createOrUpdateUserShowStatus(existingStatus);
    } else {
      const newStatus = await UserShowStatusService().createOrUpdateUserShowStatus(userShowStatus);
      userShowStatuses.value.push(newStatus);
    }
  };

  return {
    userShowStatuses,
    loadUserShowStatuses,
    findUserShowStatusByShowId,
    createOrUpdateUserShowStatus,
  };
});
