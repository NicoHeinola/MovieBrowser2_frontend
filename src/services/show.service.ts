import api from "./api";

export const ShowService = () => {
  const getShows = async (params: any) => {
    const response = await api.get("/shows", {
      params: params,
    });

    return response.data;
  };

  const createShow = async (data: any) => {
    const response = await api.post("/shows", data);
    return response.data;
  };

  const updateShow = async (id: string, data: any) => {
    const response = await api.put(`/shows/${id}`, data);
    return response.data;
  };

  const deleteShow = async (id: string) => {
    const response = await api.delete(`/shows/${id}`);
    return response.data;
  };

  return { getShows, createShow, updateShow, deleteShow };
};
