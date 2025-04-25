import api from "./api";

export const ShowService = () => {
  const getShows = async (params?: any) => {
    const response = await api.get("/shows", {
      params: params,
    });

    return response.data;
  };

  const createShow = async (data: any) => {
    const isFormData = data instanceof FormData;
    const response = await api.post("/shows", data, {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    });
    return response.data;
  };

  const updateShow = async (id: number, data: any) => {
    const isFormData = data instanceof FormData;
    const response = await api.put(`/shows/${id}`, data, {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    });
    return response.data;
  };

  const deleteShow = async (id: number) => {
    const response = await api.delete(`/shows/${id}`);
    return response.data;
  };

  const uploadEpisodeFile = async (showId: number, episodeId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/shows/${showId}/episodes/${episodeId}/file`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000,
    });
    return response.data;
  };

  return { getShows, createShow, updateShow, deleteShow, uploadEpisodeFile };
};
