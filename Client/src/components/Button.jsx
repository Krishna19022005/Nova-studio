function Button({
  children,
  variant = "primary",
  href,
  type = "button",
  className = "",
  onClick,
}) {
  const classes = [
    "nova-btn",
    `nova-btn-${variant}`,
    className,
  ].join(" ");

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;