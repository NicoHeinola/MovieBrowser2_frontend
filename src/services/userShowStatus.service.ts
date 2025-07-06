import type UserShowStatus from "@/models/userShowStatus";
import api from "./api";

export const UserShowStatusService = () => {
  const getUserShowStatuses = async (params?: any) => {
    const response = await api.get<UserShowStatus[]>("/user-show-statuses", { params });
    return response.data;
  };

  const createOrUpdateUserShowStatus = async (userShowStatus: UserShowStatus) => {
    const response = await api.post<UserShowStatus>("/user-show-statuses", userShowStatus);
    return response.data;
  };

  const deleteUserShowStatus = async (showId: number) => {
    const response = await api.delete(`/user-show-statuses/${showId}`);
    return response.data;
  };

  return { getUserShowStatuses, createOrUpdateUserShowStatus, deleteUserShowStatus };
};
