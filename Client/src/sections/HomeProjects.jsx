import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import projects from "../data/projects";

function HomeProjects() {
  return (
    <section className="home-projects">

      <div className="nova-container">

        {/* HEADER */}
        <div className="home-projects-header">

          <div>
            <span className="nova-eyebrow">
              Our Projects
            </span>

            <h2>
              Spaces that{" "}
              <span>inspire.</span>
            </h2>
          </div>

          <div className="home-projects-intro">

            <p>
              From private residences to commercial
              landmarks, our surfaces become part of
              extraordinary spaces.
            </p>

            <Link
              to="/projects"
              className="home-projects-view-all"
            >
              View All Projects

              <ArrowRight
                size={16}
                strokeWidth={1.3}
              />
            </Link>

          </div>

        </div>


        {/* PROJECT GRID */}
        <div className="home-projects-grid">

          {projects.map((project) => (

            <article
              className="home-project-card"
              key={project.id}
            >

              <Link
                to={`/projects/${project.slug}`}
                className="home-project-image"
              >

                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.name}
                  />
                ) : (
                  <div className="home-project-placeholder">
                    <span>IMAGE PLACEHOLDER</span>
                    <small>ADMIN UPLOAD</small>
                  </div>
                )}

                <span className="home-project-arrow">
                  <ArrowRight
                    size={18}
                    strokeWidth={1.3}
                  />
                </span>

              </Link>


              <div className="home-project-content">

                <span className="home-project-category">
                  {project.category}
                </span>

                <h3>
                  {project.name}
                </h3>

              </div>

            </article>

          ))}

        </div>


        {/* BOTTOM CTA */}
        <div className="home-projects-cta">

          <div>
            <span>
              Every space has a story.
            </span>

            <h3>
              Let&apos;s create yours.
            </h3>
          </div>

          <Link
            to="/projects"
            className="nova-btn nova-btn-outline"
          >
            Explore Projects

            <ArrowRight
              size={16}
              strokeWidth={1.3}
            />
          </Link>

        </div>

      </div>

    </section>
  );
}

export default HomeProjects;