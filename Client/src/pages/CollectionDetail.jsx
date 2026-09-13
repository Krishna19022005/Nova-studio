import {
  ChevronDown,
  Heart,
  Image as ImageIcon,
  SlidersHorizontal,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

import { useMemo, useState } from "react";

import useCollections from "../hooks/useCollections";
import useProducts from "../hooks/useProducts";


function CollectionDetail() {
  const { slug } = useParams();


  const {
    collections,
    loading: collectionsLoading,
  } = useCollections();


  const {
    products,
    loading: productsLoading,
  } = useProducts();


  const collection = collections.find(
    (item) => item.slug === slug
  );


  const [finish, setFinish] =
    useState("all");

  const [colour, setColour] =
    useState("all");

  const [space, setSpace] =
    useState("all");

  const [sort, setSort] =
    useState("default");


  const collectionProducts = useMemo(() => {
    if (!collection) return [];

    return products.filter(
      (product) =>
        product.collection?.trim().toLowerCase() ===
        collection.slug?.trim().toLowerCase()
    );
  }, [products, collection]);


  const filteredProducts = useMemo(() => {
    let result = [...collectionProducts];


    if (finish !== "all") {
      result = result.filter(
        (product) =>
          product.finish === finish
      );
    }


    if (colour !== "all") {
      result = result.filter(
        (product) =>
          product.colour === colour
      );
    }


    if (space !== "all") {
      result = result.filter(
        (product) =>
          product.space === space
      );
    }


    if (sort === "name-asc") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }


    if (sort === "name-desc") {
      result.sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    }


    if (sort === "code-asc") {
      result.sort((a, b) =>
        a.code.localeCompare(b.code)
      );
    }


    return result;
  }, [
    collectionProducts,
    finish,
    colour,
    space,
    sort,
  ]);


  const clearFilters = () => {
    setFinish("all");
    setColour("all");
    setSpace("all");
    setSort("default");
  };


  /*
   * =========================================
   * LOADING
   * =========================================
   */

  if (
    collectionsLoading ||
    productsLoading
  ) {
    return (
      <section className="collection-detail-not-found">
        <div className="nova-container">

          <span className="nova-eyebrow">
            Collection
          </span>

          <h1>
            Loading collection...
          </h1>

        </div>
      </section>
    );
  }


  /*
   * =========================================
   * NOT FOUND
   * =========================================
   */

  if (!collection) {
    return (
      <section className="collection-detail-not-found">
        <div className="nova-container">

          <span className="nova-eyebrow">
            Collection
          </span>

          <h1>
            Collection not found.
          </h1>

          <Link
            to="/collections"
            className="nova-btn nova-btn-outline"
          >
            Back to Collections
          </Link>

        </div>
      </section>
    );
  }


  return (
    <section className="collection-detail">


      {/* =========================================
          HERO
      ========================================= */}

      <div className="collection-detail-hero">

        <div className="nova-container">

          <div className="collection-detail-breadcrumb">

            <Link to="/">
              Home
            </Link>

            <span>›</span>

            <Link to="/collections">
              Collections
            </Link>

            <span>›</span>

            <strong>
              {collection.name}
            </strong>

          </div>


          <div className="collection-detail-hero-layout">


            {/* MAIN CONTENT */}

            <div className="collection-detail-copy">

              <h1>
                {collection.name} Collection
              </h1>


              <div className="collection-detail-subtitle">

                {collection.id === "metallic"
                  ? "Liquid movement. Mineral depth. Unrepeatable character."
                  : collection.tagline}

              </div>


              <p>
                {collection.description}
              </p>

            </div>


            {/* SIDE NAVIGATION */}

            <div className="collection-detail-side-nav">

              <span>
                Surfaces
              </span>

              <span>
                That
              </span>

              <span>
                Inspire
              </span>

              <span>
                More
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* =========================================
          FILTER BAR + PRODUCTS
      ========================================= */}

      <section className="collection-detail-products">

        <div className="nova-container">


          <div className="collection-detail-filter-header">


            <div className="collection-detail-filter-label">

              <span>
                Filter By
              </span>

            </div>


            <button
              type="button"
              className="collection-mobile-filter"
              aria-label="Open filters"
            >

              <span>
                Filter By
              </span>

              <SlidersHorizontal
                size={15}
                strokeWidth={1.4}
              />

            </button>


            <div className="collection-detail-filters">


              {/* FINISH */}

              <label className="collection-filter">

                <span className="sr-only">
                  Finish
                </span>

                <select
                  value={finish}
                  onChange={(event) =>
                    setFinish(
                      event.target.value
                    )
                  }
                >

                  <option value="all">
                    Finish
                  </option>

                  <option value="Gloss">
                    Gloss
                  </option>

                  <option value="Satin">
                    Satin
                  </option>

                  <option value="Matte">
                    Matte
                  </option>

                </select>


                <ChevronDown
                  size={15}
                  strokeWidth={1.3}
                />

              </label>


              {/* COLOUR */}

              <label className="collection-filter">

                <span className="sr-only">
                  Colour
                </span>

                <select
                  value={colour}
                  onChange={(event) =>
                    setColour(
                      event.target.value
                    )
                  }
                >

                  <option value="all">
                    Colour
                  </option>

                  <option value="Black">
                    Black
                  </option>

                  <option value="Bronze">
                    Bronze
                  </option>

                  <option value="Champagne">
                    Champagne
                  </option>

                  <option value="Charcoal">
                    Charcoal
                  </option>

                  <option value="Gold">
                    Gold
                  </option>

                  <option value="Silver">
                    Silver
                  </option>

                  <option value="Copper">
                    Copper
                  </option>

                  <option value="Amber">
                    Amber
                  </option>

                </select>


                <ChevronDown
                  size={15}
                  strokeWidth={1.3}
                />

              </label>


              {/* SPACE */}

              <label className="collection-filter">

                <span className="sr-only">
                  Space
                </span>

                <select
                  value={space}
                  onChange={(event) =>
                    setSpace(
                      event.target.value
                    )
                  }
                >

                  <option value="all">
                    Space
                  </option>

                  <option value="Residential">
                    Residential
                  </option>

                  <option value="Commercial">
                    Commercial
                  </option>

                  <option value="Hospitality">
                    Hospitality
                  </option>

                  <option value="Retail">
                    Retail
                  </option>

                </select>


                <ChevronDown
                  size={15}
                  strokeWidth={1.3}
                />

              </label>


              {/* SORT */}

              <label className="collection-filter">

                <span className="sr-only">
                  Sort By
                </span>

                <select
                  value={sort}
                  onChange={(event) =>
                    setSort(
                      event.target.value
                    )
                  }
                >

                  <option value="default">
                    Sort By
                  </option>

                  <option value="name-asc">
                    Name A–Z
                  </option>

                  <option value="name-desc">
                    Name Z–A
                  </option>

                  <option value="code-asc">
                    Product Code
                  </option>

                </select>


                <ChevronDown
                  size={15}
                  strokeWidth={1.3}
                />

              </label>

            </div>


            {/* CLEAR */}

            <button
              type="button"
              className="collection-detail-clear"
              onClick={clearFilters}
            >
              Clear All
            </button>


            {/* COUNT */}

            <div className="collection-detail-count">

              {filteredProducts.length}{" "}

              Surfaces

            </div>


          </div>


          {/* =========================================
              PRODUCTS
          ========================================= */}

          <div className="collection-product-grid">

            {filteredProducts.map(
              (product) => {

                /*
                 * Main/card image priority:
                 *
                 * 1. product.image
                 * 2. first gallery image
                 * 3. placeholder
                 */

                const productCardImage =
                  product.image ||
                  product.gallery?.[0] ||
                  null;


                return (
                  <article
                    className="collection-product-card"
                    key={product.id}
                  >

                    <Link
                      to={`/products/${product.slug}`}
                      className="collection-product-image"
                    >

                      {productCardImage ? (

                        <img
                          src={productCardImage}
                          alt={product.name}
                        />

                      ) : (

                        <div className="collection-product-placeholder">

                          <ImageIcon
                            size={25}
                            strokeWidth={1.1}
                          />

                          <span>
                            Image Placeholder
                          </span>

                          <small>
                            Admin Upload
                          </small>

                        </div>

                      )}


                      <span className="collection-product-heart">

                        <Heart
                          size={19}
                          strokeWidth={1.25}
                        />

                      </span>

                    </Link>


                    <div className="collection-product-content">

                      <div>

                        <h2>
                          {product.name}
                        </h2>

                        <span>
                          {product.code}
                        </span>

                      </div>


                      <Link
                        to={`/products/${product.slug}`}
                        className="collection-product-details"
                      >

                        <span>
                          View Details
                        </span>

                        <ChevronDown
                          size={15}
                          strokeWidth={1.3}
                          className="collection-product-arrow"
                        />

                      </Link>

                    </div>

                  </article>
                );
              }
            )}

          </div>


          {/* EMPTY STATE */}

          {filteredProducts.length === 0 && (

            <div className="collection-product-empty">

              <span>
                No surfaces found.
              </span>

              <button
                type="button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>

          )}

        </div>

      </section>

    </section>
  );
}


export default CollectionDetail;