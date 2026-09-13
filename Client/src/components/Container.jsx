function Container({ children, className = "" }) {
  return (
    <div className={`nova-container ${className}`}>
      {children}
    </div>
  );
}

export default Container;