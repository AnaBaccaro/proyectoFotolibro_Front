import api from "./api";

export const getPhotobooks = async () => {
  const response = await api.get("/fotolibros");
  return response.data;
};
