import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Image as ImageIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

import useProjects from "../hooks/useProjects";
import collectionBg from "../assets/collectionBg.png";

const PROJECTS_PER_PAGE = 6;

function Projects() {
  const {
    projects,
    loading,
  } = useProjects();
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    "All",
    "Residential",
    "Commercial",
    "Hospitality",
    "Retail",
  ];

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (activeCategory !== "All") {
      result = result.filter(
        (project) => project.category === activeCategory
      );
    }

    if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortBy === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
 }, [projects, activeCategory, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const visibleProjects = filteredProjects.slice(
    (safeCurrentPage - 1) * PROJECTS_PER_PAGE,
    safeCurrentPage * PROJECTS_PER_PAGE
  );

  const changeCategory = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const changeSort = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <section
      className="projects-page"
      style={{ "--projects-bg": `url(${collectionBg})` }}
    >
      {/* =====================================
          INTRO
      ====================================== */}

      <div className="nova-container">

        <div className="projects-page-header">

          <div className="projects-page-heading">
            <span className="nova-eyebrow">
              Our Projects
            </span>

            <h1>
              Spaces that{" "}
              <span>inspire.</span>
            </h1>
          </div>

          <div className="projects-page-intro">
            <p>
              From private residences to commercial landmarks, our surfaces
              become part of extraordinary spaces. Each project reflects our
              commitment to craftsmanship, innovation and timeless design.
            </p>
          </div>

          <div className="projects-page-side-nav">
            <span>Spaces</span>
            <span>People</span>
            <span>Stories</span>
            <span>Surfaces</span>
          </div>

        </div>


        {/* =====================================
            FILTERS
        ====================================== */}

        <div className="projects-filter-section">

          {/* DESKTOP CATEGORY FILTER */}
          <div className="projects-category-filter">

            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`projects-category-button ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => changeCategory(category)}
              >
                {category}
              </button>
            ))}

          </div>


          {/* MOBILE CATEGORY FILTER */}
          <label className="projects-mobile-filter">

            <span className="sr-only">
              Project category
            </span>

            <select
              value={activeCategory}
              onChange={(event) =>
                changeCategory(event.target.value)
              }
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "All"
                    ? "All Projects"
                    : category}
                </option>
              ))}
            </select>

            <ChevronDown
              size={15}
              strokeWidth={1.3}
            />

          </label>


          {/* SORT */}
          <div className="projects-sort">

            <span>
              Sort By
            </span>

            <label className="projects-sort-control">

              <span className="sr-only">
                Sort projects
              </span>

              <select
                value={sortBy}
                onChange={(event) =>
                  changeSort(event.target.value)
                }
              >
                <option value="latest">
                  Latest
                </option>

                <option value="name-asc">
                  Name A–Z
                </option>

                <option value="name-desc">
                  Name Z–A
                </option>
              </select>

              <ChevronDown
                size={14}
                strokeWidth={1.3}
              />

            </label>

          </div>

        </div>


        {/* =====================================
            PROJECT GRID
        ====================================== */}

        <div className="projects-page-grid">

          {visibleProjects.map((project) => (

            <article
              className="projects-page-card"
              key={project.id}
            >

              <Link
                to={`/projects/${project.slug}`}
                className="projects-page-card-image"
              >

                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.name}
                  />
                ) : (
                  <div className="projects-page-placeholder">

                    <ImageIcon
                      size={30}
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

                <span className="projects-page-card-arrow">
                  <ArrowRight
                    size={19}
                    strokeWidth={1.25}
                  />
                </span>

              </Link>


              <Link
                to={`/projects/${project.slug}`}
                className="projects-page-card-content"
              >

                <div>
                  <span className="projects-page-card-category">
                    {project.category}
                  </span>

                  <h2>
                    {project.name}
                  </h2>
                </div>

                <ArrowRight
                  size={20}
                  strokeWidth={1.25}
                  className="projects-page-content-arrow"
                />

              </Link>

            </article>

          ))}

        </div>


        {/* EMPTY STATE */}
        {visibleProjects.length === 0 && (
          <div className="projects-page-empty">
            <span>
              No projects found.
            </span>

            <button
              type="button"
              onClick={() => changeCategory("All")}
            >
              View All Projects
            </button>
          </div>
        )}


        {/* =====================================
            PAGINATION
        ====================================== */}

        {filteredProjects.length > 0 && (
          <div className="projects-pagination">

            <button
              type="button"
              className="projects-pagination-arrow"
              onClick={() => goToPage(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              aria-label="Previous page"
            >
              <ArrowLeft
                size={15}
                strokeWidth={1.25}
              />
            </button>


            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                type="button"
                className={`projects-pagination-number ${
                  safeCurrentPage === page ? "active" : ""
                }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}


            <button
              type="button"
              className="projects-pagination-arrow"
              onClick={() => goToPage(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              aria-label="Next page"
            >
              <ArrowRight
                size={15}
                strokeWidth={1.25}
              />
            </button>

          </div>
        )}

      </div>


      {/* =====================================
          BOTTOM CTA
      ====================================== */}

      <section className="projects-page-cta">

        <div className="projects-page-cta-overlay" />

        <div className="nova-container projects-page-cta-inner">

          <div className="projects-page-cta-copy">

            <span>
              Every space has a story.
            </span>

            <h2>
              Let&apos;s create yours.
            </h2>

          </div>

          <a
            href="/contact"
            className="nova-btn nova-btn-primary"
          >
            <span>
              Enquire on WhatsApp
            </span>

            <ArrowRight
              size={16}
              strokeWidth={1.3}
            />
          </a>

        </div>

      </section>

    </section>
  );
}

export default Projects;