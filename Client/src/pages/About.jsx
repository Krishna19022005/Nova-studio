import {
  ArrowRight,
  ChevronDown,
  Diamond,
  Goal,
  MessageCircle,
  Sparkles,
  Star,
  Target,
  Layers,
  Droplets,
  Columns3,
  Box,
  PanelsTopLeft,
  ShieldCheck,
  CirclePlus,
  Hexagon,
  Building2,
  SquareStack,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import services from "../data/services";

function About() {
  const [openPillar, setOpenPillar] = useState(null);
  const [openService, setOpenService] = useState(null);

  const pillars = [
    {
      id: "vision",
      title: "Our Vision",
      icon: Diamond,
      text: "To be a trusted name in surface solutions, known for quality, creativity and customer satisfaction.",
    },
    {
      id: "mission",
      title: "Our Mission",
      icon: Goal,
      text: "To deliver innovative, durable and aesthetic solutions that enhance every space.",
    },
    {
      id: "values",
      title: "Our Values",
      icon: Sparkles,
      text: "Integrity, craftsmanship, customer focus and a constant drive to do better.",
    },
    {
      id: "approach",
      title: "Our Approach",
      icon: Star,
      text: "A collaborative process from concept to completion, ensuring every detail is taken care of.",
    },
  ];

  const serviceIcons = [
    Layers,
    Droplets,
    Columns3,
    Box,
    PanelsTopLeft,
    SquareStack,
    Layers,
    ShieldCheck,
    CirclePlus,
    Hexagon,
    Building2,
    PanelsTopLeft,
  ];

  const togglePillar = (id) => {
    setOpenPillar((current) =>
      current === id ? null : id
    );
  };

  const toggleService = (id) => {
    setOpenService((current) =>
      current === id ? null : id
    );
  };

  return (
    <section className="about-page">

      {/* =====================================
          INTRO
      ====================================== */}

      <section className="about-intro">

        <div className="nova-container">

          <div className="about-intro-grid">

            <div className="about-intro-heading">

              <span className="nova-eyebrow">
                About NOVA
              </span>

              <h1>
                Crafting
                <br />
                Spaces for a
                <br />
                <span>Better Tomorrow.</span>
              </h1>

            </div>


            <div className="about-intro-copy">

              <div className="about-intro-copy-line" />

              <div>

                <p>
                  At NOVA Flooring Studio, we believe that every
                  surface has the power to transform a space. What
                  began as a passion for exceptional flooring has
                  grown into a multidisciplinary studio offering
                  premium surface solutions for modern interiors
                  and exteriors.
                </p>

                <p>
                  Driven by quality, innovation and timeless
                  design, we work with homeowners, architects and
                  businesses to create spaces that inspire and
                  endure.
                </p>

              </div>

            </div>


            <div className="about-intro-side-nav">

              <span>People</span>
              <span>Quality</span>
              <span>Innovation</span>
              <span>Spaces</span>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          FOUR PILLARS
      ====================================== */}

      <section className="about-pillars">

        <div className="nova-container">

          <div className="about-pillars-grid">

            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              const isOpen = openPillar === pillar.id;

              return (
                <article
                  className={`about-pillar ${
                    isOpen ? "is-open" : ""
                  }`}
                  key={pillar.id}
                >

                  <button
                    type="button"
                    className="about-pillar-trigger"
                    onClick={() => togglePillar(pillar.id)}
                  >

                    <span className="about-pillar-icon">
                      <Icon
                        size={34}
                        strokeWidth={1.1}
                      />
                    </span>

                    <span className="about-pillar-title">
                      {pillar.title}
                    </span>

                    <ChevronDown
                      className="about-pillar-mobile-arrow"
                      size={16}
                      strokeWidth={1.2}
                    />

                  </button>


                  <p>
                    {pillar.text}
                  </p>

                </article>
              );
            })}

          </div>

        </div>

      </section>


      {/* =====================================
          BEYOND FLOORING
      ====================================== */}

      <section className="about-expertise">

        <div className="nova-container">

          <div className="about-expertise-header">

            <div>
              <span className="nova-eyebrow">
                Beyond Flooring
              </span>

              <h2>
                Our expertise also includes
              </h2>
            </div>

            <p>
              While flooring is at the heart of what we do,
              we also offer a range of complementary solutions
              to complete your space.
            </p>

          </div>


          {/* DESKTOP / TABLET SERVICES */}

          <div className="about-services-grid">

            {services.map((service, index) => {

              const Icon =
                serviceIcons[index] || Layers;

              return (
                <article
                  className="about-service-card"
                  key={service.id}
                >

                  <Icon
                    size={30}
                    strokeWidth={1.1}
                  />

                  <h3>
                    {service.name}
                  </h3>

                </article>
              );
            })}


            <div className="about-services-statement">

              <em>
                More than products.
              </em>

              <strong>
                Complete spaces.
              </strong>

            </div>

          </div>


          {/* MOBILE SERVICES */}

          <div className="about-services-mobile">

            {services.slice(0, 3).map((service, index) => {

              const Icon =
                serviceIcons[index] || Layers;

              const isOpen =
                openService === service.id;

              return (
                <article
                  className={`about-service-mobile ${
                    isOpen ? "is-open" : ""
                  }`}
                  key={service.id}
                >

                  <button
                    type="button"
                    onClick={() =>
                      toggleService(service.id)
                    }
                  >

                    <span className="about-service-mobile-left">

                      <Icon
                        size={21}
                        strokeWidth={1.1}
                      />

                      <span>
                        {service.name}
                      </span>

                    </span>

                    <ChevronDown
                      size={15}
                      strokeWidth={1.2}
                    />

                  </button>

                </article>
              );
            })}


            {services.length > 3 && (
              <button
                type="button"
                className="about-services-more"
                onClick={() =>
                  setOpenService(
                    openService === "all"
                      ? null
                      : "all"
                  )
                }
              >

                <span>
                  {openService === "all"
                    ? "Show Less"
                    : `${services.length - 3} More Solutions`}
                </span>

                <ChevronDown
                  size={15}
                  strokeWidth={1.2}
                />

              </button>
            )}

            {openService === "all" && (
              <div className="about-services-more-list">

                {services.slice(3).map(
                  (service, index) => {

                    const Icon =
                      serviceIcons[index + 3] || Layers;

                    return (
                      <div
                        className="about-service-mobile"
                        key={service.id}
                      >

                        <button type="button">

                          <span className="about-service-mobile-left">

                            <Icon
                              size={21}
                              strokeWidth={1.1}
                            />

                            <span>
                              {service.name}
                            </span>

                          </span>

                          <ChevronDown
                            size={15}
                            strokeWidth={1.2}
                          />

                        </button>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>


          <div className="about-expertise-bottom">

            <div>
              <em>
                More than products.
              </em>

              <strong>
                Complete spaces.
              </strong>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          GET IN TOUCH
      ====================================== */}

      <section className="about-contact-strip">

        <div className="nova-container">

          <div className="about-contact-inner">

            <div className="about-contact-copy">

              <span>
                Let&apos;s build spaces together
              </span>

              <h2>
                Get in touch
              </h2>

            </div>


            <Link
              to="/contact"
              className="nova-btn nova-btn-primary"
            >
              <MessageCircle
                size={18}
                strokeWidth={1.3}
              />

              <span>
                Enquire on WhatsApp
              </span>

              <ArrowRight
                size={16}
                strokeWidth={1.3}
              />
            </Link>


            <div className="about-contact-note">
              <span>Discuss</span>
              <span>your next</span>
              <span>project.</span>
            </div>

          </div>

        </div>

      </section>


    </section>
  );
}

export default About;