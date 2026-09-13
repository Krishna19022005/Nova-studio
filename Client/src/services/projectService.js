import api from "./api";

export async function getAdminProjects() {
  const response = await api.get("/projects");

  return response.data.data;
}

export async function getAdminProjectBySlug(slug) {
  const response = await api.get(`/projects/${slug}`);

  return response.data.data;
}