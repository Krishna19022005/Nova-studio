import {
  ArrowDown,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import bgLanding from "../assets/hero/bgLanding.png";
import bgLmobile from "../assets/hero/bgLmobile.png";

function HomeHero() {
  return (
    <section className="home-hero">

      {/* Background */}
      <picture className="home-hero-background">
        <source
          media="(max-width: 1199px)"
          srcSet={bgLmobile}
        />

        <img
          src={bgLanding}
          alt=""
          aria-hidden="true"
        />
      </picture>

      {/* Readability overlay */}
      <div className="home-hero-overlay" />

      <div className="home-hero-content nova-container">

        {/* Side navigation */}
        <div className="home-hero-side-nav">
          <span>Spaces</span>
          <span>People</span>
          <span>Stories</span>
          <span>Surfaces</span>
        </div>

        {/* Main copy */}
        <div className="home-hero-copy">

          <span className="home-hero-eyebrow">
            Luxury surfaces

            <span className="home-hero-eyebrow-line" />

            Timeless spaces
          </span>

          <h1 className="home-hero-title">
            SURFACES
            <br />
            THAT DEFINE
            <br />
            <span>SPACE.</span>
          </h1>

          <p className="home-hero-description">
            Luxury epoxy flooring crafted for
            extraordinary interiors.
          </p>

          <div className="home-hero-actions">

            <Link
              to="/collections"
              className="nova-btn nova-btn-primary"
            >
              Explore Collection

              <ArrowRight
                size={16}
                strokeWidth={1.4}
              />
            </Link>

            <Link
              to="/contact"
              className="nova-btn nova-btn-outline"
            >
              <MessageCircle
                size={17}
                strokeWidth={1.4}
              />

              Enquire on WhatsApp
            </Link>

          </div>
        </div>

        {/* Bottom information */}
        <div className="home-hero-footer">

          <div className="home-hero-counter">
            <strong>01</strong>
            <span>/ 04</span>
          </div>

          <div className="home-hero-scroll">
            <span>Scroll</span>

            <ArrowDown
              size={18}
              strokeWidth={1.2}
            />
          </div>

          <div className="home-hero-message">
            <span>Crafted</span>
            <span>for a more</span>
            <span>beautiful tomorrow.</span>
          </div>

        </div>

      </div>
    </section>
  );
}

export default HomeHero;