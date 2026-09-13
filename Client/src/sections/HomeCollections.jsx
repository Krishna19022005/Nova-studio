import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import collections from "../data/collections";

function HomeCollections() {
  return (
    <section className="home-collections">

      <div className="nova-container">

        {/* SECTION HEADER */}
        <div className="home-collections-header">

          <div className="home-collections-heading">

            <span className="nova-eyebrow">
              Our Collections
            </span>

            <h2>
              Surfaces with{" "}
              <span>character.</span>
            </h2>

          </div>

          <p className="home-collections-intro">
            A curated range of epoxy flooring surfaces
            designed to bring depth, elegance and
            individuality to every space.
          </p>

        </div>


        {/* COLLECTION CARDS */}
        <div className="home-collections-grid">

          {collections.map((collection) => (

            <article
              className="home-collection-card"
              key={collection.id}
            >

              {/* IMAGE */}
              <div className="home-collection-image">

                <img
                  src={collection.image}
                  alt={`${collection.name} epoxy flooring`}
                />

                <span className="home-collection-number">
                  {collection.number}
                </span>

              </div>


              {/* CONTENT */}
              <div className="home-collection-content">

                <h3>
                  {collection.name}
                </h3>

                <p>
                  {collection.tagline}
                </p>

                <Link
                  to={`/collections/${collection.slug}`}
                  className="home-collection-link"
                >
                  <span>View Collection</span>

                  <ArrowRight
                    size={17}
                    strokeWidth={1.3}
                  />
                </Link>

              </div>

            </article>

          ))}

        </div>


        {/* VIEW ALL COLLECTIONS */}
        <div className="home-section-action">

          <Link
            to="/collections"
            className="nova-btn nova-btn-outline"
          >
            <span>View All Collections</span>

            <ArrowRight
              size={16}
              strokeWidth={1.4}
            />
          </Link>

        </div>

      </div>

    </section>
  );
}

export default HomeCollections;