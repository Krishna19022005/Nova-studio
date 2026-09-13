import React, {
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  Search,
  Sparkles,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

import useCollections from "../hooks/useCollections";
import useProducts from "../hooks/useProducts";

function ProductDetail() {
  const { slug } = useParams();

  const [activeImage, setActiveImage] = useState(0);

  const [isFavourite, setIsFavourite] =
    useState(false);

  /* =========================================
     HYBRID DATA
  ========================================= */

  const {
    collections,
    loading: collectionsLoading,
  } = useCollections();

  const {
    products,
    loading: productsLoading,
  } = useProducts();

  const product = products.find(
    (item) => item.slug === slug
  );

  const collection = product
    ? collections.find(
        (item) =>
          item.slug === product.collection
      )
    : null;

  /* =========================================
     PRODUCTS FROM SAME COLLECTION
  ========================================= */

  const collectionProducts = useMemo(() => {
    if (!product) return [];

    return products.filter(
      (item) =>
        item.collection
          ?.trim()
          .toLowerCase() ===
        product.collection
          ?.trim()
          .toLowerCase()
    );
  }, [products, product]);

  const currentIndex =
    collectionProducts.findIndex(
      (item) => item.slug === slug
    );

  const previousProduct =
    currentIndex > 0
      ? collectionProducts[
          currentIndex - 1
        ]
      : null;

  const nextProduct =
    currentIndex <
        collectionProducts.length - 1
      ? collectionProducts[
          currentIndex + 1
        ]
      : null;

  /* =========================================
     GALLERY
  ========================================= */

  const galleryImages =
    product?.gallery?.length > 0
      ? product.gallery
      : product?.image
        ? [product.image]
        : [];

  /* =========================================
     LOADING
  ========================================= */

  if (
    collectionsLoading ||
    productsLoading
  ) {
    return (
      <section className="product-detail-not-found">
        <div className="nova-container">
          <span className="nova-eyebrow">
            Product
          </span>

          <h1>
            Loading product...
          </h1>
        </div>
      </section>
    );
  }

  /* =========================================
     NOT FOUND
  ========================================= */

  if (!product) {
    return (
      <section className="product-detail-not-found">
        <div className="nova-container">
          <span className="nova-eyebrow">
            Product
          </span>

          <h1>
            Product not found.
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

  /* =========================================
     IMAGE RENDERER
  ========================================= */

  const renderImage = (src, alt) => {
    if (src) {
      return (
        <img
          src={src}
          alt={alt}
        />
      );
    }

    return (
      <div className="product-image-placeholder">
        <ImageIcon
          size={42}
          strokeWidth={1}
        />

        <span>
          Image Placeholder
        </span>

        <small>
          Admin Upload
        </small>

        <p>
          Recommended aspect ratio: 4:3 or 16:9
        </p>
      </div>
    );
  };

  return (
    <section className="product-detail">

      {/* =====================================
          TOP NAVIGATION / BREADCRUMB
      ====================================== */}

      <div className="product-detail-top">
        <div className="nova-container">
          <div className="product-detail-top-row">

            <div className="product-detail-breadcrumb">

              <Link to="/">
                Home
              </Link>

              <span>›</span>

              <Link to="/collections">
                Collections
              </Link>

              <span>›</span>

              <Link
                to={`/collections/${product.collection}`}
              >
                {collection?.name}
              </Link>

              <span>›</span>

              <strong>
                {product.name}
              </strong>

            </div>

            <div className="product-detail-prev-next">

              {previousProduct ? (
                <Link
                  to={`/products/${previousProduct.slug}`}
                  className="product-nav-link"
                >
                  <ArrowLeft
                    size={13}
                    strokeWidth={1.2}
                  />

                  <span>
                    Previous
                  </span>
                </Link>
              ) : (
                <span className="product-nav-disabled">
                  <ArrowLeft
                    size={13}
                    strokeWidth={1.2}
                  />

                  <span>
                    Previous
                  </span>
                </span>
              )}

              <span className="product-nav-divider">
                |
              </span>

              {nextProduct ? (
                <Link
                  to={`/products/${nextProduct.slug}`}
                  className="product-nav-link"
                >
                  <span>
                    Next
                  </span>

                  <ArrowRight
                    size={13}
                    strokeWidth={1.2}
                  />
                </Link>
              ) : (
                <span className="product-nav-disabled">
                  <span>
                    Next
                  </span>

                  <ArrowRight
                    size={13}
                    strokeWidth={1.2}
                  />
                </span>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <div className="nova-container">
        <div className="product-detail-main">

          {/* LEFT - GALLERY */}

          <div className="product-detail-gallery">

            <div className="product-main-image">

              {galleryImages.length > 0
                ? renderImage(
                    galleryImages[
                      activeImage
                    ],
                    product.name
                  )
                : renderImage(
                    null,
                    product.name
                  )}

              <button
                type="button"
                className="product-image-zoom"
                aria-label="View larger image"
              >
                <Search
                  size={19}
                  strokeWidth={1.2}
                />
              </button>

            </div>

            {/* THUMBNAILS */}

            <div className="product-thumbnails">

              <button
                type="button"
                className="product-thumb-arrow"
                disabled
                aria-label="Previous image"
              >
                <ArrowLeft
                  size={16}
                  strokeWidth={1.2}
                />
              </button>

              {(
                galleryImages.length > 0
                  ? galleryImages
                  : [
                      null,
                      null,
                      null,
                      null,
                      null,
                    ]
              ).map(
                (image, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`product-thumbnail ${
                      activeImage === index
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setActiveImage(index)
                    }
                    aria-label={`View image ${
                      index + 1
                    }`}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt=""
                      />
                    ) : (
                      <ImageIcon
                        size={20}
                        strokeWidth={1}
                      />
                    )}
                  </button>
                )
              )}

              <button
                type="button"
                className="product-thumb-arrow"
                disabled
                aria-label="Next image"
              >
                <ArrowRight
                  size={16}
                  strokeWidth={1.2}
                />
              </button>

            </div>
          </div>

          {/* RIGHT - PRODUCT INFO */}

          <div className="product-detail-info">

            <div className="product-detail-info-header">

              <div>

                <span className="product-detail-collection">
                  {collection?.name} Collection
                </span>

                <h1>
                  {product.name}
                </h1>

                <div className="product-detail-subtitle">
                  {product.subtitle}
                </div>

              </div>

              <button
                type="button"
                className={`product-favourite ${
                  isFavourite
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setIsFavourite(
                    (value) => !value
                  )
                }
                aria-label="Add to favourites"
              >
                <Heart
                  size={28}
                  strokeWidth={1.1}
                  fill={
                    isFavourite
                      ? "currentColor"
                      : "none"
                  }
                />

                <span>
                  Add to
                  <br />
                  Favourites
                </span>
              </button>

            </div>

            <p className="product-detail-description">
              {product.description}
            </p>

            {/* =========================================
                SPECIFICATIONS
            ========================================== */}

            <div className="product-specifications">

              {product.specs &&
                Object.entries(product.specs).map(
                  ([label, value]) => (
                    <React.Fragment key={label}>

                      {/* Fixed Guarantee row before Thickness */}
                      {label
                        .toLowerCase()
                        .trim() === "thickness" && (
                        <div className="product-spec-row">

                          <span className="product-spec-label">
                            Guarantee
                          </span>

                          <span className="product-spec-value">
                            10 Years
                          </span>

                          <ChevronDown
                            className="product-spec-mobile-arrow"
                            size={15}
                            strokeWidth={1.2}
                          />

                        </div>
                      )}

                      <div className="product-spec-row">

                        <span className="product-spec-label">
                          {label}
                        </span>

                        <span className="product-spec-value">
                          {value}
                        </span>

                        <ChevronDown
                          className="product-spec-mobile-arrow"
                          size={15}
                          strokeWidth={1.2}
                        />

                      </div>

                    </React.Fragment>
                  )
                )}

            </div>

            {/* =========================================
                ACTIONS
            ========================================== */}

            <div className="product-detail-actions">

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="product-action-primary"
              >
                <MessageCircle
                  size={18}
                  strokeWidth={1.3}
                />

                <span>
                  Enquire on WhatsApp
                </span>

                <ArrowRight
                  size={17}
                  strokeWidth={1.3}
                />
              </a>

              <Link
                to="/contact"
                className="product-action-secondary"
              >
                <span>
                  Request a Sample
                </span>

                <ArrowRight
                  size={17}
                  strokeWidth={1.3}
                />
              </Link>

            </div>

            {/* =========================================
                BENEFITS
            ========================================== */}

            <div className="product-benefits">

              <div className="product-benefit">

                <Sparkles
                  size={26}
                  strokeWidth={1.1}
                />

                <span>
                  Premium
                  <br />
                  Quality
                </span>

              </div>

              <div className="product-benefit">

                <span className="product-benefit-icon">
                  ✦
                </span>

                <span>
                  Customisable
                  <br />
                  Finishes
                </span>

              </div>

              <div className="product-benefit">

                <span className="product-benefit-icon">
                  ◇
                </span>

                <span>
                  Suitable for
                  <br />
                  Multiple Spaces
                </span>

              </div>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
}

export default ProductDetail;