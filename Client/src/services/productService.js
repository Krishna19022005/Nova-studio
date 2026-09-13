import api from "./api";

export async function getAdminProducts() {
  const response = await api.get("/products");

  return response.data.data;
}

export async function getAdminProductBySlug(slug) {
  const response = await api.get(
    `/products/${slug}`
  );

  return response.data.data;
}