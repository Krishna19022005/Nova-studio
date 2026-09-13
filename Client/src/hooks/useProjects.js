import { useEffect, useState } from "react";

import projects from "../data/projects";

import {
  getAdminProjects,
} from "../services/projectService";


function normalizeAdminProject(project) {
  return {
    id: project._id,

    name: project.name,

    slug: project.slug,

    category: project.category,

    description: project.description || "",

    location: project.location || "",

    surface: project.surface || "",

    projectType:
      project.projectType || project.category || "",

    studio:
      project.studio || "NOVA Flooring Studio",

    story: Array.isArray(project.story)
      ? project.story
      : [],

    image: project.imageUrl || null,

    gallery: Array.isArray(project.gallery)
      ? project.gallery
      : [],

    source: "database",
  };
}


function useProjects() {
  const [
    allProjects,
    setAllProjects,
  ] = useState(
    projects.map((project) => ({
      ...project,
      source: "built-in",
    }))
  );


  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    let mounted = true;


    async function loadAdminProjects() {
      try {
        const adminProjects =
          await getAdminProjects();


        if (!mounted) return;


        const normalizedAdmin =
          adminProjects.map(
            normalizeAdminProject
          );


        const builtInSlugs =
          new Set(
            projects.map(
              (project) => project.slug
            )
          );


        const uniqueAdminProjects =
          normalizedAdmin.filter(
            (project) =>
              !builtInSlugs.has(
                project.slug
              )
          );


        setAllProjects([
          ...projects.map(
            (project) => ({
              ...project,
              source: "built-in",
            })
          ),

          ...uniqueAdminProjects,
        ]);


        setError("");
      } catch (requestError) {
        console.error(
          "Failed to load admin projects:",
          requestError
        );

        if (mounted) {
          setError(
            "Unable to load additional projects."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }


    loadAdminProjects();


    return () => {
      mounted = false;
    };
  }, []);


  return {
    projects: allProjects,
    loading,
    error,
  };
}


export default useProjects;