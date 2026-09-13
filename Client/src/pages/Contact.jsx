import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const WHATSAPP_NUMBER = "919041665532";

const whatsappMessage =
  "Hello NOVA Flooring Studio, I would like to enquire about your flooring and surface solutions.";

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  whatsappMessage
)}`;

const initialForm = {
  name: "",
  email: "",
  phone: "",
  projectType: "",
  location: "",
  subject: "",
  message: "",
};

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const scrollToInquiry = () => {
    requestAnimationFrame(() => {
      document.getElementById("inquiry-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (successMessage) {
      setSuccessMessage("");
    }

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/api/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          source: "Website",
        }),
      });

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "Inquiry service is not available. Please try WhatsApp instead."
        );
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to submit your inquiry. Please try again."
        );
      }

      setForm(initialForm);

      setSuccessMessage(
        "Thank you. Your inquiry has been received. Our team will get back to you shortly."
      );
    } catch (error) {
      console.error("Public inquiry submit error:", error);

      setErrorMessage(
        error.message ||
          "Unable to submit your inquiry. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="contact-page">
      {/* =========================================
          CONTACT HERO
      ========================================== */}
      <section className="contact-hero">
        <div className="contact-hero-overlay" />

        <div className="nova-container contact-hero-inner">
          <div className="contact-hero-copy">
            <span className="contact-eyebrow">
              Contact
              <i />
            </span>

            <h1>
              Let&apos;s
              <br />
              Create
              <br />
              <em>Together.</em>
            </h1>

            <p>
              Have a project in mind or want to know
              more about our surfaces? We&apos;d love to
              hear from you.
            </p>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="contact-whatsapp-button"
            >
              <MessageCircle
                size={22}
                strokeWidth={1.35}
              />

              <span>Enquire on WhatsApp</span>

              <ArrowRight
                size={17}
                strokeWidth={1.3}
              />
            </a>
          </div>

          <div className="contact-hero-divider" />

          <div className="contact-details">
            <a
              href="tel:+919041665532"
              className="contact-detail"
            >
              <span className="contact-detail-icon">
                <Phone
                  size={22}
                  strokeWidth={1.25}
                />
              </span>

              <span className="contact-detail-copy">
                <small>Phone</small>

                <strong>
                  +91 90416 65532
                  <br />
                  +91 70092 90971
                </strong>
              </span>
            </a>

            <a
              href="novaflooringstudio@gmail.com"
              className="contact-detail"
            >
              <span className="contact-detail-icon">
                <Mail
                  size={22}
                  strokeWidth={1.25}
                />
              </span>

              <span className="contact-detail-copy">
                <small>Email</small>

                <strong>
                  novaflooringstudio@gmail.com
                </strong>
              </span>
            </a>

            <a
              href="https://www.google.com/maps/search/?api=1&query=SCO%20123%2C%20Interior%20Market%2C%20Amritsar%2C%20Punjab%20143001"
              target="_blank"
              rel="noreferrer"
              className="contact-detail"
            >
              <span className="contact-detail-icon">
                <MapPin
                  size={22}
                  strokeWidth={1.25}
                />
              </span>

              <span className="contact-detail-copy">
                <small>Studio</small>

                <strong>
                  140 Preet Vihar Near GNDU
                  <br />
                  Amritsar, Punjab 143001
                </strong>
              </span>
            </a>

            <div className="contact-detail">
              <span className="contact-detail-icon">
                <Clock3
                  size={22}
                  strokeWidth={1.25}
                />
              </span>

              <span className="contact-detail-copy">
                <small>Business Hours</small>

                <strong>
                  Mon – Sat 10:00 AM – 7:00 PM
                  <br />
                  Sunday (By Appointment)
                </strong>
              </span>
            </div>
          </div>

          <div className="contact-hero-side-copy">
            <span>Premium</span>
            <span>Surfaces.</span>
            <span>Timeless</span>
            <span>Spaces.</span>

            <i />
          </div>
        </div>
      </section>

      {/* =========================================
          INQUIRY FORM
      ========================================== */}
      <section
        className="contact-inquiry-section"
        id="inquiry-form"
      >
        <div className="nova-container">
          <div className="contact-section-heading">
            <div>
              <span className="contact-eyebrow">
                Start a conversation
                <i />
              </span>

              <h2>
                Tell us about
                <br />
                <em>your space.</em>
              </h2>
            </div>

            <p>
              Share a few details about your project
              and our team will get in touch with you
              to discuss the right surface solution.
            </p>
          </div>

          <div className="contact-inquiry-layout">
            <div className="contact-inquiry-intro">
              <span className="contact-inquiry-number">
                01
              </span>

              <h3>
                A thoughtful
                <br />
                conversation
                <br />
                starts here.
              </h3>

              <p>
                Whether you are planning a residence,
                hospitality space, workplace or retail
                project, tell us what you have in mind.
              </p>

              <div className="contact-inquiry-note">
                <span />

                <p>
                  Prefer a faster response?
                  <br />
                  Start a WhatsApp conversation
                  with our studio team.
                </p>
              </div>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="contact-secondary-link"
              >
                <span>Open WhatsApp</span>

                <ArrowRight
                  size={15}
                  strokeWidth={1.25}
                />
              </a>
            </div>

            <form
              className="contact-inquiry-form"
              onSubmit={handleSubmit}
            >
              <div className="contact-form-grid">
                <div className="contact-field">
                  <label htmlFor="name">
                    Your Name <span>*</span>
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="email">
                    Email Address <span>*</span>
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="phone">
                    Phone Number <span>*</span>
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91"
                    required
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="projectType">
                    Project Type
                  </label>

                  <select
                    id="projectType"
                    name="projectType"
                    value={form.projectType}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select project type
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

                    <option value="Office">
                      Office
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div className="contact-field">
                  <label htmlFor="location">
                    Project Location
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="City / Location"
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="subject">
                    Subject
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What can we help with?"
                  />
                </div>
              </div>

              <div className="contact-field contact-field--message">
                <label htmlFor="message">
                  Tell us about your project{" "}
                  <span>*</span>
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your space, approximate size, flooring requirements, preferred timeline or anything else you would like us to know."
                  rows={7}
                  required
                />
              </div>

              {successMessage && (
                <div
                  className="contact-form-message contact-form-message--success"
                  role="status"
                >
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div
                  className="contact-form-message contact-form-message--error"
                  role="alert"
                >
                  {errorMessage}
                </div>
              )}

              <div className="contact-form-footer">
                <p>
                  By submitting this form, you agree
                  to be contacted by NOVA Flooring Studio
                  regarding your enquiry.
                </p>

                <button
                  type="submit"
                  className="contact-submit-button"
                  disabled={submitting}
                >
                  <span>
                    {submitting
                      ? "Sending..."
                      : "Send Inquiry"}
                  </span>

                  <ArrowRight
                    size={17}
                    strokeWidth={1.25}
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* =========================================
          EXPLORE FURTHER
      ========================================== */}
      <section className="contact-explore">
        <div className="nova-container contact-explore-inner">
          <div className="contact-explore-copy">
            <span>Explore Further</span>

            <h2>
              Discover
              <br />
              Our Collections.
            </h2>
          </div>

          <Link
            to="/collections"
            className="contact-outline-button"
          >
            <span>View Collections</span>

            <ArrowRight
              size={17}
              strokeWidth={1.25}
            />
          </Link>
        </div>
      </section>

      {/* =========================================
          FOOTER
      ========================================== */}
      <footer className="nova-footer">
        <div className="nova-container nova-footer-main">
          <div className="nova-footer-brand">
            <Link
              to="/"
              className="nova-footer-logo-lockup"
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
              Premium surfaces. Timeless spaces.
            </p>
          </div>

          <div className="nova-footer-column">
            <h3>Quick Links</h3>

            <Link to="/">Home</Link>

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

            <Link to="/contact">
              Contact
            </Link>
          </div>

          <div className="nova-footer-column">
            <h3>Our Solutions</h3>

            <Link to="/materials">
              Metallic Flooring
            </Link>

            <Link to="/materials">
              Epoxy Flooring
            </Link>

            <Link to="/materials">
              Italian Flooring
            </Link>

            <Link to="/materials">
              3-D Industrial Flooring
            </Link>

            <Link to="/materials">
              Simple Flooring
            </Link>

            <Link to="/materials">
              Wooden Flooring
            </Link>

            <Link to="/materials">
              PEV Flooring
            </Link>

            <Link to="/materials">
              PU Waterproofing
            </Link>

            <Link to="/materials">
              PVC Pipe
            </Link>

            <Link to="/materials">
              PVC Parametric
            </Link>

            <Link to="/materials">
              Aluminum Exterior & Curtains
            </Link>

            <Link to="/materials">
              Wallpapers
            </Link>
          </div>

          <div className="nova-footer-column">
            <h3>Follow Us</h3>

            <div className="nova-footer-socials nova-footer-socials--text">
              <a href="#" aria-label="Instagram">
                Instagram
              </a>

              <a href="#" aria-label="Facebook">
                Facebook
              </a>

              <a href="#" aria-label="LinkedIn">
                LinkedIn
              </a>

              <a href="#" aria-label="Pinterest">
                Pinterest
              </a>
            </div>
          </div>
        </div>

        <div className="nova-footer-bottom">
          <span>
            © 2024 NOVA Flooring Studio.
            All rights reserved.
          </span>

          <span>
            Crafting spaces for a better tomorrow.
          </span>
        </div>
      </footer>
    </main>
  );
};

export default Contact;