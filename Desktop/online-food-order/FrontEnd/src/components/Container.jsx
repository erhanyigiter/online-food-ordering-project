const Container = ({ children, className = "", ...props }) => {
  return (
    <div className={`max-w-[1200px] mx-auto p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Container;
