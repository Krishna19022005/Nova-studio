import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="nova-footer">
      <div className="nova-container">

        <div className="nova-footer-main">

          <div className="nova-footer-brand">

            <Link
              to="/"
              className="nova-footer-logo-lockup"
              aria-label="NOVA Flooring Studio"
            >
              <span className="nova-logo-mark">
                NS
              </span>

              <span className="nova-logo-copy">
                <strong>NOVA</strong>
                <small>FLOORING STUDIO</small>
              </span>
            </Link>

            <p>
              Surfaces that define space.
            </p>

          </div>

          <div className="nova-footer-links">

            <div>
              <span className="nova-footer-heading">
                Explore
              </span>

              <Link to="/collections">
                Collections
              </Link>

              <Link to="/projects">
                Projects
              </Link>

              <Link to="/about">
                About
              </Link>

              <Link to="/materials">
                Materials
              </Link>
            </div>

            <div>
              <span className="nova-footer-heading">
                Connect
              </span>

              <Link to="/contact">
                Contact
              </Link>

              <a href="#">
                Instagram
              </a>

              <a href="#">
                Pinterest
              </a>
            </div>

          </div>
        </div>

        <div className="nova-footer-bottom">

          <span>
            © {new Date().getFullYear()} NOVA Flooring Studio
          </span>

          <span>
            Crafted for distinctive spaces.
          </span>

        </div>

      </div>
    </footer>
  );
}

export default Footer;