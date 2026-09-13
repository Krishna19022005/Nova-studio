function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}) {
  return (
    <div
      className={`nova-section-heading nova-section-heading-${align} ${className}`}
    >
      {eyebrow && (
        <span className="nova-eyebrow">
          {eyebrow}
        </span>
      )}

      {title && (
        <h2 className="nova-section-title">
          {title}
        </h2>
      )}

      {description && (
        <p className="nova-section-description">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;