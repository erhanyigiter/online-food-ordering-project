const Container = ({ children, className = "", ...props }) => {
  return (
    <div className={`max-w-[2850px] mx-auto p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Container;
