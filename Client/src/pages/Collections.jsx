import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import useCollections from "../hooks/useCollections";
import collectionBg from "../assets/collectionBg.png";

function Collections() {
    const {
    collections,
    loading,
    error,
  } = useCollections();
  return (
    <section
      className="collections-page"
      style={{ "--collections-bg": `url(${collectionBg})` }}
    >
      <div className="collections-page-overlay" />

      <div className="nova-container collections-page-inner">

        {/* HERO CONTENT */}
        <div className="collections-page-top">

          <div className="collections-page-heading">

            <span className="nova-eyebrow">
              Our Collections
            </span>

            <h1>
              Surfaces with{" "}
              <span>character.</span>
            </h1>

            <p>
              A curated range of epoxy flooring surfaces designed to bring
              depth, elegance and individuality to every space. From timeless
              classics to bold contemporary finishes, discover a collection
              that reflects your vision.
            </p>

          </div>


          {/* SIDE NAV */}
          <div className="collections-page-side-nav">

            <span>Spaces</span>
            <span>People</span>
            <span>Stories</span>
            <span>Surfaces</span>

          </div>

        </div>


        {/* COLLECTION CARDS */}
        <div className="collections-page-grid">

          {collections.map((collection) => (

            <article
              className="collections-page-card"
              key={collection.id}
            >

              <Link
                to={`/collections/${collection.slug}`}
                className="collections-page-card-image"
              >

                <img
                  src={collection.image}
                  alt={`${collection.name} epoxy flooring`}
                />

                <span className="collections-page-card-number">
                  {collection.number}
                </span>

              </Link>


              <div className="collections-page-card-content">

                <h2>
                  {collection.name}
                </h2>

                <p>
                  {collection.tagline}
                </p>

                <Link
                  to={`/collections/${collection.slug}`}
                  className="collections-page-card-button"
                >
                  <span>View Collection</span>

                  <ArrowRight
                    size={16}
                    strokeWidth={1.3}
                  />
                </Link>

              </div>

            </article>

          ))}

        </div>


        {/* BOTTOM STATEMENT */}
        <div className="collections-page-bottom">

          <div className="collections-page-quote">

            <span className="collections-page-quote-mark">
              “
            </span>

            <div>
              <em>More than flooring,</em>
              <strong>A material experience.</strong>
            </div>

          </div>


          <div className="collections-page-brand">
            <span />
            <p>NOVA Flooring Studio</p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Collections;