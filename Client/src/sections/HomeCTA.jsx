function HomeWhyNova() {
  const features = [
    {
      number: "01",
      title: "Bespoke Design",
      text: "Surfaces designed around your space, style and vision.",
    },
    {
      number: "02",
      title: "Premium Materials",
      text: "High-quality materials selected for refined finishes and lasting performance.",
    },
    {
      number: "03",
      title: "Expert Craftsmanship",
      text: "Precision application with attention given to every detail.",
    },
    {
      number: "04",
      title: "Built to Last",
      text: "Surfaces created to retain their beauty and character for years.",
    },
  ];

  return (
    <section className="home-why">
      <div className="home-why-line" />

      <div className="nova-container home-why-inner">
        <div className="home-why-intro">
          <span className="nova-eyebrow">Why NOVA</span>

          <h2 className="home-why-title">
            Surfaces.
            <br />
            <span>Crafted Differently.</span>
          </h2>

          <p className="home-why-description">
            We believe flooring should do more than cover a space. It should
            shape the atmosphere, complement the architecture, and become part
            of the experience.
          </p>
        </div>

        <div className="home-why-list">
          {features.map((feature) => (
            <div className="home-why-item" key={feature.number}>
              <span className="home-why-number">{feature.number}</span>

              <div className="home-why-content">
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeWhyNova;