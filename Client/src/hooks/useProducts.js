import { useEffect, useState } from "react";

import products from "../data/products";

import { getAdminProducts } from "../services/productService";


function normalizeAdminProduct(product) {
  return {
    id: product._id,

    name: product.name,

    slug: product.slug,

    code: product.code,

    collection: product.collection?.trim().toLowerCase(),

    subtitle: product.subtitle || "",

    finish: product.finish || "",

    colour: product.colour || "",

    space: product.space || "",

    description: product.description || "",

    specs: product.specs
      ? Object.fromEntries(
          Object.entries(product.specs)
        )
      : {},

    image: product.imageUrl || null,

    gallery: Array.isArray(product.gallery)
      ? product.gallery
      : [],

    source: "database",
  };
}


function useProducts() {
  const [
    allProducts,
    setAllProducts,
  ] = useState(
    products.map((product) => ({
      ...product,
      source: "built-in",
    }))
  );


  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    let mounted = true;


    async function loadAdminProducts() {
      try {
        const adminProducts =
          await getAdminProducts();


        if (!mounted) return;


        const normalizedAdmin =
          adminProducts.map(
            normalizeAdminProduct
          );


        /*
         * Keep the existing React products.
         *
         * If an admin product has the same slug
         * as a built-in product, the built-in product
         * wins so we don't show duplicates.
         */

        const builtInSlugs =
          new Set(
            products.map(
              (product) =>
                product.slug
            )
          );


        const uniqueAdminProducts =
          normalizedAdmin.filter(
            (product) =>
              !builtInSlugs.has(
                product.slug
              )
          );


        setAllProducts([
          ...products.map(
            (product) => ({
              ...product,
              source: "built-in",
            })
          ),

          ...uniqueAdminProducts,
        ]);


        setError("");

      } catch (requestError) {

        console.error(
          "Failed to load admin products:",
          requestError
        );


        if (mounted) {
          setError(
            "Unable to load additional products."
          );
        }

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }
    }


    loadAdminProducts();


    return () => {
      mounted = false;
    };

  }, []);


  return {
    products: allProducts,
    loading,
    error,
  };
}


export default useProducts;