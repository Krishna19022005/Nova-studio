import api from "./api";

export async function getAdminCollections() {
  const response = await api.get(
    "/collections"
  );

  return response.data.data;
}