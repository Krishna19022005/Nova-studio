import { useEffect, useState } from "react";

import collections from "../data/collections";
import { getAdminCollections } from "../services/collectionService";

function normalizeAdminCollection(collection) {
  return {
    id: collection._id,
    number: collection.number,
    name: collection.name,
    slug: collection.slug,
    tagline: collection.tagline,
    description: collection.description,
    image: collection.imageUrl || null,
    source: "database",
  };
}

function useCollections() {
  const [allCollections, setAllCollections] =
    useState(
      collections.map((collection) => ({
        ...collection,
        source: "built-in",
      }))
    );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadAdminCollections() {
      try {
        const adminCollections =
          await getAdminCollections();

        if (!mounted) return;

        const normalizedAdmin =
          adminCollections.map(
            normalizeAdminCollection
          );

        const builtInSlugs = new Set(
          collections.map(
            (collection) =>
              collection.slug
          )
        );

        const uniqueAdminCollections =
          normalizedAdmin.filter(
            (collection) =>
              !builtInSlugs.has(
                collection.slug
              )
          );

        setAllCollections([
          ...collections.map(
            (collection) => ({
              ...collection,
              source: "built-in",
            })
          ),
          ...uniqueAdminCollections,
        ]);

        setError("");
      } catch (requestError) {
        console.error(
          "Failed to load admin collections:",
          requestError
        );

        if (mounted) {
          setError(
            "Unable to load additional collections."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAdminCollections();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    collections: allCollections,
    loading,
    error,
  };
}

export default useCollections;