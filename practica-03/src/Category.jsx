function Category({ titulo, children }) {
  return (
    <div className="category">
      <h2>{titulo}</h2>
      <div className="fila">
        {children}
      </div>
    </div>
  );
}

export default Category;