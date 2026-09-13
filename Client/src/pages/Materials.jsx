import {
  ArrowRight,
  ChevronDown,
  Layers,
  PanelsTopLeft,
  Shield,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import materials from "../data/materials";

function Materials() {
  const [openMaterial, setOpenMaterial] = useState(null);

  const finishOptions = [
    "Gloss",
    "Matte",
    "Satin",
    "Metallic",
    "Stone",
    "Wood",
    "Industrial",
  ];

  const applications = [
    "Residential",
    "Commercial",
    "Hospitality",
    "Retail",
    "Interior",
    "Exterior",
  ];

  const materialIcons = [
    Layers,
    Shield,
    PanelsTopLeft,
    Workflow,
    Sparkles,
    Layers,
  ];

  const toggleMaterial = (id) => {
    setOpenMaterial((current) =>
      current === id ? null : id
    );
  };

  return (
    <section className="materials-page">

      {/* =====================================
          HERO
      ====================================== */}

      <section className="materials-hero">

        <div className="nova-container">

          <div className="materials-hero-grid">

            <div className="materials-hero-copy">

              <span className="nova-eyebrow">
                Materials
              </span>

              <h1>
                Premium materials.
                <br />
                <span>Precise finishes.</span>
              </h1>

            </div>


            <div className="materials-hero-description">

              <p>
                Material is where design becomes tangible. We work
                across a range of surface solutions to help create
                spaces with character, continuity and a considered
                visual language.
              </p>

            </div>


            <div className="materials-hero-side-nav">
              <span>Material</span>
              <span>Finish</span>
              <span>Application</span>
              <span>Detail</span>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          MATERIAL CATEGORIES
      ====================================== */}

      <section className="materials-categories">

        <div className="nova-container">

          <div className="materials-section-heading">

            <div>
              <span className="nova-eyebrow">
                Material Categories
              </span>

              <h2>
                Choose the material
                <br />
                <span>that shapes the space.</span>
              </h2>
            </div>

            <p>
              Explore the material directions available through NOVA,
              each offering its own visual character and possibilities
              for your space.
            </p>

          </div>


          <div className="materials-grid">

            {materials.map((material, index) => {

              const Icon =
                materialIcons[index] || Layers;

              const isOpen =
                openMaterial === material.id;

              return (
                <article
                  className={`material-card ${
                    isOpen ? "is-open" : ""
                  }`}
                  key={material.id}
                >

                  <button
                    type="button"
                    className="material-card-top"
                    onClick={() =>
                      toggleMaterial(material.id)
                    }
                  >

                    <span className="material-card-number">
                      {material.number}
                    </span>

                    <span className="material-card-icon">
                      <Icon
                        size={30}
                        strokeWidth={1.1}
                      />
                    </span>

                    <ChevronDown
                      className="material-card-mobile-arrow"
                      size={16}
                      strokeWidth={1.2}
                    />

                  </button>


                  <div className="material-card-content">

                    <h3>
                      {material.name}
                    </h3>

                    <p>
                      {material.shortDescription}
                    </p>

                    <div className="material-card-points">
                      {material.characteristics.map(
                        (item) => (
                          <span key={item}>
                            {item}
                          </span>
                        )
                      )}
                    </div>

                  </div>

                </article>
              );
            })}

          </div>

        </div>

      </section>


      {/* =====================================
          FINISH CHARACTER
      ====================================== */}

      <section className="materials-finishes">

        <div className="nova-container">

          <div className="materials-finishes-grid">

            <div className="materials-finishes-heading">

              <span className="nova-eyebrow">
                Finish & Character
              </span>

              <h2>
                Surface language
                <br />
                <span>changes everything.</span>
              </h2>

            </div>


            <div className="materials-finishes-list">

              {finishOptions.map(
                (finish, index) => (
                  <div
                    className="materials-finish-row"
                    key={finish}
                  >

                    <span>
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <strong>
                      {finish}
                    </strong>

                    <ArrowRight
                      size={15}
                      strokeWidth={1.2}
                    />

                  </div>
                )
              )}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          APPLICATIONS
      ====================================== */}

      <section className="materials-applications">

        <div className="nova-container">

          <div className="materials-applications-header">

            <div>
              <span className="nova-eyebrow">
                Applications
              </span>

              <h2>
                Designed for
                <br />
                <span>different spaces.</span>
              </h2>
            </div>

            <p>
              Material selection should respond to the character
              and purpose of the space. Explore the environments
              where NOVA solutions can be considered.
            </p>

          </div>


          <div className="materials-application-grid">

            {applications.map(
              (application, index) => (
                <div
                  className="materials-application-card"
                  key={application}
                >

                  <span>
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <h3>
                    {application}
                  </h3>

                  <ArrowRight
                    size={17}
                    strokeWidth={1.2}
                  />

                </div>
              )
            )}

          </div>

        </div>

      </section>


      {/* =====================================
          WHY MATERIAL MATTERS
      ====================================== */}

      <section className="materials-values">

        <div className="nova-container">

          <div className="materials-values-heading">

            <span className="nova-eyebrow">
              Why Material Matters
            </span>

            <h2>
              The right surface
              <br />
              <span>sets the tone.</span>
            </h2>

          </div>


          <div className="materials-values-grid">

            <div className="materials-value">

              <div className="materials-value-icon">
                <Sparkles
                  size={27}
                  strokeWidth={1.1}
                />
              </div>

              <h3>
                Visual Character
              </h3>

              <p>
                Surfaces contribute directly to the mood,
                rhythm and identity of an interior.
              </p>

            </div>


            <div className="materials-value">

              <div className="materials-value-icon">
                <Shield
                  size={27}
                  strokeWidth={1.1}
                />
              </div>

              <h3>
                Thoughtful Selection
              </h3>

              <p>
                The material direction should suit the
                architectural character and intended space.
              </p>

            </div>


            <div className="materials-value">

              <div className="materials-value-icon">
                <Workflow
                  size={27}
                  strokeWidth={1.1}
                />
              </div>

              <h3>
                Complete Vision
              </h3>

              <p>
                Material, finish and application work together
                to create a more coherent overall experience.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          COLLECTION CTA
      ====================================== */}

      <section className="materials-cta">

        <div className="nova-container">

          <div className="materials-cta-inner">

            <div>

              <span>
                Explore the surfaces
              </span>

              <h2>
                Find your
                <br />
                <span>material direction.</span>
              </h2>

            </div>

            <Link
              to="/collections"
              className="nova-btn nova-btn-outline"
            >
              View Collections
              <ArrowRight
                size={16}
                strokeWidth={1.3}
              />
            </Link>

          </div>

        </div>

      </section>

    </section>
  );
}

export default Materials;