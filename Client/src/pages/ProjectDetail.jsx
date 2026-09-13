import {
  ArrowLeft,
  ArrowRight,
  Image as ImageIcon,
  MapPin,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

import { useMemo, useState } from "react";

import useProjects from "../hooks/useProjects";


function ProjectDetail() {
  const { slug } = useParams();

  const {
    projects,
    loading,
  } = useProjects();

  const [activeImage, setActiveImage] =
    useState(0);


  const project = projects.find(
    (item) => item.slug === slug
  );


  const currentIndex = projects.findIndex(
    (item) => item.slug === slug
  );


  const previousProject =
    currentIndex > 0
      ? projects[currentIndex - 1]
      : null;


  const nextProject =
    currentIndex >= 0 &&
    currentIndex < projects.length - 1
      ? projects[currentIndex + 1]
      : null;


  const projectType = useMemo(() => {
    if (!project) return "";

    return (
      project.projectType ||
      project.category ||
      ""
    );
  }, [project]);


  /*
   * =========================================
   * PROJECT IMAGES
   * =========================================
   */

  const galleryImages = useMemo(() => {
    if (!project) return [];

    const images = [];

    if (project.image) {
      images.push(project.image);
    }

    if (Array.isArray(project.gallery)) {
      project.gallery.forEach((image) => {
        if (
          image &&
          image !== project.image &&
          !images.includes(image)
        ) {
          images.push(image);
        }
      });
    }

    return images;
  }, [project]);


  /*
   * =========================================
   * LOADING
   * =========================================
   */

  if (loading) {
    return (
      <section className="project-detail-not-found">
        <div className="nova-container">

          <span className="nova-eyebrow">
            Project
          </span>

          <h1>
            Loading project...
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

  if (!project) {
    return (
      <section className="project-detail-not-found">
        <div className="nova-container">

          <span className="nova-eyebrow">
            Project
          </span>

          <h1>
            Project not found.
          </h1>

          <Link
            to="/projects"
            className="nova-btn nova-btn-outline"
          >
            Back to Projects

            <ArrowLeft
              size={16}
              strokeWidth={1.3}
            />
          </Link>

        </div>
      </section>
    );
  }


  return (
    <section className="project-detail">

      {/* =====================================
          BREADCRUMB + PREVIOUS / NEXT
      ====================================== */}

      <div className="project-detail-top">
        <div className="nova-container">

          <div className="project-detail-top-row">

            <div className="project-detail-breadcrumb">

              <Link to="/">
                Home
              </Link>

              <span>›</span>

              <Link to="/projects">
                Projects
              </Link>

              <span>›</span>

              <strong>
                {project.name}
              </strong>

            </div>


            <div className="project-detail-navigation">

              {previousProject ? (
                <Link
                  to={`/projects/${previousProject.slug}`}
                  className="project-detail-nav-link"
                >
                  <ArrowLeft
                    size={14}
                    strokeWidth={1.2}
                  />

                  Previous
                </Link>
              ) : (
                <span className="project-detail-nav-disabled">

                  <ArrowLeft
                    size={14}
                    strokeWidth={1.2}
                  />

                  Previous

                </span>
              )}


              <span className="project-detail-nav-divider">
                |
              </span>


              {nextProject ? (
                <Link
                  to={`/projects/${nextProject.slug}`}
                  className="project-detail-nav-link"
                >
                  Next

                  <ArrowRight
                    size={14}
                    strokeWidth={1.2}
                  />
                </Link>
              ) : (
                <span className="project-detail-nav-disabled">

                  Next

                  <ArrowRight
                    size={14}
                    strokeWidth={1.2}
                  />

                </span>
              )}

            </div>

          </div>

        </div>
      </div>


      {/* =====================================
          PROJECT HERO
      ====================================== */}

      <section className="project-detail-hero">

        <div className="nova-container">

          <div className="project-detail-hero-grid">

            <div className="project-detail-copy">

              <span className="project-detail-category">
                {projectType}
              </span>

              <h1>
                {project.name}
              </h1>

              <p className="project-detail-lead">
                {project.description}
              </p>

              <div className="project-detail-location">

                <MapPin
                  size={16}
                  strokeWidth={1.2}
                />

                <span>
                  {project.location ||
                    `${project.category} Project`}
                </span>

              </div>

            </div>


            <div className="project-detail-side-note">

              <span>
                Spaces
              </span>

              <span>
                People
              </span>

              <span>
                Stories
              </span>

              <span>
                Surfaces
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          PROJECT IMAGE GALLERY
      ====================================== */}

      <section className="project-detail-feature">

        <div className="nova-container">

          <div className="project-detail-gallery">

            <div className="project-detail-main-image">

              {galleryImages.length > 0 ? (

                <img
                  src={
                    galleryImages[
                      activeImage
                    ]
                  }
                  alt={`${project.name} ${
                    activeImage + 1
                  }`}
                />

              ) : (

                <div className="project-detail-placeholder">

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

                </div>

              )}

            </div>


            {galleryImages.length > 1 && (

              <div className="project-detail-thumbnails">

                {galleryImages.map(
                  (image, index) => (

                    <button
                      type="button"
                      key={image}
                      className={`project-detail-thumbnail ${
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

                      <img
                        src={image}
                        alt=""
                      />

                    </button>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      </section>


      {/* =====================================
          PROJECT STORY
      ====================================== */}

      <section className="project-detail-story">

        <div className="nova-container">

          <div className="project-detail-story-grid">

            <div className="project-detail-story-heading">

              <span className="nova-eyebrow">
                The Project
              </span>

              <h2>
                Surfaces that become
                <br />
                part of the space.
              </h2>

            </div>


            <div className="project-detail-story-copy">

              {project.story &&
              project.story.length > 0 ? (

                project.story.map(
                  (paragraph, index) => (
                    <p key={index}>
                      {paragraph}
                    </p>
                  )
                )

              ) : (

                <>
                  <p>
                    This project brings together
                    architecture, material and
                    atmosphere through a carefully
                    considered surface finish.
                  </p>

                  <p>
                    Every detail has been selected
                    to complement the character of
                    the space while creating a
                    refined and lasting visual
                    experience.
                  </p>
                </>

              )}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          PROJECT DETAILS
      ====================================== */}

      <section className="project-detail-specs">

        <div className="nova-container">

          <div className="project-detail-spec-grid">

            <div className="project-detail-spec">

              <span>
                Project Type
              </span>

              <strong>
                {project.projectType ||
                  project.category}
              </strong>

            </div>


            <div className="project-detail-spec">

              <span>
                Surface
              </span>

              <strong>
                {project.surface ||
                  "Premium Epoxy"}
              </strong>

            </div>


            <div className="project-detail-spec">

              <span>
                Project
              </span>

              <strong>
                {project.name}
              </strong>

            </div>


            <div className="project-detail-spec">

              <span>
                Studio
              </span>

              <strong>
                {project.studio ||
                  "NOVA Flooring Studio"}
              </strong>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          CLOSING STATEMENT
      ====================================== */}

      <section className="project-detail-closing">

        <div className="nova-container">

          <div className="project-detail-closing-inner">

            <div>

              <span>
                Every space has a story.
              </span>

              <h2>
                Designed to be remembered.
              </h2>

            </div>


            <Link
              to="/projects"
              className="nova-btn nova-btn-outline"
            >
              Explore All Projects

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

export default ProjectDetail;